// src/components/CartDrawer.jsx
"use client";
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, addToLocalCart, decreaseQuantity, removeFromLocalCart } = useCart();

  // Βγάλαμε το "if (!isCartOpen) return null;" για να μπορούν να λειτουργήσουν τα animations!

  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  
  const totalPrice = cart.reduce((sum, product) => {
    if (!product.price) return sum;
    const textOnly = product.price.replace(/<[^>]+>/g, '');
    const numberMatch = textOnly.match(/[\d,.]+/);
    const cleanNumber = numberMatch ? numberMatch[0].replace(',', '.') : '0';
    const priceNum = parseFloat(cleanNumber) || 0;
    return sum + (priceNum * (product.quantity || 1));
  }, 0);

  return (
    <>
      {/* 1. Σκοτεινό φόντο (Overlay) - Εμφανίζεται με απαλό Fade In/Out */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeCart}
      ></div>
      
      {/* 2. Το λευκό συρτάρι - Γλιστράει (Slide) ομαλά από τα δεξιά */}
      <div 
        className={`fixed top-0 right-0 z-[110] w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Επικεφαλίδα */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Το Καλάθι σου ({totalItems})</h2>
          <button 
            onClick={closeCart} 
            className="text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Λίστα Προϊόντων */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Το καλάθι σου είναι άδειο.
            </div>
          ) : (
            cart.map((product) => (
              <div key={product.databaseId} className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex-shrink-0 border border-gray-100">
                  {product.image && <img src={product.image.sourceUrl} alt={product.name} className="w-full h-full object-contain" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="text-blue-600 font-bold mt-1 text-sm" dangerouslySetInnerHTML={{ __html: product.price }} />
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm bg-white shadow-sm">
                      <button onClick={() => decreaseQuantity(product.databaseId)} className="w-8 h-7 text-gray-600 hover:bg-gray-100 font-bold transition-colors">-</button>
                      <span className="w-6 text-center font-semibold text-gray-900">{product.quantity}</span>
                      <button onClick={() => addToLocalCart(product)} className="w-8 h-7 text-gray-600 hover:bg-gray-100 font-bold transition-colors">+</button>
                    </div>
                    <button onClick={() => removeFromLocalCart(product.databaseId)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Αφαίρεση">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Υποσύνολο και Κουμπιά */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-5">
              <span className="text-gray-600 font-medium text-lg">Σύνολο</span>
              <span className="text-2xl font-black text-gray-900">{totalPrice.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/checkout" onClick={closeCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-200">
                Ολοκλήρωση αγοράς
              </Link>
              <Link href="/cart" onClick={closeCart} className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 text-center font-bold py-3.5 rounded-xl transition-colors shadow-sm">
                Προβολή καλαθιού
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}