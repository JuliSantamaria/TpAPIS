import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, total } = useCart();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">El carrito está vacío.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item, index) => (
            <li key={index} className="flex items-center justify-between gap-4">
              <img
                src={`/img/${item.imagenes[0]}`}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.nombre}</p>
                <p className="text-sm text-gray-600">${item.precio}</p>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 font-bold text-xl">Total: ${total}</div>
      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Finalizar compra
      </button>
    </div>
  );
}