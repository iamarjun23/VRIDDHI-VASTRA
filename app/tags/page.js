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
  const displayTrending = trendingProducts.length > 0 ? trendingProducts : products.slice(0, 4);

  return (
    <div className="bg-[#F1E8CD] min-h-screen selection:bg-brand-green selection:text-white flex flex-col">
      <Navbar logo={config.logo} />

      <main className="flex flex-col flex-1">
        {/* Top Hero Banner */}
        <div className="pt-[clamp(70px,10vw,140px)]">
          <PromoBanner {...config.promoBanner} logo={config.logo} />
        </div>

        {/* Main Split Layout */}
        <div id="archive" className="flex flex-1 w-full flex-row">
          {/* Sidebar - Search by Tags */}
          <aside className="w-[clamp(100px,25vw,320px)] bg-[#FFFAEE] border-r border-black/5 flex-shrink-0">
            <div className="sticky top-32 pl-[clamp(10px,2vw,48px)] md:pl-12 pr-[clamp(10px,2vw,40px)] md:pr-10 py-10 space-y-[clamp(1rem,2vw,3rem)]">
              <div>
                <h3 className="font-dm-sans C4 text-[clamp(8px,1vw,13px)] font-bold tracking-[0.2em] text-brand-green uppercase mb-[clamp(1rem,2vw,2.5rem)]">Search by Tags</h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/tags#archive"
                      className={`text-[clamp(9px,1.1vw,15px)] font-medium tracking-[0.1em] uppercase transition-all block ${!selectedCategory ? 'text-brand-green' : 'text-brand-green/50 hover:text-brand-green'}`}
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
                        className={`text-[clamp(9px,1.1vw,15px)] font-medium tracking-[0.1em] uppercase transition-all block ${selectedCategory === cat ? 'text-brand-green' : 'text-brand-green/50 hover:text-brand-green'}`}
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
            <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="mb-14">
                <p className="font-dm-sans C4 text-[clamp(10px,1.5vw,16px)] font-bold tracking-[0.3em] text-brand-gold uppercase mb-4">
                  {searchQuery ? `Search Results` : (selectedCategory || "All Archive")}
                </p>
                <h2 className="dm-sans-h1 text-brand-green leading-tight">
                  {searchQuery ? `Showing results for "${searchQuery}"` :
                    normalize(selectedCategory) === "HOTOFFER" ? "Exclusive Hot Offers" :
                      normalize(selectedCategory) === "BESTSELLER" ? "Our Best Selling Masterpieces" :
                        normalize(selectedCategory) === "EXHIBITIONCATEGORIE" ? "Exhibition Signature Collection" :
                          selectedCategory ? `Discover the ${selectedCategory}` : "The Complete Silk Archive"}
                </h2>
                <div className="w-full h-[1px] bg-gray-100 mt-10" />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-40 text-center">
                  <p className="text-gray-300 font-serif text-2xl italic uppercase tracking-widest">No pieces found in this archive.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-x-[clamp(10px,2vw,40px)] gap-y-[clamp(16px,4vw,64px)]">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.serial} product={product} bgWhite={true} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trending Section - Styled to match Product Page */}
        <section className="w-full bg-[#F1E8CD] py-24 px-[clamp(1rem,4vw,5vw)] border-t border-black/5">
          <div className="w-full">
            <div className="mb-12">
              <p className="dm-sans-h2 tracking-[0.2em] text-brand-green uppercase font-medium mb-4">
                TRENDING COLLECTION
              </p>
              <h2 className="font-[var(--font-dm-sans)] text-[clamp(24px,4vw,56px)] leading-tight flex items-center gap-[clamp(8px,2vw,16px)] flex-wrap">
                Want to look through our Trending Collections
                <img src="/images/fire.png" alt="🔥" className="w-5 h-5 md:w-8 md:h-8 object-contain inline-block" />
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-x-[clamp(10px,2vw,40px)] gap-y-[clamp(16px,4vw,64px)]">
              {displayTrending.map(product => (
                <ProductCard key={`trending-tag-${product.serial}`} product={product} bgWhite={true} />
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
