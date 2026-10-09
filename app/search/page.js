// app/search/page.js
import Link from 'next/link';

export default async function SearchPage({ searchParams }) {
  // Διαβάζουμε τη λέξη-κλειδί από το URL (π.χ. ?q=samsung)
  const resolvedParams = await searchParams;
  const queryParam = resolvedParams?.q || '';

  const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://dev-dimitris-eshop.pantheonsite.io/graphql';

  // GraphQL Query: Ζητάμε τα προϊόντα που περιέχουν τη λέξη αναζήτησης
  const query = `
    query SearchProducts($search: String!) {
      products(where: { search: $search }, first: 20) {
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
  `;

  let products = [];
  
  // Κάνουμε fetch μόνο αν υπάρχει λέξη-κλειδί
  if (queryParam) {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { search: queryParam } }),
      cache: 'no-store'
    });

    const { data } = await res.json();
    products = data?.products?.nodes || [];
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Επικεφαλίδα Σελίδας Αναζήτησης */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Αποτελέσματα Αναζήτησης</h1>
            <p className="text-gray-600 text-lg">
              {queryParam ? (
                <>Ψάξατε για: <strong className="text-blue-600">"{queryParam}"</strong> ({products.length} προϊόντα)</>
              ) : (
                "Παρακαλώ πληκτρολογήστε κάτι στην μπάρα αναζήτησης."
              )}
            </p>
          </div>
          <Link href="/" className="inline-block bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm">
            ← Επιστροφή στα προϊόντα
          </Link>
        </div>

        {/* Εμφάνιση Αποτελεσμάτων ή Μηνύματος Λάθους */}
        {!queryParam ? null : products.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center max-w-2xl mx-auto mt-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Δεν βρέθηκε κανένα προϊόν</h2>
            <p className="text-gray-500 text-lg">Δοκιμάστε να ψάξετε με πιο γενικές λέξεις-κλειδιά (π.χ. "Samsung" αντί για "Τηλεόραση Samsung 4K").</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    className="mt-auto text-xl font-black text-gray-900" 
                    dangerouslySetInnerHTML={{ __html: product.price }} 
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}