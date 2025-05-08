import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../assets/home.css";
import Carousel from "../components/Carousel";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetch("http://localhost:3002/productos")
      .then((res) => res.json())
      .then((data) => {
        const ordenados = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProductos(ordenados);
        setFilteredProducts(ordenados);
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    if (query) {
      const filtered = productos.filter((product) =>
        product.nombre.toLowerCase().includes(query.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(query.toLowerCase()) ||
        product.categoria.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(productos);
    }
  }, [searchParams, productos]);

  return (
    <div className="container">
      <Carousel/>
      <h2 className="text-2xl font-bold my-5 text-center">Catálogo de Productos</h2>
      
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No se han encontrado productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
}
