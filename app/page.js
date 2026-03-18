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

      <section className="w-full bg-[#F1E8CD] pt-10 pb-24 px-10 md:px-32 relative">
        <header className="flex flex-col items-center mb-16 gap-2 text-center relative w-full">
          <div className="flex flex-col items-center text-center">
            <p className="dm-sans-h4 text-[22px] tracking-[0.2em] text-brand-gold uppercase font-bold mb-2">
              Shop By Categories
            </p>
            <h2 className="dm-sans-h1 text-[40px] text-black leading-tight mt-5">
              Discover Our Signature Categories and Collection
            </h2>
            <p className="dm-sans-h2 text-[25px] text-brand-green mt-8">
              Explore the Collection of Finest Silk Sarees of South India
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-44 gap-y-24">

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
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <Link prefetch={true} href={`/category/${catSlug}`} className="flex flex-col items-center group cursor-pointer w-full">
                  {/* Arch card */}
                  <div
                    className="overflow-hidden bg-[#e5e0d8] relative mb-6 shadow-md group-hover:shadow-xl transition-all duration-700 w-full aspect-[3/5.5] rounded-t-full"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={categoryName}
                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full font-dm-sansC2 font-bold bg-brand-green flex items-end justify-center pb-8 text-[26px] text-brand-green uppercase tracking-[0.2em]">
                        {categoryName}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                  </div>

                  <h4 className="dm-sans-h3  md:text-[24px] text-center tracking-[0.2em] text-brand-green group-hover:text-brand-gold transition-colors duration-300 uppercase mt-5">
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
            className="inline-flex items-center justify-center px-14 py-4 bg-[#D1A054]/15 rounded-[20px] shadow-lg shadow-black/20 border-[3px] border-white hover:bg-[#D1A054]/25 transition-all duration-300"
          >
            <span className="dm-sans-h4 text-[23px] text-[#1A3D1C] uppercase tracking-widest">
              VIEW ALL
            </span>
          </Link>
        </div>

      </section>

      <section className="w-full bg-[#FFFAEE] pt-10 pb-24 px-10 md:px-32 relative">
        <header className="flex flex-col items-center mb-16 gap-2 text-center relative w-full">
          <div className="flex flex-col items-center text-center">
            <p className="dm-sans-h4 text-[18px] tracking-[0.2em] text-brand-gold uppercase font-medium mb-3">
              New Arrivals - Fresh From The Loom
            </p>
            <h3 className="dm-sans-h1 text-black leading-[1.5] max-w-[1100px] mt-5 ">
              Unveil Our Newest Collection of Sarees, blending Tradition with Modern Elegance
            </h3>
          </div>
          <div className="absolute right-0 top-0 hidden md:flex">
            <Link href="/tags" className="flex items-center gap-2 text-[20px] font-dm-sans tracking-widest uppercase text-[#1A3D1C] hover:text-[#1A3D1C]/80 transition-all group">
              <span className="border-b border-[#1A3D1C]/30 group-hover:border-[#1A3D1C] pb-1">View More</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
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
      <section className="w-full bg-[#F1E8CD] pt-10 pb-32 px-10 md:px-32 relative">

        <div className="flex justify-center mb-2">
          <p className="dm-sans-h4 tracking-[0.2em] text-brand-gold uppercase font-medium text-center mb-6">
            The Style Look book: SHOP BY OCCASION
          </p>
        </div>

        <h3 className="dm-sans-h1 text-[30px] text-black text-center mb-16 md:mb-[72px] leading-tight max-w-4xl mx-auto">
          Find your perfect Style from our Look book and shop by occasion
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 w-full">

          {/* Left Column */}
          <div className="flex flex-col gap-10">
            <Link href={`/category/${(config.lookbookBlocks?.[0]?.title || '').toLowerCase().replace(/\s+/g, '-')}`} className="relative h-[480px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[0]?.image && <img src={config.lookbookBlocks[0].image} alt="Lookbook 1" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-10 left-10 right-10 flex justify-start">
                <h4 className="font-display text-[35px] text-white font-medium tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[0]?.title ? config.lookbookBlocks[0].title.replace(/\\n/g, ' ') : 'BRIDAL COLLECTION'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>

            <Link href={`/category/${(config.lookbookBlocks?.[1]?.title || '').toLowerCase().replace(/\s+/g, '-')}`} className="relative h-[220px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[1]?.image && <img src={config.lookbookBlocks[1].image} alt="Lookbook 2" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-start">
                <h4 className="font-display text-[35px] text-white font-medium tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[1]?.title ? config.lookbookBlocks[1].title.replace(/\\n/g, ' ') : 'CEREMONY VIBE'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>

            <Link href={`/category/${(config.lookbookBlocks?.[2]?.title || '').toLowerCase().replace(/\s+/g, '-')}`} className="relative h-[220px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[2]?.image && <img src={config.lookbookBlocks[2].image} alt="Lookbook 3" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-start">
                <h4 className="font-display text-[35px] text-white font-medium tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[2]?.title ? config.lookbookBlocks[2].title.replace(/\\n/g, ' ') : 'VALUE FOR MONEY'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10">
            <Link href={`/category/${(config.lookbookBlocks?.[3]?.title || '').toLowerCase().replace(/\s+/g, '-')}`} className="relative h-[380px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[3]?.image && <img src={config.lookbookBlocks[3].image} alt="Lookbook 4" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-10 left-10 right-10 flex justify-start">
                <h4 className="font-display text-[35px] text-white font-medium tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[3]?.title ? config.lookbookBlocks[3].title.replace(/\\n/g, ' ') : 'FRESH FROM LOOMS'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>

            <Link href={`/category/${(config.lookbookBlocks?.[4]?.title || '').toLowerCase().replace(/\s+/g, '-')}`} className="relative h-[560px] rounded-[32px] overflow-hidden group cursor-pointer bg-gray-200">
              {config.lookbookBlocks?.[4]?.image && <img src={config.lookbookBlocks[4].image} alt="Lookbook 5" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-12 left-12 right-12 flex justify-start">
                <h4 className="font-display text-[35px] text-white font-medium tracking-[0.05em] uppercase flex items-center gap-3 text-left">
                  {config.lookbookBlocks?.[4]?.title ? config.lookbookBlocks[4].title.replace(/\\n/g, ' ') : 'FESTIVE VIBE'}
                  <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-10 h-10 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                </h4>
              </div>
            </Link>
          </div>

        </div>

      </section>

      {products.some(p => p.tags && p.tags.some(t => t.toUpperCase() === 'EXHIBITION CATEGORIES')) && (
        <section className="w-full bg-[#FFFAEE] pt-10 pb-24 px-6 md:px-14 border-t border-brand-gold/10 relative">

          <header className="flex flex-col items-center mb-16 gap-2 text-center relative w-full">
            <div className="flex flex-col items-center text-center">
              <p className="font-dm-sans C4 text-[18px] tracking-[0.2em] text-brand-gold uppercase font-medium mb-2 text-center">
                Signature Series: Exhibition Collection
              </p>
              <h3 className="font-dm-sans C1 text-[30px] text-black text-center leading-tight max-w-4xl mx-auto">
                Exclusive Masterpieces from our latest Exhibition Archive
              </h3>
            </div>

            <div className="absolute right-0 top-0 hidden md:flex">
              <Link href="/category/exhibition-categories" className="flex items-center gap-1 text-[20px] font-dm-sans tracking-widest uppercase text-[#1A3D1C] hover:text-[#1A3D1C]/80 transition-colors group">
                <span className="border-b border-[#1A3D1C]/30 group-hover:border-[#1A3D1C] pb-0.5">Explore Exhibition</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
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
      <section className="w-full bg-[#FFFAEE] pt-10 pb-24 px-10 md:px-32 relative">
        <header className="flex flex-col items-center mb-16 gap-2 text-center relative w-full">
          <div className="flex flex-col items-center text-center">
            <p className="dm-sans-h4 text-[18px] tracking-[0.2em] text-brand-gold uppercase font-medium mb-5">
              Trending: Deal Of The Day 🔥
            </p>
            <h3 className="dm-sans-h1 text-[42px] text-black leading-tight uppercase">
              Vriddhi Vastra's Irresistible deals
            </h3>
          </div>
          <div className="absolute right-0 top-0 hidden md:flex">
            <Link href="/tags" className="flex items-center gap-2 text-[20px] font-dm-sans tracking-widest uppercase text-[#1A3D1C] hover:text-[#1A3D1C]/80 transition-all group">
              <span className="border-b border-[#1A3D1C]/30 group-hover:border-[#1A3D1C] pb-1">View More</span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
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