import Link from "next/link"
import HeroContent from "./components/HeroContent"
import ProductCard from "./components/ProductCard"
import PromoBanner from "./components/PromoBanner"
import Footer from "./components/Footer"
import dbConnect from "../lib/mongodb"
import Product from "../models/Product"
import SiteConfig from "../models/SiteConfig"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Home",
  description: "Vriddhi Vastra Home Page - Explore our curated collections of premium silk sarees.",
}

export default async function Home() {
  await dbConnect();

  // Fetch products
  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(productsData));

  // Fetch site configuration
  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) {
    configData = {
      heroImage: "",
      footerImage: "",
      collectionsCategories: [],
      featuredCategories: ["KANCHIPURAM LUXURY", "BANARASI SILK", "MYSORE SILK", "BRIDAL COLLECTION"],
      logo: ""
    }
  }
  const config = JSON.parse(JSON.stringify(configData));

  // Ensure critical fields exist even if doc exists but fields are new
  config.footerImage = config.footerImage || "";
  config.collectionsCategories = config.collectionsCategories || [];

  const trendingProducts = products.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === 'trending' || t.toLowerCase() === 'trending deals'));
  const displayTrending = trendingProducts.length > 0 ? trendingProducts : products;

  return (
    <main className="bg-[#fafafa] min-h-screen selection:bg-black selection:text-white">

      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Image */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat z-0 ${!config.heroImage ? 'bg-[#1c1410]' : ''}`}
          style={config.heroImage ? { backgroundImage: `url('${config.heroImage}')` } : {}}
        ></div>
      </section>
      <HeroContent logo={config.logo} />

      <section className="w-full bg-[#F1E8CD] py-16 px-[clamp(1rem,4vw,5vw)] relative">
        <header className="flex flex-col items-center mb-16 gap-2 text-center relative w-full">
          <div className="flex flex-col items-center text-center">
            <p className="dm-sans-h4 tracking-[0.3em] text-brand-gold uppercase mb-6">
              Shop By Categories
            </p>
            <h1 className="dm-sans-h1 text-brand-black leading-tight">
              Discover Our Signature Categories and Collection
            </h1>
            <p className="dm-sans-h3 text-brand-green mt-6 max-w-3xl mx-auto font-medium">
              Explore the Collection of Finest Silk Sarees of South India
            </p>
            <div className="w-24 h-[1px] bg-brand-gold/40 mt-4"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[clamp(20px,8vw,80px)] gap-y-16">

          {(config.featuredBlocks || []).map((block, i) => {
            const categoryName = block.title || `Category ${i + 1}`;
            const img = block.image || "";
            const catSlug = (categoryName || '').toLowerCase().replace(/\s+/g, '-');

            return (
              <div key={i} className="flex flex-col items-center">

                {/* Lotus image — static, NOT a link */}
                <div className="mb-6 flex justify-center">
                  <img
                    src="/images/Lotus.png"
                    alt="Lotus"
                    className="w-[clamp(80px,10vw,128px)] h-[clamp(80px,10vw,128px)] object-contain"
                  />
                </div>

                <Link href={`/tags?category=${encodeURIComponent(categoryName)}#archive`} className="flex flex-col items-center group w-full dynamic-title-container">
                  {/* Arch card */}
                  <div
                    className="overflow-hidden bg-[#e5e0d8] relative mb-6 shadow-md group-hover:shadow-xl transition-all duration-700 w-[95%] mx-auto aspect-[3/6.5] rounded-t-full"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={categoryName}
                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-green/5 flex items-center justify-center text-brand-green/20 uppercase tracking-widest text-[clamp(8px,1vw,10px)]">
                        {categoryName}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                  </div>

                  <h4 className="dynamic-title tracking-[0.2em] text-brand-green group-hover:text-brand-gold transition-colors duration-300 uppercase mt-5 px-2">
                    {categoryName}
                  </h4>
                </Link>
              </div>
            );
          })}

        </div>

        {/* View All Button */}
        <div className="w-full flex justify-center mt-20">
          <Link
            href="/collections"
            className="inline-flex items-center justify-center px-14 py-4 bg-[#D1A054]/15 rounded-[1.25rem] shadow-lg shadow-black/20 border-[3px] border-white hover:bg-[#D1A054]/25 transition-all duration-300"
          >
            <span className="dm-sans-h4 text-[#1A3D1C] uppercase tracking-widest">
              VIEW ALL
            </span>
          </Link>
        </div>

      </section>
      <section className="w-full bg-[#FFFAEE] py-16 px-[clamp(1rem,4vw,5vw)] relative">
        <header className="relative flex flex-col items-center text-center mb-16 w-full">
          <div className="flex flex-col items-center">
            <p className="dm-sans-h4 tracking-[0.2em] text-brand-gold uppercase font-medium mb-8">
              New Arrivals - Fresh From The Loom
            </p>
            <h3 className="dm-sans-h1 text-brand-green leading-tight max-w-[1100px]">
              Unveil Our Newest Collection of Sarees, blending Tradition with Modern Elegance
            </h3>
          </div>
          <div className="md:absolute md:right-0 md:bottom-0 mt-8 md:mt-0">
            <Link href="/tags?category=NEW+ARRIVALS#archive" className="flex items-center gap-2 text-brand-green group transition-all duration-300">
              <span className="text-[19px] md:text-[19px] font-dm-sans tracking-[0.2em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-1">View More</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:translate-y-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">

          {products.slice(0, 4).map((product, index) => (

            <ProductCard
              key={product.serial || index}
              product={product}
            />

          ))}

        </div>

      </section>






      {/* Style Lookbook Section */}
      <section className="w-full bg-[#F1E8CD] py-16 px-[clamp(1rem,4vw,5vw)] relative">

        <div className="flex flex-col items-center text-center w-full mb-16 px-4">
          <p className="dm-sans-h4 tracking-[0.3em] text-brand-gold uppercase mb-6">
            The Style Look book: SHOP BY OCCASION
          </p>
          <h1 className="dm-sans-h1 text-brand-green leading-tight max-w-6xl mx-auto">
            Find your perfect Style from our Look book and shop by occasion
          </h1>
          <div className="w-24 h-[1px] bg-brand-gold/40 mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 w-full">

          {/* Left Column */}
          <div className="flex flex-col gap-10">
            <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[0]?.title || '')}`} className="relative h-[280px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[0]?.image && <img src={config.lookbookBlocks[0].image} alt="Lookbook 1" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-10 left-10 right-10 flex justify-start">
                <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[0]?.title ? config.lookbookBlocks[0].title.replace(/\\n/g, ' ') : 'BRIDAL COLLECTION'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>

            <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[1]?.title || '')}`} className="relative h-[280px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[1]?.image && <img src={config.lookbookBlocks[1].image} alt="Lookbook 2" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-start">
                <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[1]?.title ? config.lookbookBlocks[1].title.replace(/\\n/g, ' ') : 'CEREMONY VIBE'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>

            <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[2]?.title || '')}`} className="relative h-[560px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[2]?.image && <img src={config.lookbookBlocks[2].image} alt="Lookbook 3" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-start">
                <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[2]?.title ? config.lookbookBlocks[2].title.replace(/\\n/g, ' ') : 'VALUE FOR MONEY'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10">
            <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[3]?.title || '')}`} className="relative h-[560px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[3]?.image && <img src={config.lookbookBlocks[3].image} alt="Lookbook 4" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-10 left-10 right-10 flex justify-start">
                <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[3]?.title ? config.lookbookBlocks[3].title.replace(/\\n/g, ' ') : 'FRESH FROM LOOMS'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>

            <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[4]?.title || '')}`} className="relative h-[560px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[4]?.image && <img src={config.lookbookBlocks[4].image} alt="Lookbook 5" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-[3rem] left-[3rem] right-[3rem] flex justify-start">
                <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[4]?.title ? config.lookbookBlocks[4].title.replace(/\\n/g, ' ') : 'FESTIVE VIBE'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-10 h-10 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>
          </div>

        </div>

      </section>

      {products.some(p => p.tags && p.tags.some(t => t.toUpperCase() === 'EXHIBITION CATEGORIES')) && (
        <section className="w-full bg-[#FFFAEE] py-16 px-[clamp(1rem,4vw,5vw)] border-t border-brand-gold/10 relative">

          <header className="relative flex flex-col items-center text-center mb-16 w-full">
            <div className="flex flex-col items-center">
              <p className="dm-sans-h2 tracking-[0.2em] text-brand-green uppercase font-medium mb-8">
                Signature Series
              </p>
              <h3 className="dm-sans-h1 text-brand-black leading-tight">
                The Exhibition Collection
              </h3>
            </div>
            <div className="md:absolute md:right-0 md:bottom-2 mt-8 md:mt-0">
              <Link href="/tags?category=EXHIBITION+CATEGORIES#archive" className="flex items-center gap-2 text-brand-green group transition-all duration-300">
                <span className="text-[14px] md:text-[15px] font-medium tracking-[0.2em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-1">View More</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:translate-y-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {products
              .filter(p => p.tags && p.tags.some(t => t.toUpperCase() === 'EXHIBITION CATEGORIES'))
              .slice(0, 4)
              .map((product, index) => (
                <ProductCard
                  key={`exhibition-${product.serial || index}`}
                  product={product}
                />
              ))
            }
          </div>
        </section>
      )}

      {/* Trending Deals Section */}
      <section className="w-full bg-[#FFFAEE] py-16 px-[clamp(1rem,4vw,5vw)] relative">
        <header className="relative flex flex-col items-center text-center mb-16 w-full">
          <div className="flex flex-col items-center">
            <p className="dm-sans-h4 tracking-[0.2em] text-brand-gold uppercase font-medium mb-8">
              Trending Deals Deal Of The Day
            </p>
            <h3 className="dm-sans-h1 text-brand-green leading-tight">
              VRIDDHI VASTRA’s Irresistible deals
            </h3>
          </div>
          <div className="md:absolute md:right-0 md:bottom-2 mt-8 md:mt-0">
            <Link href="/tags?category=TRENDING+DEALS#archive" className="flex items-center gap-2 text-brand-green group transition-all duration-300">
              <span className="text-[19px] md:text-[19px] font-medium tracking-[0.2em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-1">View More</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:translate-y-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">

          {displayTrending.slice(0, 4).map((product, index) => (
            <ProductCard
              key={`trending-${product.serial || index}`}
              product={product}
            />
          ))}

        </div>

      </section>


      <PromoBanner {...config.promoBanner} logo={config.logo} />
      <Footer backgroundImage={config.footerImage} logo={config.logo} />

    </main>

  )
}