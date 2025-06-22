import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";

export default function CategoryPage() {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/productos/categoria/${nombre}`
        );
        setProductos(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(
          "Error al cargar productos: " +
            (err.response?.data?.error || err.message)
        );
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
        <div className="grid md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </div>
  );
}