import {createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
  
    const addToCart = (product, quantity = 1) => {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
  
        if (existingItem) {
          // Si ya está en el carrito, actualizá la cantidad (sin pasar el stock)
          return prev.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity > product.stock
                      ? product.stock
                      : item.quantity + quantity,
                }
              : item
          );
        } else {
          // Si no está, agregalo con la cantidad
          return [...prev, { ...product, quantity }];
        }
      });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      };
      
    const total = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  
    const removeFromCart = (index) => {
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    };
  
    const clearCart = () => setCartItems([]);
  
    return (
      <CartContext.Provider
        value={{ updateQuantity, cartItems, addToCart, removeFromCart, clearCart, total }}
      >
        {children}
      </CartContext.Provider>
    );
  }

export function useCart() {
    const context = useContext(CartContext);
    return context;
}