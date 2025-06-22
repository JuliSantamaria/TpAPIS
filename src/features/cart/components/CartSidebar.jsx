import { useCart } from "../context/CartContext";
import "../../../assets/CartSidebar.css";

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, total, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Carrito de compras</h2>
        <button onClick={onClose}>✖</button>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>No hay productos en el carrito.</p>
          <button onClick={onClose}>REGRESAR A LA TIENDA</button>
        </div>
      ) : (
        <div className="cart-content">
          {cartItems.map((item, index) => (
  <div key={index} className="cart-item">
    <img
      src={
        item.imagenes && item.imagenes.length > 0
          ? (item.imagenes[0].startsWith('http')
              ? item.imagenes[0]
              : `http://localhost:8080/uploads/${item.imagenes[0]}`)
          : '/img/placeholder-image.png'
      }
      alt={item.nombre}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/img/placeholder-image.png';
      }}
      style={{ width: "100px", height: "auto" }}
    />
    <div>
      <h4>{item.nombre}</h4>
      <p>${Number(item.precio).toFixed(2)}</p>

      {/* Botones de cantidad */}
      <div className="quantity-controls" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => decreaseQuantity(item.id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => increaseQuantity(item.id)}>+</button>
      </div>

      <p>Subtotal: ${(item.precio * item.quantity).toFixed(2)}</p>
      <button onClick={() => removeFromCart(index)}>Eliminar</button>
    </div>
  </div>
))}

          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        </div>
      )}
    </div>
  );
}