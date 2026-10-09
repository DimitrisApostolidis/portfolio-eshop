// app/category/[slug]/page.js
import Link from 'next/link';

// Χρησιμοποιούμε τη σωστή δομή μας και στη σελίδα της κατηγορίας!
const menuItems = [
  {
    name: 'Desktop & Περιφερειακά',
    slug: 'desktop-perifereiaka',
    subcategories: [
      { name: 'Πληκτρολόγια', slug: 'pliktrologia' },
      { name: 'Ποντίκια', slug: 'pontikia' },
      { name: 'Mousepads', slug: 'mousepads' },
      { name: 'Ακουστικά Headsets', slug: 'akoustika-headsets' },
    ]
  },
  {
    name: 'Τηλεοράσεις',
    slug: 'tileoraseis',
    subcategories: [
      { name: 'Samsung', slug: 'samsung' },
      { name: 'LG', slug: 'lg' },
      { name: 'Xiaomi', slug: 'xiaomi' },
    ]
  },
  {
    name: 'Τηλέφωνα',
    slug: 'tilefona',
    subcategories: [
      { name: 'Θήκες Κινητών', slug: 'thikes-kiniton' },
      { name: 'Φορτιστές', slug: 'fortistes' },
      { name: 'Καλώδια', slug: 'kalodia' },
      { name: 'Powerbanks', slug: 'powerbanks' },
    ]
  },
  {
    name: 'Gaming Zone',
    slug: 'gaming-zone',
    subcategories: [
      { name: 'PS5', slug: 'ps5' },
      { name: 'Xbox', slug: 'xbox' },
      { name: 'Switch', slug: 'switch' },
    ]
  }
];

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams; 

  const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://dev-dimitris-eshop.pantheonsite.io/graphql';

  // Πλέον ζητάμε μόνο τα προϊόντα, το μενού το ελέγχουμε εμείς!
  const query = `
    query GetCategoryPageData($slug: ID!) {
      productCategory(id: $slug, idType: SLUG) {
        name
        products(first: 20) {
          nodes {
            id
            databaseId
            name
            slug
            ... on SimpleProduct {
              price
            }
            image {
              sourceUrl
              altText
            }
          }
        }
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
  const currentCategory = data?.productCategory;
  const products = currentCategory?.products?.nodes || [];

  if (!currentCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-screen">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Η κατηγορία δεν βρέθηκε</h2>
        <Link href="/" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
          Επιστροφή στα προϊόντα
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Αριστερό Sidebar - Έξυπνο Accordion Μενού */}
        <aside className="w-full md:w-72 flex-shrink-0 relative z-40">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2 border-b border-gray-100 p-6 pb-4">
              Κατηγορίες
            </h2>
            
            <ul className="flex flex-col pb-4 px-2">
              <li className="mb-2">
                <Link href="/" className="block px-4 py-2 text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  ← Όλα τα προϊόντα
                </Link>
              </li>
              
              {menuItems.map((category) => {
                // Ελέγχουμε αν η τρέχουσα σελίδα (slug) είναι αυτή η κύρια κατηγορία ή κάποια από τις υποκατηγορίες της
                const isActiveGroup = category.slug === slug || category.subcategories.some(sub => sub.slug === slug);
                
                return (
                  <li key={category.slug} className="block mb-1">
                    <Link 
                      href={`/category/${category.slug}`} 
                      className={`block px-4 py-2.5 rounded-xl font-bold transition-colors ${isActiveGroup ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                    >
                      {category.name}
                    </Link>
                    
                    {/* Οι υποκατηγορίες εμφανίζονται ΜΟΝΟ αν η ομάδα είναι ενεργή (isActiveGroup) */}
                    {isActiveGroup && (
                      <ul className="pl-4 border-l-2 border-blue-200 ml-6 mt-2 mb-3 flex flex-col space-y-1">
                        {category.subcategories.map(sub => (
                          <li key={sub.slug}>
                            <Link 
                              href={`/category/${sub.slug}`} 
                              className={`block px-4 py-2 text-sm rounded-lg transition-colors ${sub.slug === slug ? 'text-blue-700 font-bold bg-white shadow-sm border border-gray-100' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'}`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Δεξί τμήμα - Πλέγμα Προϊόντων */}
        <main className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{currentCategory.name}</h1>
          
          {products.length === 0 ? (
            <p className="text-gray-500 text-lg bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link 
                  href={`/product/${product.slug}`} 
                  key={product.id} 
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-6">
                    {product.image ? (
                      <img 
                        src={product.image.sourceUrl} 
                        alt={product.image.altText || product.name} 
                        className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-gray-300 flex items-center justify-center h-full">Χωρίς εικόνα</div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow border-t border-gray-50 bg-gray-50/30">
                    <h3 className="text-md font-semibold text-gray-700 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div 
                      className="mt-auto text-2xl font-black text-gray-900" 
                      dangerouslySetInnerHTML={{ __html: product.price }} 
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}