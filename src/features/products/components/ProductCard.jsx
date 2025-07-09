import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../auth/axiosInstance";
import { useCart } from "../../cart/context/CartContext";
import { useAuth } from "../../auth/context/AuthContext";
import "../../../assets/ProductCard.css";

export default function ProductCard({ product }) {
  const { nombre, descripcion, precio, stock, imagenes, usuario } = product;
  const { addToCart, openCart } = useCart();
  const { user } = useAuth();
  const [vendedor, setVendedor] = useState(null);
  const [error, setError] = useState("");
  const isOwner = user && usuario && user.id === usuario.id;

  useEffect(() => {
    const fetchVendedor = async () => {
      if (usuario && usuario.id) {
        try {
          const res = await axios.get(`/api/usuarios/${usuario.id}`);
          setVendedor(res.data);
        } catch (err) {
          console.error("Error al cargar vendedor:", err);
          setError("Error al cargar información del vendedor");
        }
      }
    };

    fetchVendedor();
  }, [usuario]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-card">
      {isOwner && (
        <div className="owner-badge">
          Mi Producto
        </div>
      )}
        <img
          src={
            imagenes && imagenes.length > 0
              ? imagenes[0].startsWith('http')
                ? imagenes[0]
                : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/uploads/${imagenes[0]}`
              : '/img/placeholder-image.png'
          }
          alt={nombre}
          className="product-image"
          onError={(e) => {
            if (e.target.src.endsWith('/img/placeholder-image.png')) return;
            e.target.onerror = null;
            e.target.src = '/img/placeholder-image.png';
          }}
        />
      <h3>{nombre}</h3>
      <p className="product-description">{descripcion}</p>
      {vendedor && (
        <p className="seller-info">
          Vendedor: {vendedor.nombre} {vendedor.apellido}
        </p>
      )}
      <p className="product-price">${precio}</p>
      <p className={`product-stock ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
        {stock > 0 ? '🟢 En stock' : '🔴 Sin stock'}
      </p>
      
      <div className="product-actions">
        {isOwner ? (
          <>
            <Link to="/gestion-productos" className="edit-button">
              Editar
            </Link>
          </>
        ) : (
          stock > 0 && (
            <button
              className="add-to-cart-button"
              onClick={() => {
                addToCart(product);
                openCart();
              }}
            >
              Agregar al carrito
            </button>
          )
        )}
        <Link to={`/product/${product.id}`} className="view-details-button">
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
