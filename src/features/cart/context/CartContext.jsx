import {createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const toggleCart = () => setIsCartOpen((prev) => !prev);
    const closeCart = () => setIsCartOpen(false);
    const openCart = () => setIsCartOpen(true);

    const addToCart = (product, quantity = 1) => {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
  
        if (existingItem) {
          
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
          
          return [...prev, { ...product, precio: Number(product.precio), quantity }];
        }
      });
    };

    const increaseQuantity = (productId) => {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity + 1 > item.stock
                    ? item.stock
                    : item.quantity + 1,
              }
            : item
        )
      );
    };

    const decreaseQuantity = (productId) => {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
        );
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
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
        increaseQuantity,
        decreaseQuantity, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
  }

export function useCart() {
    const context = useContext(CartContext);
    return context;
}