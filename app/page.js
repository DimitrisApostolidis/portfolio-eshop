// app/page.js
import Link from 'next/link';

// Ορίζουμε το μενού μας ακριβώς με τη δομή που ζήτησες
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

export default async function ProductsPage() {
  const WP_GRAPHQL_URL = 'http://portfolio-eshop-backend.local/graphql';

  // Το query φέρνει πλέον μόνο τα προϊόντα (το μενού το έχουμε hardcoded)
  const query = `
    query GetProducts {
      products(first: 12) {
        nodes {
          id
          databaseId
          name
          slug
          ... on SimpleProduct { price }
          image { sourceUrl altText }
        }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    cache: 'no-store' 
  });

  const { data } = await res.json();
  const products = data?.products?.nodes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Αριστερό Sidebar - Νέο Μενού με Αναδυόμενες Καρτέλες */}
        <aside className="w-full md:w-72 flex-shrink-0 relative z-40">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2 border-b border-gray-100 p-6 pb-4">
              Κατηγορίες
            </h2>
            
            <ul className="flex flex-col pb-4">
              <li className="px-6 py-2">
                <Link href="/" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                  Όλα τα προϊόντα
                </Link>
              </li>
              
              {menuItems.map((category) => (
                // Η κλάση group είναι το κλειδί: ελέγχει πότε το ποντίκι είναι πάνω σε ΟΛΟ το <li>
                <li key={category.slug} className="group relative px-6 py-3 hover:bg-gray-50 cursor-pointer">
                  
                  <Link 
                    href={`/category/${category.slug}`} 
                    className="flex justify-between items-center text-gray-700 font-medium group-hover:text-blue-600 transition-colors"
                  >
                    <span>{category.name}</span>
                    {/* Ένα μικρό βελάκι που δείχνει ότι υπάρχουν υποκατηγορίες */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  {/* Η αναδυόμενη καρτέλα (Flyout Menu). Αρχικά είναι hidden, γίνεται block στο group-hover */}
                  <div className="absolute left-full top-0 ml-1 hidden group-hover:block w-56 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 transition-all">
                    <div className="py-2">
                      <h3 className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                        {category.name}
                      </h3>
                      <ul>
                        {category.subcategories.map(sub => (
                          <li key={sub.slug}>
                            <Link 
                              href={`/category/${sub.slug}`} 
                              className="block px-5 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Δεξί τμήμα - Πλέγμα Προϊόντων */}
        <main className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Τα Προϊόντα μας</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link 
                href={`/product/${product.slug}`} 
                key={product.id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-6">
                  {product.image ? (
                    <img src={product.image.sourceUrl} alt={product.image.altText || product.name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="text-gray-300 flex items-center justify-center h-full">Χωρίς εικόνα</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow border-t border-gray-50 bg-gray-50/30">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <div className="mt-auto text-2xl font-black text-gray-900" dangerouslySetInnerHTML={{ __html: product.price }} />
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}