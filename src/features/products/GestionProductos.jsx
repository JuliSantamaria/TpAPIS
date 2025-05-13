import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../assets/GestionProductos.css"; 

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const CATEGORIAS = ["Guitarras", "Baterias", "Pianos", "Viento", "Percusion"];
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    descripcionDetallada: "",
    precio: "",
    stock: "",
    categoria: "",
    imagenes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:3002/productos")
      .then((res) => res.json())
      .then((data) => {
        const misProductos = data.filter((prod) => prod.userId === user.id);
        setProductos(misProductos);
      })
      .catch((err) => console.error("Error al cargar productos:", err));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (parseFloat(formData.precio) <= 0) {
      setMessage("El precio debe ser mayor a 0");
      return false;
    }
    if (parseInt(formData.stock) < 0) {
      setMessage("El stock no puede ser negativo");
      return false;
    }
    if (formData.nombre.trim().length < 3) {
      setMessage("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    if (!formData.imagenes) {
      setMessage("Debe incluir al menos una imagen");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Debes iniciar sesión para realizar esta acción");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const confirmMessage = isEditing
      ? "¿Estás seguro de que deseas modificar este producto?"
      : "¿Estás seguro de que deseas agregar este producto?";
    if (!window.confirm(confirmMessage)) return;

    if (isEditing) {
      const producto = productos.find((p) => p.id === formData.id);
      if (producto?.userId !== user.id) {
        setMessage("No tienes permiso para editar este producto");
        return;
      }

      fetch(`http://localhost:3002/productos/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imagenes: formData.imagenes.split(","),
          userId: user.id,
        }),
      })
        .then((res) => res.json())
        .then((updatedProduct) => {
          setProductos((prev) =>
            prev.map((prod) =>
              prod.id === updatedProduct.id ? updatedProduct : prod
            )
          );
          setIsEditing(false);
          setFormData({
            id: "",
            nombre: "",
            descripcion: "",
            descripcionDetallada: "",
            precio: "",
            stock: "",
            categoria: "",
            imagenes: "",
          });
          setMessage("Producto modificado exitosamente.");
        });
    } else {
      fetch("http://localhost:3002/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: Date.now().toString(),
          imagenes: formData.imagenes.split(","),
          userId: user.id,
        }),
      })
        .then((res) => res.json())
        .then((newProduct) => {
          setProductos((prev) => [...prev, newProduct]);
          setFormData({
            id: "",
            nombre: "",
            descripcion: "",
            descripcionDetallada: "",
            precio: "",
            stock: "",
            categoria: "",
            imagenes: "",
          });
          setMessage("Producto agregado exitosamente.");
        });
    }
  };

  const handleDelete = (id) => {
    const producto = productos.find((p) => p.id === id);
    if (producto?.userId !== user.id) {
      setMessage("No tienes permiso para eliminar este producto");
      return;
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    fetch(`http://localhost:3002/productos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setProductos((prev) => prev.filter((prod) => prod.id !== id));
      setMessage("Producto eliminado exitosamente.");
    });
  };

  const handleEdit = (producto) => {
    if (producto.userId !== user.id) {
      setMessage("No tienes permiso para editar este producto");
      return;
    }

    setFormData({
      ...producto,
      imagenes: producto.imagenes.join(","),
    });
    setIsEditing(true);
  };

  if (!user) {
    return (
      <div className="no-user">
        <h1>Gestión de Productos</h1>
        <p>Debes iniciar sesión para gestionar tus productos.</p>
      </div>
    );
  }

  return (
    <div className="gestion-productos">
      <h1>Gestión de Productos</h1>
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <h2>{isEditing ? "Editar Producto" : "Crear Producto"}</h2>
        <div className="formulario">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcionDetallada"
            placeholder="Descripción Detallada"
            value={formData.descripcionDetallada}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="1"
          />
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            {CATEGORIAS.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="imagenes"
            placeholder="Imágenes (separadas por comas)"
            value={formData.imagenes}
            onChange={handleChange}
            required
          />
          <button type="submit">{isEditing ? "Actualizar" : "Crear"}</button>
        </div>
      </form>

      <h2>Mis Productos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.stock}</td>
              <td className="action-buttons">
                <button 
                  onClick={() => handleEdit(producto)}
                  className="edit-button"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(producto.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}