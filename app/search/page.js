import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import dbConnect from "../../lib/mongodb"
import Product from "../../models/Product"
import SiteConfig from "../../models/SiteConfig"

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Search Results",
  description: "Search for your favorite silk sarees and fashion accessories at Vriddhi Vastra.",
}

export default async function SearchPage({ searchParams }) {
  await dbConnect();
  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(productsData));

  const q = (await searchParams).q || ""
  const query = q.toLowerCase()

  // Fetch site configuration
  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) configData = {};
  const config = JSON.parse(JSON.stringify(configData));

  const filteredProducts = products.filter(product => {
    // Check if the query matches the name, description or any of the tags
    if (product.name.toLowerCase().includes(query)) return true
    if (product.description.toLowerCase().includes(query)) return true
    if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query))) return true
    
    return false
  })

  return (
    <div className="min-h-screen flex flex-col pt-32">
      <Navbar theme="light" logo={config.logo} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full block pt-12 pb-24">
        
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-brand-green mb-4">Search Results</h1>
          <p className="text-brand-green/80 text-lg">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found for "{q}"
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-14 gap-y-24">
             {filteredProducts.map((product) => (
               <ProductCard key={product.serial} product={product} />
             ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-2xl font-serif text-brand-green mb-2">No products found</h2>
            <p className="text-brand-green/70">Try searching with different keywords or tags.</p>
          </div>
        )}

      </main>

      <Footer backgroundImage={config.footerImage} logo={config.logo} />
    </div>
  )
}
