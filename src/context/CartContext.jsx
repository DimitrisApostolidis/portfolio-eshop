// src/context/CartContext.jsx
"use client";
import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // ΝΕΟ: Ελέγχει αν το πλαϊνό καλάθι είναι ανοιχτό ή κλειστό
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('portfolio-cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } 
      catch (error) { console.error(error); }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('portfolio-cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToLocalCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.databaseId === product.databaseId);
      if (existingProduct) {
        return prevCart.map(item => 
          item.databaseId === product.databaseId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    // Όταν προσθέτουμε προϊόν, ανοίγει αυτόματα το πλαϊνό καλάθι!
    openCart();
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.databaseId === productId);
      if (existingProduct?.quantity === 1) {
        return prevCart.filter(item => item.databaseId !== productId);
      }
      return prevCart.map(item => 
        item.databaseId === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const removeFromLocalCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.databaseId !== productId));
  };

  return (
    <CartContext.Provider value={{ 
      cart, addToLocalCart, decreaseQuantity, removeFromLocalCart, 
      isMounted, isCartOpen, openCart, closeCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);