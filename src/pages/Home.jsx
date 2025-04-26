import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
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
      
      <div className="products-grid">
        {productos.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
