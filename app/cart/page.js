// app/cart/page.js
"use client";
import { useCart } from '@/src/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, addToLocalCart, decreaseQuantity, removeFromLocalCart } = useCart();

  // Υπολογισμός Συνολικού Κόστους
  const totalPrice = cart.reduce((sum, product) => {
    if (!product.price) return sum;
    const textOnly = product.price.replace(/<[^>]+>/g, '');
    const numberMatch = textOnly.match(/[\d,.]+/);
    const cleanNumber = numberMatch ? numberMatch[0].replace(',', '.') : '0';
    const priceNum = parseFloat(cleanNumber) || 0;
    return sum + (priceNum * (product.quantity || 1));
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Το καλάθι σου είναι άδειο</h2>
        <p className="text-gray-500 mb-8 text-lg">Δεν έχεις προσθέσει ακόμα κάποιο προϊόν.</p>
        <Link 
          href="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          Επιστροφή στα προϊόντα
        </Link>
      </div>
    );
  }

  return (
    // Το min-h-screen και bg-gray-50 "καθαρίζουν" το μαύρο φόντο
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b-2 border-gray-200 pb-6 mb-8">
          Το Καλάθι μου
        </h1>
        
        <div className="flex flex-col gap-6">
          {cart.map((product) => (
            <div key={product.databaseId} className="flex flex-col sm:flex-row items-center gap-6 bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              
              <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                {product.image && (
                  <img src={product.image.sourceUrl} alt={product.name} className="object-contain w-full h-full" />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                <div className="text-blue-600 font-bold text-xl" dangerouslySetInnerHTML={{ __html: product.price }} />
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1 w-max mx-auto sm:mx-0">
                <button 
                  onClick={() => decreaseQuantity(product.databaseId)} 
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-colors shadow-sm"
                >-</button>
                <span className="w-6 text-center font-bold text-gray-900">{product.quantity}</span>
                <button 
                  onClick={() => addToLocalCart(product)} 
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-colors shadow-sm"
                >+</button>
              </div>
              
              <button 
                onClick={() => removeFromLocalCart(product.databaseId)} 
                className="mt-4 sm:mt-0 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                title="Διαγραφή"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              
            </div>
          ))}
        </div>
        
        <div className="mt-10 bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-xl text-gray-700">
            Σύνολο: <strong className="text-3xl text-gray-900 ml-2">{totalPrice.toFixed(2).replace('.', ',')} €</strong>
          </div>
          
          {/* ΕΔΩ ΕΙΝΑΙ Η ΛΥΣΗ: Μετατράπηκε σε Link που δείχνει στο /checkout */}
          <Link 
            href="/checkout" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-lg hover:shadow-xl text-center text-lg"
          >
            Προχώρησε στο Ταμείο
          </Link>
        </div>

      </div>
    </div>
  );
}