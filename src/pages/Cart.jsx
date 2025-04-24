import { useCart } from "../context/CartContext";
import "./carrito.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div >
      {/* Carrito */}
      <div >
        <h2>Tu carrito</h2>
        {cartItems.length === 0 ? (
          <p >El carrito está vacío.</p>
        ) : (
          <ul >
            {cartItems.map((item, index) => (
              <li key={item.id} >
                <img
                  src={`/img/${item.imagenes[0]}`}
                  alt={item.nombre}
                  
                />
                <div >
                  <p >{item.nombre}</p>
                  <div >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                     
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        item.quantity < item.stock &&
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      
                    >
                      +
                    </button>
                    <span >
                      ${(item.precio * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <p >
                    {item.precio * item.quantity > 10000
                      ? "Envío gratis"
                      : "Agregá más productos para envío gratis"}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Resumen */}
      <div >
        <h3>Resumen de compra</h3>
        <div>
          <span>Productos</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div >
          <span>Envío</span>
          <span>Gratis</span>
        </div>
        <hr  />
        <div>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button >
          Continuar compra
        </button>
      </div>
    </div>
  );
}
