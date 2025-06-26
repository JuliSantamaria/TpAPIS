import { useState, useEffect } from "react";
import { useAuth } from "../auth/context/AuthContext";
import axios from "../auth/axiosInstance";
import { API_URLS } from "../../config/api";
import "../../assets/GestionProductos.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const CATEGORIAS = ["Guitarras", "Baterias", "Pianos", "Viento", "Percusion"];
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    descripcionDetallada: "",
    precio: "",
    stock: "",
    categoria: "",
    imagenes: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    const fetchProductos = async () => {
      if (!user) return;

      try {
        const response = await axios.get(API_URLS.MIS_PRODUCTOS);
        setProductos(response.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(err.response?.data?.error || "Error al cargar los productos");
      }
    };

    fetchProductos();const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    await MySwal.fire({
      icon: 'error',
      title: 'Campos obligatorios incompletos',
      text: error || 'Por favor, completa todos los campos requeridos y sube al menos una imagen.',
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });
    return;
  }

  try {
    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
    };

    let response;
    if (isEditing) {
      response = await axios.put(`${API_URLS.PRODUCTOS}/${formData.id}`, productoData);
    } else {
      response = await axios.post(API_URLS.PRODUCTOS, productoData);
    }
    if (selectedFiles.length > 0) {
      const imageNames = await uploadImages(response.data.id);
      response.data.imagenes = imageNames;
      await axios.put(`${API_URLS.PRODUCTOS}/${response.data.id}`, response.data);
    }

    await MySwal.fire({
      icon: 'success',
      title: isEditing ? 'Producto actualizado' : 'Producto creado',
      text: isEditing ? 'El producto fue actualizado correctamente.' : 'El producto fue creado exitosamente.',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });

    setFormData({
      nombre: "",
      descripcion: "",
      descripcionDetallada: "",
      precio: "",
      stock: "",
      categoria: "",
      imagenes: []
    });

    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles([]);
    setIsEditing(false);

    // Recargar productos
    const res = await axios.get(API_URLS.PRODUCTOS);
    const productosActualizados = res.data.filter(
      prod => prod.usuario && prod.usuario.id === user.id
    );
    setProductos(productosActualizados);
    setMessage("");
    setError("");
  } catch (err) {
    console.error('Error:', err);
    await MySwal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: err.response?.data?.error || 'Error al procesar la operación',
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });
    setError(err.response?.data?.error || 'Error al procesar la operación');
  }
};
  }, [user]);

  const handleFileSelect = (event) => {
    const files = [...event.target.files];
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Crear URLs de previsualización para las nuevas imágenes
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Liberar URL de previsualización
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Limpiar URLs de previsualización al desmontar
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const uploadImages = async (productoId) => {
    const uploadedImageNames = [];
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          `${API_URLS.PRODUCTOS}/${productoId}/imagenes`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadedImageNames.push(response.data.fileName);
      } catch (error) {
        console.error("Error al subir imagen:", error);
        throw error;
      }
    }
    return uploadedImageNames;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "imagenes") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((img) => img.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const validateForm = () => {
    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.precio ||
      !formData.stock ||
      !formData.categoria
    ) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    if (isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      setError("El precio debe ser un número válido mayor que 0");
      return false;
    }
    if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      setError("El stock debe ser un número válido mayor o igual a 0");
      return false;
    }
    // Validar que haya al menos una imagen (nueva o existente)
    const totalImagenes = (formData.imagenes ? formData.imagenes.length : 0) + selectedFiles.length;
    if (totalImagenes === 0) {
      setError("Debe haber al menos una imagen para el producto");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    await MySwal.fire({
      icon: 'error',
      title: 'Campos obligatorios incompletos',
      text: error || 'Por favor, completa todos los campos requeridos y sube al menos una imagen.',
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });
    return;
  }

  try {
    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
    };

    let response;
    if (isEditing) {
      response = await axios.put(`${API_URLS.PRODUCTOS}/${formData.id}`, productoData);
    } else {
      response = await axios.post(API_URLS.PRODUCTOS, productoData);
    }
    if (selectedFiles.length > 0) {
      const imageNames = await uploadImages(response.data.id);
      response.data.imagenes = imageNames;
      await axios.put(`${API_URLS.PRODUCTOS}/${response.data.id}`, response.data);
    }

    await MySwal.fire({
      icon: 'success',
      title: isEditing ? 'Producto actualizado' : 'Producto creado',
      text: isEditing ? 'El producto fue actualizado correctamente.' : 'El producto fue creado exitosamente.',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });

    setFormData({
      nombre: "",
      descripcion: "",
      descripcionDetallada: "",
      precio: "",
      stock: "",
      categoria: "",
      imagenes: []
    });

    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles([]);
    setIsEditing(false);

    // Recargar productos
    const res = await axios.get(API_URLS.PRODUCTOS);
    const productosActualizados = res.data.filter(
      prod => prod.usuario && prod.usuario.id === user.id
    );
    setProductos(productosActualizados);
    setMessage("");
    setError("");
  } catch (err) {
    console.error('Error:', err);
    await MySwal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: err.response?.data?.error || 'Error al procesar la operación',
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });
    setError(err.response?.data?.error || 'Error al procesar la operación');
  }
};

