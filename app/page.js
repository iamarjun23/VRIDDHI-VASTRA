import Link from "next/link"
import Image from "next/image"
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

  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(productsData));

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

  config.footerImage = config.footerImage || "";
  config.collectionsCategories = config.collectionsCategories || [];

  const trendingProducts = products.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === 'trending' || t.toLowerCase() === 'trending deals'));
  const displayTrending = trendingProducts.length > 0 ? trendingProducts : products;

  return (
    <main className="bg-[#fafafa] min-h-screen selection:bg-black selection:text-white flex flex-col">
      <div className="flex-grow">

        {/* Hero Section */}
        <section className="relative w-full h-[50vh] sm:h-[70vh] lg:h-screen items-center justify-center overflow-hidden flex">
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-colors duration-[2000ms] ease-out ${!config.heroImage ? 'bg-[#1c1410]' : ''}`}
            style={config.heroImage ? { backgroundImage: `url('${config.heroImage}')` } : {}}
          >
            <div className="absolute inset-0 bg-gray-900/60 z-10" />
          </div>
        </section>
        <HeroContent logo={config.logo} />

        {/* Shop By Categories */}
        <section className="w-full bg-[#F1E8CD] py-[clamp(3.5rem,8vw,7rem)] relative">
          <div className="max-w-[2000px] mx-auto w-full px-[clamp(1.25rem,5vw,5rem)]">
            <header className="flex flex-col items-center mb-[clamp(3rem,8vw,5rem)] gap-4 text-center relative w-full">
              <div className="flex flex-col items-center text-center">
                <p className="font-dm-sans text-[clamp(11px,1.2vw,16px)] tracking-[0.3em] text-brand-gold uppercase mb-6 sm:mb-8">
                  Shop By Categories
                </p>
                <h2 className="font-dm-sans text-[clamp(22px,3vw,32px)] text-brand-black leading-tight max-w-3xl">
                  Discover Our Signature Categories and Collection
                </h2>
                <p className="font-dm-sans text-[clamp(14px,1.6vw,20px)] text-brand-green mt-6 sm:mt-8 max-w-2xl mx-auto font-medium leading-relaxed">
                  Explore the Collection of Finest Silk Sarees of South India
                </p>
                <div className="w-24 h-[1px] bg-brand-gold/40 mt-8"></div>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[clamp(8px,3vw,80px)] gap-y-[clamp(1.5rem,4vw,4rem)]">
              {(config.featuredBlocks || []).map((block, i) => {
                const categoryName = block.title || `Category ${i + 1}`;
                const img = block.image || "";

                return (
                  <div key={i} className="flex flex-col items-center">
                    {/* Lotus image */}
                    <div className="mb-4 sm:mb-6 flex justify-center">
                      <Image
                        src="/images/Lotus.png"
                        alt="Lotus"
                        width={128}
                        height={128}
                        className="w-auto h-[clamp(56px,8vw,128px)] object-contain"
                      />
                    </div>

                    <Link href={`/tags?category=${encodeURIComponent(categoryName)}#archive`} className="flex flex-col items-center group w-full dynamic-title-container">
                      <div className="overflow-hidden bg-[#e5e0d8] relative mb-2 shadow-md group-hover:shadow-xl transition-all duration-700 w-[75%] sm:w-[95%] mx-auto aspect-[3/6] rounded-t-full">
                        {img ? (
                          <Image
                            src={img}
                            alt={categoryName}
                            fill
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-brand-green/5 flex items-center justify-center text-brand-green/20 uppercase tracking-widest text-[clamp(7px,0.8vw,10px)]">
                            {categoryName}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/15 transition-colors duration-500" />
                      </div>

                      <h4 className="font-dm-sans text-[clamp(10px,1.6vw,23px)] tracking-[0.1em] text-brand-green group-hover:text-brand-gold transition-colors duration-300 uppercase mt-1 px-1 text-center w-full">
                        {categoryName}
                      </h4>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* View All Button */}
            <div className="w-full flex justify-center mt-8 sm:mt-10">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-[clamp(2rem,8vw,5rem)] py-[clamp(0.75rem,1.5vw,1rem)] bg-[#D1A054]/15 rounded-[1.25rem] shadow-lg shadow-black/20 border-[3px] border-white hover:bg-[#D1A054]/25 transition-all duration-300"
              >
                <span className="font-dm-sans text-[clamp(12px,1.6vw,23px)] text-[#1A3D1C] uppercase tracking-widest">
                  VIEW ALL
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="w-full bg-[#FFFAEE] py-[clamp(3.5rem,8vw,7rem)] relative">
          <div className="max-w-[2000px] mx-auto w-full px-[clamp(1.25rem,5vw,5rem)]">
            <header className="relative flex flex-col items-center text-center mb-[clamp(3rem,8vw,5rem)] w-full">
              <div className="flex flex-col items-center pb-12 md:pb-0">
                <p className="font-dm-sans text-[clamp(11px,1.2vw,16px)] tracking-[0.2em] text-brand-gold uppercase font-medium mb-6 sm:mb-8">
                  New Arrivals - Fresh From The Loom
                </p>
                <h3 className="font-dm-sans text-[clamp(20px,2.5vw,32px)] text-brand-green leading-tight max-w-[900px]">
                  Unveil Our Newest Collection of Sarees, blending Tradition with Modern Elegance
                </h3>
              </div>
              <div className="absolute right-0 bottom-0">
                <Link href="/tags?category=NEW+ARRIVALS#archive" className="flex items-center gap-1.5 text-brand-green group transition-all duration-300">
                  <span className="text-[clamp(11px,1.3vw,19px)] font-dm-sans tracking-[0.15em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-0.5 whitespace-nowrap">View More</span>
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.2vw,16px)] h-[clamp(10px,1.2vw,16px)] transition-transform group-hover:translate-y-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </Link>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[clamp(8px,2vw,40px)] gap-y-[clamp(1.5rem,4vw,4rem)]">
              {products.slice(0, 4).map((product, index) => (
                <ProductCard
                  key={product.serial || index}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shop By Occasion - Lookbook */}
        <section className="w-full bg-[#F1E8CD] py-[clamp(2.5rem,5vw,6rem)] relative">
          <div className="max-w-[2000px] mx-auto w-full px-[clamp(1rem,4vw,5rem)]">
            <div className="flex flex-col items-center text-center w-full mb-[clamp(2rem,5vw,4rem)] px-4">
              <p className="font-dm-sans text-[clamp(11px,1.2vw,16px)] tracking-[0.3em] text-brand-gold uppercase mb-4 sm:mb-6">
                The Style Look book: SHOP BY OCCASION
              </p>
              <h2 className="font-dm-sans text-[clamp(18px,2.2vw,28px)] text-brand-green leading-tight max-w-5xl mx-auto">
                Find your perfect Style from our Look book and shop by occasion
              </h2>
              <div className="w-24 h-[1px] bg-brand-gold/40 mt-4"></div>
            </div>

            <div className="grid grid-cols-2 gap-x-[clamp(8px,2.5vw,48px)] gap-y-[clamp(1rem,3vw,2.5rem)] w-full">
              {/* Left Column */}
              <div className="flex flex-col gap-[clamp(0.5rem,2vw,2.5rem)]">
                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[0]?.title || '')}`} className="relative h-[clamp(100px,22vw,280px)] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[0]?.image && <Image src={config.lookbookBlocks[0].image} alt="Lookbook 1" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,3vw,2.5rem)] left-[clamp(0.75rem,3vw,2.5rem)] right-[clamp(0.75rem,3vw,2.5rem)] flex justify-start">
                    <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[0]?.title ? config.lookbookBlocks[0].title.replace(/\\n/g, ' ') : 'BRIDAL COLLECTION'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(14px,2.5vw,32px)] h-[clamp(14px,2.5vw,32px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>

                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[1]?.title || '')}`} className="relative h-[clamp(100px,22vw,280px)] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[1]?.image && <Image src={config.lookbookBlocks[1].image} alt="Lookbook 2" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,2.5vw,2rem)] left-[clamp(0.75rem,2.5vw,2rem)] right-[clamp(0.75rem,2.5vw,2rem)] flex justify-start">
                    <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[1]?.title ? config.lookbookBlocks[1].title.replace(/\\n/g, ' ') : 'CEREMONY VIBE'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(12px,2vw,24px)] h-[clamp(12px,2vw,24px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>

                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[2]?.title || '')}`} className="relative h-[clamp(200px,44vw,560px)] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[2]?.image && <Image src={config.lookbookBlocks[2].image} alt="Lookbook 3" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,2.5vw,2rem)] left-[clamp(0.75rem,2.5vw,2rem)] right-[clamp(0.75rem,2.5vw,2rem)] flex justify-start">
                    <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[2]?.title ? config.lookbookBlocks[2].title.replace(/\\n/g, ' ') : 'VALUE FOR MONEY'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(12px,2vw,24px)] h-[clamp(12px,2vw,24px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-[clamp(0.5rem,2vw,2.5rem)]">
                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[3]?.title || '')}`} className="relative h-[calc(clamp(200px,44vw,560px)+clamp(0.25rem,1vw,1.25rem))] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[3]?.image && <Image src={config.lookbookBlocks[3].image} alt="Lookbook 4" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,3vw,2.5rem)] left-[clamp(0.75rem,3vw,2.5rem)] right-[clamp(0.75rem,3vw,2.5rem)] flex justify-start">
                    <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[3]?.title ? config.lookbookBlocks[3].title.replace(/\\n/g, ' ') : 'FRESH FROM LOOMS'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(14px,2.5vw,32px)] h-[clamp(14px,2.5vw,32px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>

                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[4]?.title || '')}`} className="relative h-[calc(clamp(200px,44vw,560px)+clamp(0.25rem,1vw,1.25rem))] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[4]?.image && <Image src={config.lookbookBlocks[4].image} alt="Lookbook 5" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(1rem,4vw,3rem)] left-[clamp(1rem,4vw,3rem)] right-[clamp(1rem,4vw,3rem)] flex justify-start">
                    <h4 className="display-h3 text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[4]?.title ? config.lookbookBlocks[4].title.replace(/\\n/g, ' ') : 'FESTIVE VIBE'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(14px,3vw,40px)] h-[clamp(14px,3vw,40px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Exhibition Collection */}
        {products.some(p => p.tags && p.tags.some(t => t.toUpperCase() === 'EXHIBITION CATEGORIES')) && (
          <section className="w-full bg-[#FFFAEE] py-[clamp(2.5rem,5vw,6rem)] border-t border-brand-gold/10 relative">
            <div className="max-w-[2000px] mx-auto w-full px-[clamp(1rem,4vw,5rem)]">
              <header className="relative flex flex-col items-center text-center mb-[clamp(2rem,5vw,4rem)] w-full">
                <div className="flex flex-col items-center pb-8 md:pb-0">
                  <p className="dm-sans-h2 tracking-[0.2em] text-brand-green uppercase font-medium mb-4 sm:mb-6">
                    Signature Series
                  </p>
                  <h3 className="dm-sans-h1 text-brand-black leading-tight">
                    The Exhibition Collection
                  </h3>
                </div>
                <div className="absolute right-0 bottom-2">
                  <Link href="/tags?category=EXHIBITION+CATEGORIES#archive" className="flex items-center gap-1.5 text-brand-green group transition-all duration-300">
                    <span className="text-[clamp(11px,1.3vw,19px)] font-dm-sans tracking-[0.15em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-0.5 whitespace-nowrap">View More</span>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.2vw,16px)] h-[clamp(10px,1.2vw,16px)] transition-transform group-hover:translate-y-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </Link>
                </div>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[clamp(8px,2vw,40px)] gap-y-[clamp(1.5rem,4vw,4rem)]">
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
            </div>
          </section>
        )}

        {/* Trending Deals */}
        <section className="w-full bg-[#FFFAEE] py-[clamp(2.5rem,5vw,6rem)] px-[clamp(1rem,4vw,5rem)] relative">
          <header className="relative flex flex-col items-center text-center mb-[clamp(2rem,5vw,4rem)] w-full">
            <div className="flex flex-col items-center pb-8 md:pb-0">
              <p className="font-dm-sans text-[clamp(11px,1.2vw,16px)] tracking-[0.2em] text-brand-gold uppercase font-medium mb-4 sm:mb-6">
                Trending Deals Deal Of The Day
              </p>
              <h3 className="font-dm-sans text-[clamp(18px,2.2vw,28px)] text-brand-green leading-tight">
                VRIDDHI VASTRA&apos;s Irresistible deals
              </h3>
            </div>
            <div className="absolute right-0 bottom-2">
              <Link href="/tags?category=TRENDING+DEALS#archive" className="flex items-center gap-1.5 text-brand-green group transition-all duration-300">
                <span className="text-[clamp(11px,1.3vw,19px)] font-dm-sans tracking-[0.15em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-0.5 whitespace-nowrap">View More</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.2vw,16px)] h-[clamp(10px,1.2vw,16px)] transition-transform group-hover:translate-y-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </Link>
            </div>
          </header>

          <div className="max-w-[2000px] mx-auto w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[clamp(8px,2vw,40px)] gap-y-[clamp(1.5rem,4vw,4rem)]">
              {displayTrending.slice(0, 4).map((product, index) => (
                <ProductCard
                  key={`trending-${product.serial || index}`}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>

      </div>

      <PromoBanner {...config.promoBanner} logo={config.logo} />
      <Footer backgroundImage={config.footerImage} logo={config.logo} whatsappNumber={config.whatsappNumber} />

    </main>
  )
}