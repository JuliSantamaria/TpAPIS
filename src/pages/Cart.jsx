import { useCart } from "../context/CartContext";
import "../assets/carrito.css"
export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto p-4">
      {/* Carrito */}
      <div className="flex-1 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío.</p>
        ) : (
          <ul className="space-y-6">
            {cartItems.map((item, index) => (
              <li key={item.id} className="flex gap-4">
                <img
                  src={`/img/${item.imagenes[0]}`}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.nombre}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        item.quantity < item.stock &&
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 border rounded"
                    >
                      +
                    </button>
                    <span className="ml-4 font-bold">
                      ${(item.precio * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-green-600 mt-1">
                    {item.precio * item.quantity > 10000
                      ? "Envío gratis"
                      : "Agregá más productos para envío gratis"}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Resumen */}
      <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Resumen de compra</h3>
        <div className="flex justify-between mb-2">
          <span>Productos</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Envío</span>
          <span>Gratis</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="mt-4 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
          Continuar compra
        </button>
      </div>
    </div>
  );
}