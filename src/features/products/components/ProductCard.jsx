import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../cart/context/CartContext";
import { useAuth } from "../../auth/context/AuthContext";
import "../../../assets/ProductCard.css";

export default function ProductCard({ product }) {
  const { nombre, descripcion, precio, stock, imagenes, userId } = product;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [vendedor, setVendedor] = useState(null);
  const isOwner = user && user.id === userId;

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3002/usuarios/${userId}`)
        .then((res) => res.json())
        .then((data) => setVendedor(data))
        .catch((err) => console.error("Error al cargar vendedor:", err));
    }
  }, [userId]);

  return (
    <div className="product-card">
      {isOwner && (
        <div className="owner-badge">
          Mi Producto
        </div>
      )}
      
      <img
        src={`/img/${imagenes[0]}`}
        alt={nombre}
        className="product-image"
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
              onClick={() => addToCart(product)}
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