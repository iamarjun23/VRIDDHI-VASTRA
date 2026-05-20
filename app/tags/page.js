import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import PromoBanner from "../components/PromoBanner"
import dbConnect from "../../lib/mongodb"
import Product from "../../models/Product"
import { getSiteConfig } from "../../lib/fetchSettings"
import { sanitizeMongoose } from "../../lib/utils"

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
  const products = sanitizeMongoose(productsData);

  const config = await getSiteConfig();

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
  const displayTrending = trendingProducts.length > 0 ? trendingProducts : [...products].sort(() => 0.5 - Math.random()).slice(0, 4);

  const allNavCats = Array.from(new Set(["HOT OFFERS", "BEST SELLER", ...(categories)]));
  const activeLabel = searchQuery ? `"${searchQuery}"` : (selectedCategory || "All Archive");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5ECD7' }}>
      <Navbar logo={config.logo} bgColor="#EDE0C4" />

      <main className="flex flex-col flex-1">
        <div className="pt-[clamp(52px,8vw,70px)]">
          <PromoBanner {...config.promoBanner} logo={config.logo} />
        </div>

        {/* ── Hero Strip ───────────────────────────────────────────────── */}
        <section className="w-full bg-[#1A1A1A] py-[clamp(2.5rem,6vw,5rem)] px-[clamp(1rem,5vw,6rem)]">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="font-dm-sans text-[clamp(10px,1vw,13px)] tracking-[0.4em] text-[#D4AF37] uppercase mb-3">
                Vriddhi Vastra Archive
              </p>
              <h1 className="font-dm-serif text-[clamp(28px,5vw,60px)] text-white leading-tight">
                {searchQuery ? `Results for "${searchQuery}"` : (selectedCategory ? selectedCategory : "The Archive")}
              </h1>
              <p className="font-dm-sans text-[clamp(12px,1.2vw,15px)] text-white/40 mt-2 tracking-wide">
                {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="font-dm-sans text-[11px] text-white/30 uppercase tracking-[0.25em]">Handwoven Luxury</span>
            </div>
          </div>
        </section>

        {/* ── Mobile Filter Pills ──────────────────────────────────────── */}
        <section className="md:hidden bg-[#FFFAEE] border-b border-black/5 px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/tags#archive"
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-dm-sans font-bold uppercase tracking-wider border-2 transition-all ${!selectedCategory && !searchQuery ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-gray-600 border-[#E8E2D9] hover:border-gray-400'}`}
            >
              All
            </Link>
            {allNavCats.map(cat => (
              <Link
                key={cat}
                href={`/tags?category=${encodeURIComponent(cat)}#archive`}
                className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-dm-sans font-bold uppercase tracking-wider border-2 transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-gray-600 border-[#E8E2D9] hover:border-gray-400'}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Main Layout ──────────────────────────────────────────────── */}
        <div id="archive" className="flex flex-1 w-full flex-col md:flex-row">

          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-[clamp(200px,18vw,280px)] bg-[#FFFAEE] border-r border-black/5 shrink-0">
            <div className="sticky top-[88px] p-[clamp(1.5rem,3vw,3rem)] space-y-8">

              {/* Header */}
              <div>
                <p className="font-dm-sans text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase mb-2">Browse</p>
                <h3 className="font-dm-serif text-[clamp(20px,1.8vw,26px)] text-[#1A1A1A] leading-tight">Collections</h3>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />

              {/* Nav list */}
              <nav>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/tags#archive"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-dm-sans font-semibold uppercase tracking-[0.08em] transition-all group ${!selectedCategory && !searchQuery ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#F1E8CD]'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${!selectedCategory && !searchQuery ? 'bg-[#D4AF37]' : 'bg-current opacity-30 group-hover:opacity-60'}`} />
                      All Archive
                    </Link>
                  </li>
                  {allNavCats.map(cat => (
                    <li key={cat}>
                      <Link
                        href={`/tags?category=${encodeURIComponent(cat)}#archive`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-dm-sans font-semibold uppercase tracking-[0.08em] transition-all group ${selectedCategory === cat ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#F1E8CD]'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedCategory === cat ? 'bg-[#D4AF37]' : 'bg-current opacity-30 group-hover:opacity-60'}`} />
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer note */}
              <div className="pt-4 border-t border-black/5">
                <p className="font-dm-sans text-[10px] text-black/30 leading-relaxed tracking-wide">
                  Each piece is handwoven by artisans across South India.
                </p>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 px-[clamp(1rem,4vw,4rem)] pt-[clamp(1.5rem,3vw,3rem)] pb-[clamp(3rem,6vw,8rem)]" style={{ backgroundColor: '#F1E8CD' }}>

            {/* Desktop heading bar */}
            <div className="hidden md:flex items-center justify-between mb-8 pb-5 border-b border-black/8">
              <div>
                <p className="font-dm-sans text-[10px] text-black/30 uppercase tracking-[0.3em] mb-1">
                  {searchQuery ? 'Search' : 'Category'}
                </p>
                <p className="font-dm-sans text-[clamp(16px,1.8vw,22px)] font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                  {activeLabel}
                </p>
              </div>
              <span className="font-dm-sans text-[11px] text-black/30 uppercase tracking-wider">
                {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-black/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="font-dm-serif text-[24px] text-[#1A1A1A] mb-2">No pieces found</h3>
                <p className="font-dm-sans text-[13px] text-black/40 mb-6">Try browsing all collections or a different category.</p>
                <Link href="/tags#archive" className="px-6 py-3 bg-[#1A1A1A] text-white text-[11px] font-dm-sans font-bold uppercase tracking-wider rounded-full hover:bg-black transition-all">
                  View All Archive
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[clamp(12px,2vw,32px)] gap-y-[clamp(1.5rem,4vw,4rem)] animate-in fade-in slide-in-from-bottom-8 duration-700">
                {filteredProducts.map(product => (
                  <ProductCard key={product.serial} product={product} bgWhite={true} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Trending Section ─────────────────────────────────────────── */}
        <section className="w-full bg-[#FFFAEE] py-[clamp(4rem,6vw,9rem)] border-t border-black/5">
          <div className="site-container">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-[clamp(2rem,4vw,3.5rem)]">
              <div>
                <p className="font-dm-sans text-[clamp(10px,1vw,13px)] tracking-[0.35em] text-[#D4AF37] uppercase mb-2">Right Now</p>
                <h3 className="font-dm-serif text-[clamp(22px,2.5vw,36px)] text-[#1A1A1A] leading-tight">
                  Trending Pieces
                </h3>
              </div>
              <p className="font-dm-sans text-[clamp(12px,1.1vw,14px)] text-black/40 max-w-sm">
                Pieces currently capturing the community's heart
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,3vw,4rem)]">
              {displayTrending.map(product => (
                <ProductCard key={`trending-tag-${product.serial}`} product={product} bgWhite={true} />
              ))}
            </div>

            <div className="flex justify-center mt-[clamp(2.5rem,5vw,5rem)]">
              <Link href="/collections" className="px-[clamp(1.5rem,5vw,3rem)] py-[clamp(0.75rem,1.5vw,1rem)] border-2 border-[#1A1A1A] text-[#1A1A1A] text-[clamp(10px,1.1vw,13px)] tracking-[0.25em] font-dm-sans font-bold uppercase rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all duration-300">
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
