import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const isClient = typeof window !== 'undefined';
  const [cartItems, setCartItems] = useState(() => {
    try {
      return isClient
        ? JSON.parse(localStorage.getItem('cartItems')) || []
        : [];
    } catch (error) {
      console.error('Failed to parse cartItems', error);
      return [];
    }
  });

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);

  // Calculate the total amount
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  // Calculate the total count of items in the cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (pizza) => {
    if (!pizza?.id) return; // Guard clause
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === pizza.id);
      return existing
        ? prev.map((item) =>
            item.id === pizza.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...prev, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (pizzaId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== pizzaId));
  };

  const updateQuantity = (pizzaId, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === pizzaId ? { ...item, quantity: parsedQuantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
