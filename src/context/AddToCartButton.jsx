// components/AddToCartButton.js
"use client";
import { useState } from 'react';
import { useCart } from './CartContext.jsx';

export default function AddToCartButton({ product }) {
  const { addToLocalCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    const WP_GRAPHQL_URL = 'http://portfolio-eshop-backend.local/graphql'; // Το τοπικό σου URL

    // Χρησιμοποιούμε mutation αντί για query για να γράψουμε δεδομένα
    const mutation = `
      mutation AddToCart($productId: Int!) {
        addToCart(input: { productId: $productId, quantity: 1 }) {
          cartItem {
            key
            quantity
          }
        }
      }
    `;

    try {
      const res = await fetch(WP_GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: mutation, 
          // Απαιτείται το databaseId του προϊόντος (ακέραιος)
          variables: { productId: product.databaseId } 
        }),
      });

      const { data } = await res.json();
      
      if (data?.addToCart) {
        addToLocalCart(product);
        alert('Το προϊόν προστέθηκε στο καλάθι!');
      }
    } catch (error) {
      console.error("Σφάλμα:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg mt-6 active:scale-95"
    >
      Προσθήκη στο Καλάθι
    </button>
  );
}