const handleDelete = async (id) => {
  const result = await MySwal.fire({
    title: '¿Estás seguro de que quieres eliminar este producto?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: { popup: 'swal2-border-radius' }
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/api/productos/${id}`);
    setProductos(productos.filter((prod) => prod.id !== id));
    setMessage("Producto eliminado exitosamente");
    await MySwal.fire({
      icon: 'success',
      title: 'Producto eliminado',
      text: 'El producto fue eliminado correctamente.',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });
  } catch (err) {
    console.error("Error al eliminar:", err);
    setError(err.response?.data?.error || "Error al eliminar el producto");
    await MySwal.fire({
      icon: 'error',
      title: 'Error al eliminar',
      text: err.response?.data?.error || 'Por favor, completa todos los campos requeridos antes de eliminar.',
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Ok',
      customClass: { popup: 'swal2-border-radius' }
    });
  }
};

  const handleEdit = (producto) => {
    setFormData({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      descripcionDetallada: producto.descripcionDetallada || "",
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      categoria: producto.categoria,
      imagenes: producto.imagenes || [],
    });
    setIsEditing(true);
  };

  const handleRemoveImage = async (productoId, fileName) => {
    try {
      await axios.delete(`${API_URLS.PRODUCTOS}/${productoId}/imagenes/${fileName}`);
      
      // Actualizar el estado local
      setFormData(prev => ({
        ...prev,
        imagenes: prev.imagenes.filter(img => img !== fileName)
      }));

      // Actualizar la lista de productos
      setProductos(prev =>
        prev.map(p =>
          p.id === productoId
            ? { ...p, imagenes: p.imagenes.filter(img => img !== fileName) }
            : p
        )
      );

      setMessage('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      setError('Error al eliminar la imagen');
    }
  };

  if (!user) {
    return <p>Debe iniciar sesión para gestionar productos</p>;
  }

  return (
      <div className="gestion-container">
        <form onSubmit={handleSubmit} className="formulario">
          <h2 style={{
            textAlign: "center",
            margin: "0 0 18px 0",
            fontWeight: "bold",
            fontSize: "2rem"
          }}>
            {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
    <div className="form-group">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del producto"
        value={formData.nombre}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <textarea
        name="descripcion"
        placeholder="Descripción corta"
        value={formData.descripcion}
        onChange={handleChange}
        rows={2}
      />
    </div>
    <div className="form-group">
      <textarea
        name="descripcionDetallada"
        placeholder="Descripción detallada"
        value={formData.descripcionDetallada}
        onChange={handleChange}
        rows={2}
      />
    </div>
    <div className="form-group">
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <select
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
      >
        <option value="">Selecciona una categoría</option>
        {CATEGORIAS.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
    <div className="form-group file-upload-container">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="file-input"
      />
      <div className="selected-files">
        {previewUrls.map((url, index) => (
          <div key={index} className="selected-file-preview">
            <img 
              src={url} 
              alt={`Preview ${index + 1}`} 
              className="image-preview"
            />
            <button
              type="button"
              onClick={() => removeSelectedFile(index)}
              className="remove-image"
            >
              ×
            </button>
            <span className="file-name">{selectedFiles[index].name}</span>
          </div>
        ))}
      </div>
    </div>
    {isEditing && formData.imagenes && formData.imagenes.length > 0 && (
      <div className="current-images">
        <h4>Imágenes actuales:</h4>
        <div className="images-grid">
          {formData.imagenes.map((img, index) => (
            <div key={index} className="image-container">
              <img src={`/img/${img}`} alt={`Producto ${index + 1}`} />
              <button
                type="button"
                onClick={() => handleRemoveImage(formData.id, img)}
                className="remove-image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
    <button type="submit" className="submit-button">
      {isEditing ? "Actualizar Producto" : "Crear Producto"}
    </button>
  </form>

      <div className="productos-list">
        <h3>Mis Productos</h3>
        {productos.map((producto) => (
          <div key={producto.id} className="producto-item">
            <h4>{producto.nombre}</h4>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: {producto.stock}</p>
            <div className="button-group">
              <button onClick={() => handleEdit(producto)}>Editar</button>
              <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}