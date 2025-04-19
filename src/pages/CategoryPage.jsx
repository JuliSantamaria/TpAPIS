
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { nombre } = useParams(); // nombre de la categoría desde la URL
  const [productos, setProductos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products") // Ruta de json-server
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        const filtradosPorCategoria = data.filter(
          (prod) => prod.category.toLowerCase() === nombre.toLowerCase()
        );
        setFiltrados(filtradosPorCategoria);
      })
      .catch((err) => console.error("Error al cargar productos:", err));
  }, [nombre]);

  return (
    <div className="container">
      <h2 className="text-2xl font-bold my-5 text-center text-capitalize">
        Categoría: {nombre}
      </h2>

      {filtrados.length === 0 ? (
        <p className="text-center">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filtrados.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
