// app/product/[slug]/page.js
import AddToCartButton from '../../../src/context/AddToCartButton.jsx';
import ProductGallery from '../../../src/components/ProductGallery.jsx';
import Link from 'next/link';

export default async function SingleProductPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams; 

  const WP_GRAPHQL_URL = 'http://portfolio-eshop-backend.local/graphql';

  const query = `
    query GetProductBySlug($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        id
        databaseId
        name
        description
        ... on SimpleProduct { price }
        image { sourceUrl altText }
        galleryImages { nodes { id sourceUrl altText } }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    cache: 'no-store'
  });

  const { data } = await res.json();
  const product = data?.product;

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Κομψό Breadcrumb */}
        <nav className="mb-6 text-sm font-medium text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-900 transition-colors">Αρχική</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Κεντρική Κάρτα */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12">
            
            {/* Αριστερά: Gallery */}
            <div className="w-full">
              <ProductGallery 
                mainImage={product.image} 
                galleryImages={product.galleryImages?.nodes} 
                productName={product.name} 
              />
            </div>
            
            {/* Δεξιά: Πληροφορίες */}
            <div className="flex flex-col justify-center">
              
              {/* Τίτλος - Πλέον πολύ πιο "μαζεμένος" (text-2xl ή 3xl) */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug">
                {product.name}
              </h1>
              
              {/* Τιμή - Σε σκούρο χρώμα (Premium) */}
              <div 
                className="text-3xl font-extrabold text-gray-900 mb-6" 
                dangerouslySetInnerHTML={{ __html: product.price }} 
              />
              
              {/* Διαχωριστικό */}
              <div className="w-full h-px bg-gray-100 mb-6"></div>
              
              {/* Περιγραφή */}
              <div 
                className="text-gray-600 text-base leading-relaxed mb-8
                           [&>p]:mb-4 last:[&>p]:mb-0 
                           [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ul]:mb-4 
                           [&>strong]:text-gray-900 [&>strong]:font-semibold" 
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />

              {/* Action Area */}
              <div className="mt-auto">
                <AddToCartButton product={product} />
                
                {/* Διακριτικά Badges Διαθεσιμότητας */}
                <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Άμεσα Διαθέσιμο</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>Παράδοση σε 1-3 εργάσιμες</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}