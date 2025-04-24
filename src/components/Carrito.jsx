import React from "react";

const Cart = ({ cartItems, removeFromCart, clearCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Carrito</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} >
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(index)} >Eliminar</button>
              </li>
            ))}
          </ul>
          <p>Total: ${total}</p>
          <button onClick={clearCart}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;