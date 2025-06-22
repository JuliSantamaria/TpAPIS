import { useEffect, useState } from "react";
import ProductCard from "../features/products/components/ProductCard";
import "../assets/home.css";
import Carousel from "../shared/components/Carousel";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URLS, handleApiError } from "../config/api";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar todos los productos
  const fetchAllProductos = async () => {
    try {
      const response = await axios.get(API_URLS.PRODUCTOS);
      const ordenados = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProductos(ordenados);
      setFilteredProducts(ordenados);
      setError(null);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(handleApiError(err));
    }
  };

  // Función para buscar productos
  const searchProductos = async (query) => {
    try {
      const response = await axios.get(`${API_URLS.PRODUCTOS}/search`, {
        params: {
          nombre: query
        }
      });
      setFilteredProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError(handleApiError(err));
    }
  };

  // Efecto para cargar productos iniciales
  useEffect(() => {
    fetchAllProductos();
  }, []);

  // Efecto para manejar la búsqueda
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setIsSearching(true);
      searchProductos(query);
    } else {
      setIsSearching(false);
      setFilteredProducts(productos);
    }
  }, [searchParams, productos]);

  return (
    <div className="container">
      {!isSearching && <Carousel />}
      <h2 className="header-diseñado">
        {isSearching ? "Resultados de búsqueda" : "Catálogo de Productos"}
      </h2>
      
      {error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
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