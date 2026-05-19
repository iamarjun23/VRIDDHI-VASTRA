import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import PromoBanner from "../components/PromoBanner"
import dbConnect from "../../lib/mongodb"
import Product from "../../models/Product"
import SiteConfig from "../../models/SiteConfig"

export const revalidate = 3600;

export async function generateMetadata({ searchParams }) {
  const { category, search } = await searchParams;
  let title = "Search & Archive | Vriddhi Vastra";
  if (search) title = `Search Results for "${search}" | Vriddhi Vastra`;
  else if (category) title = `${category} Collection | Vriddhi Vastra`;

  return {
    title,
    description: "Explore our complete saree archive. Filter by category, tags, or search for your favorite styles.",
    robots: { index: false },
    openGraph: {
      title,
      description: "Explore our complete saree archive. Filter by category, tags, or search for your favorite styles.",
      url: "https://www.vriddhivastra.com/tags",
      siteName: "Vriddhi Vastra",
      images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
      locale: "en_IN",
      type: "website",
    }
  };
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

  const normalize = (str) => {
    if (!str) return "";
    let s = str.toUpperCase().replace(/[-\s]/g, '');
    if (s.endsWith('S')) s = s.slice(0, -1);
    return s;
  };

  const searchNormalized = normalize(selectedCategory);

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
        {/* Top Hero Banner */}
        <div className="pt-[clamp(52px,8vw,70px)]">
          <PromoBanner {...config.promoBanner} logo={config.logo} />
        </div>

        {/* Mobile ONLY Header - Luxury Style */}
        <section className="md:hidden bg-[#FFFAEE] py-[clamp(3.5rem,10vw,5rem)] px-6 border-b border-black/5">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-[10px] text-brand-gold tracking-[0.4em] uppercase mb-6 opacity-70">
              <div className="w-8 h-[1px] bg-brand-gold"></div>
              Vriddhi Vastra Archive
              <div className="w-8 h-[1px] bg-brand-gold"></div>
            </div>
            <h1 className="font-display text-[clamp(28px,7vw,46px)] text-brand-green leading-tight mb-10">
              {searchQuery ? `Search Results` : (selectedCategory || "The Archive")}
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-x-6 gap-y-5 pt-8 border-t border-black/5">
               <Link href="/tags#archive" className={`text-[12px] font-bold tracking-[0.2em] uppercase transition-all ${!selectedCategory ? 'text-brand-green border-b-2 border-brand-green pb-1' : 'text-brand-green/30'}`}>All Archive</Link>
               {Array.from(new Set([
                  "HOT OFFERS",
                  "BEST SELLER",
                  ...(config.collectionsCategories || ["KANCHIPURAM LUXURY", "BANARASI SILK"])
                ])).map(cat => (
                  <Link 
                    key={cat} 
                    href={`/tags?category=${encodeURIComponent(cat)}#archive`}
                    className={`text-[12px] font-bold tracking-[0.2em] uppercase transition-all whitespace-nowrap ${selectedCategory === cat ? 'text-brand-green border-b-2 border-brand-green pb-1' : 'text-brand-green/30'}`}
                  >
                    {cat}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Main Layout */}
        <div id="archive" className="flex flex-1 w-full flex-col md:flex-row">

          {/* Desktop Sidebar - Original Style */}
          <aside className="hidden md:block w-[clamp(200px,22vw,350px)] bg-[#FFFAEE] border-r border-black/5 flex-shrink-0">
            <div className="sticky top-[88px] pl-[clamp(1.5rem,3vw,3rem)] pr-[clamp(1rem,2vw,2rem)] py-10 space-y-12">
              <div>
                <h3 className="font-dm-sans text-[14px] font-bold tracking-[0.1em] text-brand-green/30 uppercase mb-10">Search by Tags</h3>
                <ul className="flex flex-col gap-y-6">
                  <li>
                    <Link
                      href="/tags#archive"
                      className={`text-[15px] font-bold tracking-[0.05em] uppercase transition-all block ${!selectedCategory ? 'text-brand-green' : 'text-brand-green/40 hover:text-brand-green'}`}
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
                        className={`text-[15px] font-bold tracking-[0.05em] uppercase transition-all block ${selectedCategory === cat ? 'text-brand-green' : 'text-brand-green/40 hover:text-brand-green'}`}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-[#F1E8CD] px-[clamp(1rem,4vw,5rem)] py-[clamp(2.5rem,6vw,8rem)]">
            <div className="w-full">
              
              {/* Desktop Header - Original Style */}
              <div className="hidden md:block mb-10">
                <p className="font-dm-sans text-[clamp(18px,2vw,28px)] font-bold tracking-[0.1em] text-brand-green uppercase mb-6">
                  {searchQuery ? `Search Results` : (selectedCategory || "All Archive")}
                </p>
                <div className="w-full h-[1px] bg-brand-green/10" />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center opacity-40">
                  <p className="font-display text-2xl uppercase tracking-widest">No pieces found in the archive.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[clamp(12px,2vw,40px)] gap-y-[clamp(1.5rem,4vw,5rem)] animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.serial} product={product} bgWhite={true} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <section className="w-full bg-[#FFFAEE] py-[clamp(4rem,6vw,10rem)] border-t border-black/5">
          <div className="site-container">
            <div className="flex flex-col items-center text-center mb-12 sm:mb-20 px-4">
              <p className="text-[clamp(10px,1.2vw,14px)] tracking-[0.4em] text-brand-gold uppercase mb-6 font-bold">Trending Collection</p>
              <h2 className="font-dm-sans text-[clamp(24px,3vw,48px)] text-brand-green leading-tight max-w-4xl font-normal">
                Pieces that are currently capturing the community's heart
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[clamp(12px,2vw,40px)] gap-y-[clamp(1.5rem,3vw,4rem)]">
              {displayTrending.map(product => (
                <ProductCard key={`trending-tag-${product.serial}`} product={product} bgWhite={true} />
              ))}
            </div>

            <div className="flex justify-center mt-12 sm:mt-20">
              <Link href="/collections" className="px-[clamp(1.5rem,5vw,3.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] border-2 border-brand-green text-brand-green text-[clamp(11px,1.3vw,18px)] tracking-[0.2em] font-medium uppercase rounded-full hover:bg-brand-green hover:text-white transition-all duration-300">
                View All Collections
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer backgroundImage={config.footerImage} logo={config.logo} whatsappNumber={config.whatsappNumber} />
    </div>
  )
}
