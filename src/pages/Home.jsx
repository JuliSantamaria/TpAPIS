
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then((res) => res.json())
      .then((data) => {
        const ordenados = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProductos(ordenados);
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  return (
    <div className="container">
      <h2 className="text-2xl font-bold my-5 text-center">Catálogo de Productos</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {productos.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={`/img/${product.imagenes[0]}`}
              alt={product.nombre}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "0.5rem",
              }}
            />
            <h3>{product.nombre}</h3>
            <p>${product.precio}</p>
            {product.stock > 0 ? (
              <p style={{ color: "green" }}>🟢 En stock</p>
            ) : (
              <p style={{ color: "red" }}>🔴 Sin stock</p>
            )}
            <Link
              to={`/product/${product.id}`}
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "#333",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
