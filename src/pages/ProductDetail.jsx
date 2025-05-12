import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    console.log("ID del producto:", id);
    
    fetch(`http://localhost:3002/productos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Producto no encontrado (ID: ${id})`);
        }
        return res.json();
      })
      .then((data) => {
        setProducto(data);
        return fetch(`http://localhost:3002/usuarios/${data.userId}`);
      })
      .then((res) => res.json())
      .then((userData) => {
        setVendedor(userData);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        setError(err.message);
      });
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    fetch(`http://localhost:3002/productos/${id}`, {
      method: "DELETE",
    }).then(() => {
      alert("Producto eliminado exitosamente");
      navigate("/gestion-productos");
    });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto || !vendedor) return <p>Cargando...</p>;

  const { nombre, descripcionDetallada, precio, imagenes, stock, userId } = producto;
  const isOwner = user && user.id === userId;

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
      <div style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "1rem", 
        borderRadius: "8px",
        marginBottom: "1rem"
      }}>
        <h3>Vendedor</h3>
        <p>{vendedor.nombre} {vendedor.apellido}</p>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
        marginBottom: "1rem",
      }}>
        {imagenes.map((img, index) => (
          <img
            key={index}
            src={`/img/${img}`}
            alt={`Imagen ${index + 1}`}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ))}
      </div>

      <p>{descripcionDetallada}</p>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${precio}</p>

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
            console.log("Click en agregar al carrito");
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