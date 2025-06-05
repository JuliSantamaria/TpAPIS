import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../cart/context/CartContext";
import { useAuth } from "../auth/context/AuthContext";
import axios from "axios";
import { API_URLS, handleApiError } from "../../config/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    const fetchProductDetail = async () => {
      if (!id) {
        setError('ID de producto no válido');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const productoRes = await axios.get(API_URLS.PRODUCTO_BY_ID(id));
        let data = productoRes.data;
        
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        if (!isMounted) return;
        
        setProducto(data);

        if (data?.usuario?.id) {
          const vendedorRes = await axios.get(API_URLS.USUARIO_BY_ID(data.usuario.id));
          if (!isMounted) return;
          setVendedor(vendedorRes.data);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error:", err);
        setError(handleApiError(err));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductDetail();

    return () => {
      isMounted = false;
    };
  }, [id]); // solo depende de id

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    try {
      await axios.delete(API_URLS.PRODUCTO_BY_ID(id));
      alert("Producto eliminado exitosamente");
      navigate("/gestion-productos");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError(handleApiError(err));
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return <p>No se encontró el producto</p>;

  const { nombre, descripcionDetallada, precio, imagenes = [], stock } = producto;
  // Solo loguear en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log({ producto, nombre, precio, stock, imagenes });
  }
  const isOwner = user && producto.usuario && user.id === producto.usuario.id;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#666",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        ← Volver al catálogo
      </button>

      <h1 style={{ textAlign: "center" }}>{nombre}</h1>

      {/* Información del vendedor */}
      {vendedor ? (
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "1rem", 
          borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          <h3>Vendedor</h3>
          <p>{vendedor.nombre} {vendedor.apellido}</p>
        </div>
      ) : null}

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
        marginBottom: "1rem",
      }}>
        {imagenes && imagenes.length > 0 ? (
          imagenes.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:8080/uploads/${img}`}
              alt={`${nombre} - Imagen ${index + 1}`}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ddd"
              }}
              onError={(e) => {
                console.error('Error loading image:', img);
                e.target.onerror = null;
                e.target.src = '/img/placeholder-image.png';
              }}
            />
          ))
        ) : (
          <div style={{
            width: "200px",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            border: "1px solid #ddd"
          }}>
            <p>No hay imágenes disponibles</p>
          </div>
        )}
      </div>

      <p>{descripcionDetallada}</p>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        {typeof precio === 'number' ? `$${precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : 'Precio no disponible'}
      </p>

      <p style={{ fontSize: "1.1rem", color: stock > 0 ? "green" : "red" }}>
        {stock > 0 ? `Stock disponible: ${stock} unidades` : "Sin stock"}
      </p>

      {isOwner ? (
        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button
            onClick={() => navigate(`/gestion-productos`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Editar Producto
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Eliminar Producto
          </button>
        </div>
      ) : stock > 0 ? (
        <button
          onClick={() => {
            addToCart(producto);
          }}
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Agregar al carrito
        </button>
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}>Sin stock</p>
      )}
    </div>
  );
}