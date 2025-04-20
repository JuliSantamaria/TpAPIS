import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext"; // 👈 Importar hook

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null); // 👈 Estado para manejar errores
  const { addToCart } = useCart(); // 👈 Usar hook

  useEffect(() => {
    fetch(`http://localhost:3002/productos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Producto no encontrado (ID: ${id})`);
        }
        return res.json();
      })
      .then((data) => setProducto(data))
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        setError(err.message); // 👈 Guardar el mensaje de error
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>; // 👈 Mostrar error si ocurre
  if (!producto) return <p>Cargando...</p>;

  const { nombre, descripcionDetallada, precio, imagenes, stock } = producto;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>{nombre}</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
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

      {stock > 0 ? (
        <button
          onClick={() => {
            console.log("Click en agregar al carrito");
            addToCart(producto); // 👈 Agregar al carrito correctamente
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