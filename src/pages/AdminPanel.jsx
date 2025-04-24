import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Estado para las categorías
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
  const [newCategoria, setNewCategoria] = useState(""); // Estado para nueva categoría
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(""); // Estado para mensajes de éxito

  // Cargar productos y categorías desde la API
  useEffect(() => {
    fetch("http://localhost:3002/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        // Extraer categorías únicas
        const categoriasUnicas = [...new Set(data.map((prod) => prod.categoria))];
        setCategorias(categoriasUnicas);
      })
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar cambios en el campo de nueva categoría
  const handleNewCategoriaChange = (e) => {
    setNewCategoria(e.target.value);
  };

  // Crear o actualizar un producto
  const handleSubmit = (e) => {
    e.preventDefault();

    const confirmMessage = isEditing
      ? "¿Estás seguro de que deseas modificar este producto?"
      : "¿Estás seguro de que deseas agregar este producto?";
    if (!window.confirm(confirmMessage)) return;

    // Si no se selecciona una categoría existente, usar la nueva categoría ingresada
    const categoriaFinal = newCategoria || formData.categoria;

    if (!categoriaFinal) {
      setMessage("Debes ingresar o seleccionar una categoría.");
      return;
    }

    // Si se ingresó una nueva categoría, agregarla al listado
    if (newCategoria && !categorias.includes(newCategoria)) {
      setCategorias((prev) => [...prev, newCategoria]);
      setNewCategoria(""); // Limpiar el campo de nueva categoría
    }

    if (isEditing) {
      // Actualizar producto
      fetch(`http://localhost:3002/productos/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoria: categoriaFinal,
          imagenes: formData.imagenes.split(","),
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
      // Crear producto
      fetch("http://localhost:3002/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoria: categoriaFinal,
          id: Date.now().toString(), // Generar un ID único
          imagenes: formData.imagenes.split(","),
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

  // Eliminar un producto
  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    fetch(`http://localhost:3002/productos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setProductos((prev) => prev.filter((prod) => prod.id !== id));
      setMessage("Producto eliminado exitosamente.");
    });
  };

  // Cargar datos en el formulario para editar
  const handleEdit = (producto) => {
    setFormData({
      ...producto,
      imagenes: producto.imagenes.join(","),
    });
    setIsEditing(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panel de Administrador</h1>

      {/* Mostrar mensaje de éxito */}
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      {/* Formulario para crear/editar productos */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h2>{isEditing ? "Editar Producto" : "Crear Producto"}</h2>
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
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nueva categoría (opcional)"
          value={newCategoria}
          onChange={handleNewCategoriaChange}
        />
        <input
          type="text"
          name="imagenes"
          placeholder="Imágenes (separadas por comas)"
          value={formData.imagenes}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? "Actualizar" : "Crear"}</button>
      </form>

      {/* Lista de productos */}
      <h2>Productos</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
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
              <td>
                <button onClick={() => handleEdit(producto)}>Editar</button>
                <button onClick={() => handleDelete(producto.id)}>
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