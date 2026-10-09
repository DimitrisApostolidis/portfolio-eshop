// app/checkout/page.js
"use client";
import { useCart } from '@/src/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, isMounted } = useCart();

  const totalPrice = cart.reduce((sum, product) => {
    if (!product.price) return sum;
    const cleanNumber = product.price.replace(/<[^>]+>/g, '').match(/[\d,.]+/)?.[0].replace(',', '.') || '0';
    return sum + (parseFloat(cleanNumber) * (product.quantity || 1));
  }, 0);

  if (!isMounted) return null;

  return (
    // Το min-h-screen και το bg-gray-50 εξασφαλίζουν ότι ΟΛΗ η σελίδα θα έχει καθαρό, ανοιχτόχρωμο φόντο
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Ταμείο</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Αριστερή Στήλη: Φόρμες σε λευκές Κάρτες */}
          <div className="flex-1 space-y-8">
            
            {/* Κάρτα: Στοιχεία Επικοινωνίας */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Στοιχεία Επικοινωνίας</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="to-email-sou@example.com" 
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                />
              </div>
            </div>

            {/* Κάρτα: Διεύθυνση Αποστολής */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Διεύθυνση Αποστολής</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Χώρα / Περιοχή</label>
                  <select className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all">
                    <option>Ελλάδα</option>
                    <option>Κύπρος</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Όνομα</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Επίθετο</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Οδός και αριθμός</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Πόλη</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Τ.Κ.</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Τηλέφωνο</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Κάρτα: Επιλογές Αποστολής */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Επιλογές Αποστολής</h2>
              <label className="flex justify-between items-center border-2 border-blue-600 bg-blue-50/50 rounded-xl p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="w-5 h-5 text-blue-600 accent-blue-600" />
                  <span className="font-semibold text-blue-900">Δωρεάν Μεταφορικά</span>
                </div>
                <span className="font-bold text-blue-600">ΔΩΡΕΑΝ</span>
              </label>
            </div>
          </div>

          {/* Δεξιά Στήλη: Σύνοψη Παραγγελίας */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-white shadow-xl shadow-gray-200/40 border border-gray-100 rounded-3xl p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Σύνοψη Παραγγελίας</h2>
              
              {/* Προϊόντα */}
              <div className="flex flex-col gap-5 mb-6 border-b border-gray-100 pb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map(product => (
                  <div key={product.databaseId} className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 bg-gray-50 border border-gray-100 rounded-xl p-2 flex-shrink-0">
                      {product.image && <img src={product.image.sourceUrl} alt={product.name} className="w-full h-full object-contain" />}
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
                        {product.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                      <div className="font-bold text-blue-600 mt-1" dangerouslySetInnerHTML={{ __html: product.price }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Σύνολα */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Υποσύνολο</span>
                  <span className="font-medium text-gray-900">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Μεταφορικά</span>
                  <span className="text-green-600 font-bold">ΔΩΡΕΑΝ</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-2xl font-black text-gray-900 border-t border-gray-100 pt-6 mb-8">
                <span>Σύνολο</span>
                <span>{totalPrice.toFixed(2).replace('.', ',')} €</span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-200">
                Ολοκλήρωση Παραγγελίας
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Ασφαλής συναλλαγή 🔒</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}