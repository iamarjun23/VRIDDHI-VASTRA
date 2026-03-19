import Link from "next/link"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"
import PromoBanner from "../../components/PromoBanner"
import dbConnect from "../../../lib/mongodb"
import Product from "../../../models/Product"
import SiteConfig from "../../../models/SiteConfig"

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = slug.toUpperCase().replace(/-/g, ' ');
  return {
    title: categoryName,
    description: `Shop our ${categoryName} collection at Vriddhi Vastra. High quality luxury silk sarees.`,
  };
}

export default async function CategoryPage({ params }) {
  await dbConnect();
  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(productsData));

  // Fetch site configuration for the promo banner
  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) configData = {};
  const config = JSON.parse(JSON.stringify(configData));

  // Unwrap params
  const { slug } = await params;
  
  // Reconstruct categoryName from slug
  const categoryName = slug.toUpperCase().replace(/-/g, ' ');

  let catProducts = [];
  let title = categoryName;

  // Global trending computation for the bottom section
  const trendingProducts = products.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === 'trending' || t.toLowerCase() === 'trending collection' || t.toLowerCase() === 'trending deals'));
  const displayTrending = trendingProducts.length > 0 ? trendingProducts : products.slice(0, 4);

  // Normalize a string for flexible matching (remove spaces, hyphens, and trailing 'S' for plurality)
  const normalize = (str) => {
    if (!str) return "";
    let s = str.toUpperCase().replace(/[-\s]/g, '');
    if (s.endsWith('S')) s = s.slice(0, -1);
    return s;
  };

  const searchNormalized = normalize(categoryName);

  // Exact category match or tag match logic
  if (categoryName === "NEW ARRIVALS") {
    catProducts = [...products].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
  } else if (categoryName === "TRENDING") {
    catProducts = trendingProducts.length > 0 ? trendingProducts : [...products].slice(0, 12);
  } else {
    catProducts = products.filter(p => {
      const catNorm = normalize(p.category);
      if (catNorm === searchNormalized) return true;
      
      const tagMatch = p.tags && p.tags.some(t => normalize(t) === searchNormalized);
      return tagMatch;
    });
  }

  return (
    <main className="bg-[#F1E8CD] min-h-screen selection:bg-black selection:text-white flex flex-col">
      <Navbar logo={config.logo} />

      <div className="pt-20">
        <PromoBanner {...(config.promoBanner || {})} />
      </div>

      <div className="flex flex-1 w-full flex-col md:flex-row">
        {/* Sidebar - Search by Tags */}
        <aside className="w-full md:w-[400px] bg-[#FFFAEE] border-r border-black/5 flex-shrink-0">
          <div className="sticky top-32 pl-8 md:pl-16 pr-8 md:pr-10 py-10 space-y-12">
            <div>
              <h3 className="font-dm-sans C4 text-[13px] font-bold tracking-[0.3em] text-brand-green uppercase mb-10">Search by Tags</h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/tags" 
                    className="text-[15px] font-medium tracking-[0.1em] uppercase transition-all block text-brand-green/50 hover:text-brand-green"
                  >
                    All Archive
                  </Link>
                </li>
                {Array.from(new Set([
                  "HOT OFFERS", 
                  "BEST SELLER", 
                  ...(config.collectionsCategories || ["KANCHIPURAM LUXURY", "BANARASI SILK", "MYSORE SILK", "BRIDAL COLLECTION"])
                ])).map(cat => {
                  const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
                  const isActive = slug === catSlug;
                  return (
                    <li key={cat}>
                      <Link 
                        href={`/tags?category=${encodeURIComponent(cat)}`} 
                        className={`text-[15px] font-medium tracking-[0.1em] uppercase transition-all block ${isActive ? 'text-brand-green' : 'text-brand-green/50 hover:text-brand-green'}`}
                      >
                        {cat}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 bg-[#F1E8CD] pl-8 md:pl-16 pr-8 md:pr-14 py-16">
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="mb-16 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] md:text-[14px] font-bold tracking-[0.4em] text-brand-gold uppercase">{title}</span>
                <div className="w-16 h-[1px] bg-brand-gold/30"></div>
              </div>
              <h1 className="font-dm-sans C1 text-[32px] md:text-[52px] text-brand-green mb-8 leading-tight">
                {normalize(title) === "HOTOFFER" ? "Exclusive Hot Offers" :
                 normalize(title) === "BESTSELLER" ? "Our Best Selling Masterpieces" :
                 normalize(title) === "EXHIBITIONCATEGORIE" ? "Exhibition Signature Collection" :
                 `Discover the ${title}`}
              </h1>
              <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-full border border-gray-100 shadow-sm w-fit">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                  {catProducts.length} {catProducts.length === 1 ? 'Piece' : 'Pieces'} Discovered
                </span>
              </div>
            </header>

            {catProducts.length === 0 ? (
              <div className="py-32 bg-white/50 rounded-[48px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-10 text-gray-200">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="font-sans text-gray-400 uppercase tracking-[0.3em] text-[12px] mb-2">Collection is presently empty</p>
                <p className="text-[14px] text-gray-300">Kindly explore other categories or return shortly for new arrivals.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-14 gap-y-24 mb-32">
                {catProducts.map(product => (
                  <ProductCard key={product.serial} product={product} bgWhite={true} />
                ))}
              </div>
            )}

            {/* Trending Collection Section */}
            <div className="mt-40 pt-24 border-t border-gray-100">
              <div className="flex flex-col items-center text-center w-full mb-16">
                <p className="font-dm-sans C4 text-[14px] md:text-[16px] tracking-[0.3em] text-brand-gold uppercase mb-6">
                  TRENDING COLLECTION
                </p>
                <h2 className="font-dm-sans C1 text-[28px] md:text-[42px] text-brand-green mb-4 leading-tight">
                  Want to look through our Trending Collections 🔥
                </h2>
                <div className="w-24 h-[1px] bg-brand-gold/40 mt-6"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-14 gap-y-24">
                {displayTrending.slice(0, 4).map(product => (
                  <ProductCard key={`trend-${product.serial}`} product={product} bgWhite={true} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer backgroundImage={config.footerImage} logo={config.logo} />
    </main>
  );
}
