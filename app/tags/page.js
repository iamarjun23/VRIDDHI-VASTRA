import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import PromoBanner from "../components/PromoBanner"
import dbConnect from "../../lib/mongodb"
import Product from "../../models/Product"
import SiteConfig from "../../models/SiteConfig"

export const dynamic = 'force-dynamic'; // Fixes the caching issue!

export const metadata = {
  title: "Search & Archive",
  description: "Explore our complete saree archive. Filter by category, tags, or search for your favorite styles.",
}

export default async function TagsPage({ searchParams }) {
  await dbConnect();
  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(productsData));

  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) {
    configData = { collectionsCategories: ["KANCHIPURAM LUXURY", "BANARASI SILK"], promoBanner: {}, logo: "", footerImage: "" };
  }
  const config = JSON.parse(JSON.stringify(configData));

  const categories = config.collectionsCategories || [];
  const { category: selectedCategory, search: searchQuery } = await searchParams;

  // Normalize a string for flexible matching (remove spaces, hyphens, and trailing 'S' for plurality)
  const normalize = (str) => {
    if (!str) return "";
    let s = str.toUpperCase().replace(/[-\s]/g, '');
    if (s.endsWith('S')) s = s.slice(0, -1);
    return s;
  };

  const searchNormalized = normalize(selectedCategory);

  // Filter products for the main grid
  const filteredProducts = products.filter(p => {
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      const matchName = p.name && p.name.toLowerCase().includes(s);
      const matchCat = p.category && p.category.toLowerCase().includes(s);
      const matchTag = p.tags && p.tags.some(t => t.toLowerCase().includes(s));
      return matchName || matchCat || matchTag;
    }

    if (!selectedCategory) return true;
    const catNorm = normalize(p.category);
    if (catNorm === searchNormalized) return true;

    const tagMatch = p.tags && p.tags.some(t => normalize(t) === searchNormalized);
    return tagMatch;
  });

  const trendingProducts = products.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === 'trending')).slice(0, 4);
  // If no specific trending tags, pick 4 random products that are different from the first 4 to ensure variety
  const displayTrending = trendingProducts.length > 0
    ? trendingProducts
    : [...products].sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div 
      className="min-h-screen selection:bg-brand-green selection:text-white flex flex-col"
      style={{ backgroundColor: 'color-mix(in srgb, #F1E8CD, white 20%)' }}
    >
      <Navbar logo={config.logo} bgColor="#E9DAC1" />

      <main className="flex flex-col flex-1">
        {/* Top Hero Banner - Gap Fixed */}
        <div className="pt-[70px]">
          <PromoBanner {...config.promoBanner} logo={config.logo} />
        </div>

        {/* Main Split Layout */}
        <div id="archive" className="flex flex-1 w-full flex-col md:flex-row">
          {/* Sidebar - Search by Tags */}
          <aside className="w-full md:w-[clamp(220px,30vw,380px)] bg-[#FFFAEE] border-b md:border-b-0 md:border-r border-black/5 flex-shrink-0">
            <div className="md:sticky md:top-32 pl-[clamp(1rem,4vw,48px)] pr-[clamp(1rem,4vw,40px)] py-6 md:py-10 space-y-[clamp(1rem,2vw,3rem)]">
              <div>
                <h3 className="font-dm-sans text-[23px] font-bold tracking-[0.1em] text-[#848484]/45 uppercase mb-10">Search by Tags</h3>
                <ul className="flex flex-row md:flex-col flex-wrap gap-x-6 gap-y-6 md:space-y-6">
                  <li>
                    <Link
                      href="/tags#archive"
                      className={`text-[23px] font-bold tracking-[0.05em] uppercase transition-all block ${!selectedCategory ? 'text-brand-green' : 'text-brand-green/50 hover:text-brand-green'}`}
                    >
                      All Archive
                    </Link>
                  </li>
                  {Array.from(new Set([
                    "HOT OFFERS",
                    "BEST SELLER",
                    ...(config.collectionsCategories || ["KANCHIPURAM LUXURY", "BANARASI SILK"])
                  ])).map(cat => (
                    <li key={cat}>
                      <Link
                        href={`/tags?category=${encodeURIComponent(cat)}#archive`}
                        className={`text-[23px] font-bold tracking-[0.05em] uppercase transition-all block ${selectedCategory === cat ? 'text-brand-green' : 'text-brand-green/50 hover:text-brand-green'}`}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid Content */}
          <div className="flex-1 bg-[#F1E8CD] pl-[clamp(10px,2vw,40px)] md:pl-10 pr-[clamp(10px,2vw,56px)] md:pr-14 py-16 min-w-0">
            <div className="max-w-[2000px] mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="mb-20">
                <p className="font-dm-sans text-[28px] font-bold tracking-[0.1em] text-brand-green uppercase mb-6">
                  {searchQuery ? `Search Results` : (selectedCategory || "All Archive")}
                </p>
                <div className="w-full h-[1px] bg-gray-100 mt-10" />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-40 text-center">
                  <p className="text-gray-300 font-serif text-2xl italic uppercase tracking-widest">No pieces found in this archive.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-x-[clamp(15px,3vw,60px)] gap-y-[clamp(16px,4vw,64px)] justify-start">
                  {filteredProducts.map(product => (
                    <div key={product.serial} className="w-[300px] h-[520px] flex-shrink-0">
                      <ProductCard product={product} bgWhite={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trending Section - Styled to match Product Page */}
        <section className="w-full bg-[#F1E8CD] py-24 border-t border-black/5">
          <div className="max-w-[2000px] mx-auto w-full px-[clamp(1rem,4vw,5vw)]">
            <div className="mb-12">
              <p className="font-dm-sans text-[23px] font-bold tracking-[0.2em] text-brand-green uppercase mb-4">
                TRENDING COLLECTION
              </p>
              <h2 className="font-dm-sans text-[36px] font-normal leading-tight flex items-center gap-4 flex-wrap text-black">
                Want to look through our Trending Collections
                <img src="/images/fire.png" alt="🔥" className="w-8 h-8 object-contain inline-block" />
              </h2>
            </div>

            <div className="flex flex-wrap gap-x-[clamp(10px,2vw,40px)] gap-y-[clamp(16px,4vw,64px)] justify-start">
              {displayTrending.map(product => (
                <div key={`trending-tag-${product.serial}`} className="w-[300px] h-[520px] flex-shrink-0">
                  <ProductCard product={product} bgWhite={true} />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-20">
              <Link href="/collections" className="px-[clamp(1.5rem,5vw,3.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] border-2 border-brand-green text-brand-green text-[clamp(10px,1.5vw,18px)] tracking-[0.2em] font-medium uppercase rounded-full hover:bg-brand-green hover:text-white transition-all duration-300">
                View All Collections
              </Link>
            </div>
            </div>
        </section>
      </main>

      <Footer backgroundImage={config.footerImage} logo={config.logo} />
    </div>
  )
}
