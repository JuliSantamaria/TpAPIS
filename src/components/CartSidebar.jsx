import { useCart } from "../context/CartContext";
import "../assets/CartSidebar.css";

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, total, removeFromCart } = useCart();

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Carrito de compras</h2>
        <button onClick={onClose}>✖</button>
      </div>

      {cartItems.length === 0 ? (
        <div classNa  me="cart-empty">
          <p>No hay productos en el carrito.</p>
          <button onClick={onClose}>REGRESAR A LA TIENDA</button>
        </div>
      ) : (
        <div className="cart-content">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img
                src={`/img/${item.imagenes?.[0] ?? "default.png"}`}
                alt={item.nombre}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default.png";
                }}
                style={{ width: "100px", height: "auto" }}
              />
              <div>
                <h4>{item.nombre}</h4>
                <p>{item.quantity} x ${Number(item.precio).toFixed(2)
                }</p>
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