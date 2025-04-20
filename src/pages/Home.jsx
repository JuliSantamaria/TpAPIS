import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import "../assets/home.css"; 

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/productos")
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
          <div key={product.id} className="product-card">
            <img
              src={`/img/${product.imagenes[0]}`}
              alt={product.nombre}
              className="product-image"
            />
            <h3>{product.nombre}</h3>
            <p>${product.precio}</p>
            {product.stock > 0 ? (
              <p className="product-status-in-stock">🟢 En stock</p>
            ) : (
              <p className="product-status-out-of-stock">🔴 Sin stock</p>
            )}
            <Link to={`/product/${product.id}`} className="product-link">
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
