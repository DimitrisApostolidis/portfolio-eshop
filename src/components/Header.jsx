// src/components/Header.jsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { cart, isMounted, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  
  // ΝΕΟ STATE: Ελέγχει αν το πλαϊνό μενού του κινητού (Hamburger) είναι ανοιχτό
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const router = useRouter();

  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false); // Κλείνει το μενού αν ψάξεις από κινητό
    }
  };

  return (
    <>
      <header className="bg-gray-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ΠΑΝΩ ΓΡΑΜΜΗ: Λογότυπο & Εικονίδια */}
          <div className="flex justify-between items-center h-16">
            
            {/* Κινητό: Εικονίδιο Hamburger (Εμφανίζεται μόνο κάτω από md - μεσαίες οθόνες) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Άνοιγμα Μενού"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Λογότυπο */}
            <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight hover:text-gray-300 transition-colors flex-shrink-0">
              Dimitris <span className="hidden sm:inline">E-shop</span>
            </Link>

            {/* Desktop: Μπάρα Αναζήτησης (Κρύβεται στα κινητά) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Αναζήτηση προϊόντων..." 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Δεξιά: Καλάθι */}
            <div className="flex items-center">
              <button onClick={openCart} className="flex items-center gap-1 sm:gap-2 text-sm sm:text-lg font-medium hover:text-blue-400 transition-colors p-2 -mr-2 sm:mr-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline">Καλάθι</span>
                <span className="bg-blue-600 text-white text-xs sm:text-sm font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {isMounted ? totalItems : "..."}
                </span>
              </button>
            </div>

          </div>

          {/* ΚΑΤΩ ΓΡΑΜΜΗ: Μπάρα Αναζήτησης ΓΙΑ ΚΙΝΗΤΑ (Εμφανίζεται μόνο σε κινητά, πιάνοντας όλο το πλάτος) */}
          <div className="md:hidden pb-4 pt-1">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Τι ψάχνετε σήμερα;" 
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 text-sm shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      </header>

      {/* ΣΥΡΤΑΡΙ ΚΙΝΗΤΟΥ (Mobile Sidebar Menu) */}
      
      {/* 1. Σκοτεινό Overlay */}
      <div 
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* 2. Το λευκό συρτάρι που ανοίγει από αριστερά */}
      <div 
        className={`fixed inset-y-0 left-0 z-[120] w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
          <span className="text-xl font-extrabold text-gray-900">Μενού</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-black bg-white rounded-lg p-2 shadow-sm border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="block px-4 py-3.5 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
          >
            🏠 Αρχική / Όλα τα προϊόντα
          </Link>
          
          <button 
            onClick={() => { setIsMobileMenuOpen(false); openCart(); }} 
            className="w-full text-left px-4 py-3.5 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex justify-between items-center"
          >
            <span>🛒 Το Καλάθι μου</span>
            {totalItems > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{totalItems}</span>
            )}
          </button>
          
          <Link 
            href="/checkout" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="block px-4 py-3.5 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
          >
            💳 Ταμείο
          </Link>
        </nav>

        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center font-medium">Portfolio E-shop © 2026</p>
        </div>
      </div>

      <CartDrawer />
    </>
  );
}