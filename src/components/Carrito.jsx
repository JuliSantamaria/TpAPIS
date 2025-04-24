import React from "react";

const Cart = ({ cartItems, removeFromCart, clearCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="border p-4">
      <h2>Carrito</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between">
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(index)} className="text-red-500">Eliminar</button>
              </li>
            ))}
          </ul>
          <p>Total: ${total}</p>
          <button onClick={clearCart} className="bg-green-500 text-white mt-2 px-2 py-1">Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;