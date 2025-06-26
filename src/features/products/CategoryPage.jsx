import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import "../../assets/home.css";
import { API_URLS, handleApiError } from "../../config/api";

export default function CategoryPage() {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get(API_URLS.PRODUCTOS_BY_CATEGORIA(nombre));
        // Ordenar igual que en Home
        const ordenados = res.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProductos(ordenados);
        setError("");
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(handleApiError(err));
      }
    };
    fetchProductos();
  }, [nombre]);

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="text-2xl font-bold my-5 text-center text-capitalize">
        Categoría: {nombre}
      </h2>

      {productos.length === 0 ? (
        <p className="text-center">No hay productos en esta categoría.</p>
      ) : (
        <div className="products-grid">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </div>
  );
}