// src/components/ProductGallery.jsx
"use client";
import { useState } from 'react';

export default function ProductGallery({ mainImage, galleryImages, productName }) {
  // Ορίζουμε ως αρχική μεγάλη εικόνα την κεντρική εικόνα του προϊόντος
  const [activeImage, setActiveImage] = useState(mainImage?.sourceUrl);

  // Συγχωνεύουμε την κύρια εικόνα με τις εικόνες της συλλογής σε έναν ενιαίο πίνακα
  const allImages = [];
  
  if (mainImage) {
    allImages.push({ id: 'main', sourceUrl: mainImage.sourceUrl, altText: mainImage.altText });
  }
  
  if (galleryImages && galleryImages.length > 0) {
    allImages.push(...galleryImages);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Κύρια μεγάλη εικόνα */}
      <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8 h-[400px] sm:h-[500px]">
        {activeImage ? (
          <img 
            src={activeImage} 
            alt={productName} 
            className="object-contain w-full h-full transition-all duration-300"
          />
        ) : (
          <div className="text-gray-400">Χωρίς εικόνα</div>
        )}
      </div>

      {/* Μικρογραφίες (Εμφανίζονται μόνο αν υπάρχουν 2+ εικόνες συνολικά) */}
      {allImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide">
          {allImages.map((img, index) => (
            <button 
              key={img.id || index}
              onClick={() => setActiveImage(img.sourceUrl)}
              className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border-2 transition-all ${
                activeImage === img.sourceUrl 
                  ? 'border-blue-600 shadow-md scale-105' 
                  : 'border-gray-100 hover:border-blue-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={img.sourceUrl} 
                alt={img.altText || productName} 
                className="w-full h-full object-contain p-2" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}