import Link from "next/link"
import Image from "next/image"
import HeroContent from "./components/HeroContent"
import ProductCard from "./components/ProductCard"
import FeaturedCategoryGrid from "./components/FeaturedCategoryGrid"
import PromoBanner from "./components/PromoBanner"
import Footer from "./components/Footer"
import dbConnect from "../lib/mongodb"
import Product from "../models/Product"
import { getSiteConfig } from "../lib/fetchSettings"
import { sanitizeMongoose } from "../lib/utils"

export const revalidate = 3600;

export const metadata = {
  title: "Vriddhi Vastra | Premium Silk Sarees",
  description: "Explore our curated collections of premium silk sarees. Handwoven Kanchipuram, Banarasi, and Mysore silk.",
  openGraph: {
    title: "Vriddhi Vastra | Premium Silk Sarees",
    description: "Explore our curated collections of premium silk sarees. Handwoven Kanchipuram, Banarasi, and Mysore silk.",
    url: "https://www.vriddhivastra.com",
    siteName: "Vriddhi Vastra",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  }
}

export default async function Home() {
  await dbConnect();

  const [newArrivalsData, exhibitionData, trendingRawData] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).limit(4).lean(),
    Product.find({ tags: { $regex: /^EXHIBITION CATEGORIES$/i } }).sort({ createdAt: -1 }).limit(4).lean(),
    Product.find({ tags: { $regex: /^trending(?: deals)?$/i } }).sort({ createdAt: -1 }).limit(4).lean(),
  ]);

  const newArrivals = sanitizeMongoose(newArrivalsData);
  const exhibitionProducts = sanitizeMongoose(exhibitionData);
  const trendingRaw = sanitizeMongoose(trendingRawData);

  const config = await getSiteConfig();

  const displayTrending = trendingRaw.length > 0 ? trendingRaw : newArrivals;

  return (
    <main className="bg-[#fafafa] min-h-screen selection:bg-black selection:text-white flex flex-col">
      <div className="flex-grow">

        {/* Hero Section */}
        <section className="relative w-full h-[50vh] sm:h-[70vh] lg:h-screen items-center justify-center overflow-hidden flex pt-[clamp(80px,12vw,140px)]">
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-colors duration-[2000ms] ease-out ${!config.heroImage ? 'bg-[#1c1410]' : ''}`}
            style={config.heroImage ? { backgroundImage: `url('${config.heroImage}')` } : {}}
          >
            <div className="absolute inset-0 bg-gray-900/60 z-10" />
          </div>
        </section>
        <HeroContent logo={config.logo} />

        {/* Shop By Categories */}
        <section className="w-full bg-[#F1E8CD] pt-[clamp(2rem,4.5vw,4rem)] pb-[clamp(3.5rem,8vw,7rem)] relative">
          <div className="site-container">
            <header className="flex flex-col items-center mb-[clamp(3rem,8vw,5rem)] gap-4 text-center relative w-full">
              <div className="flex flex-col items-center text-center">
                <p className="font-dm-sans text-[clamp(12px,1.2vw,16px)] tracking-[0.3em] text-brand-gold uppercase mb-2 sm:mb-3">
                  Shop By Categories
                </p>
                <h2 className="font-dm-sans text-[clamp(11px,3.7vw,28px)] text-brand-black leading-tight whitespace-nowrap">
                  Discover Our Signature Categories and Collection
                </h2>
                <p className="font-dm-sans text-[clamp(12px,1.6vw,19px)] text-brand-green mt-3 sm:mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
                  Explore the Collection of Finest Silk Sarees of South India
                </p>
                <div className="w-24 h-[1px] bg-brand-gold/40 mt-4 sm:mt-5"></div>
              </div>
            </header>

            <FeaturedCategoryGrid blocks={config.featuredBlocks} />

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
        <section className="w-full bg-[#FFFAEE] pt-[clamp(2rem,4.5vw,4rem)] pb-[clamp(3.5rem,8vw,7rem)] relative">
          <div className="site-container">
            <header className="flex flex-col items-center text-center mb-[clamp(1.5rem,4vw,2.5rem)] gap-4 w-full">
              <div className="flex flex-col items-center max-w-[800px] mx-auto">
                <p className="font-dm-sans text-[clamp(12px,1.2vw,16px)] tracking-[0.2em] text-brand-gold uppercase font-medium mb-2 sm:mb-3">
                  New Arrivals — Fresh From The Loom
                </p>
                <h3 className="hidden sm:block font-dm-sans text-[clamp(20px,2.5vw,32px)] text-brand-black leading-tight">
                  Unveil Our Newest Collection of Sarees, blending Tradition with Modern Elegance
                </h3>
                <h3 className="sm:hidden font-dm-sans text-[20px] text-brand-black leading-tight px-2">
                  Newest Saree Collection, blending Tradition with Elegance
                </h3>
              </div>
            </header>

            <div className="flex justify-end mb-[clamp(1rem,2vw,1.5rem)]">
              <Link href="/tags?category=NEW+ARRIVALS#archive" className="flex items-center gap-1.5 text-brand-green group transition-all duration-300">
                <span className="text-[clamp(14px,1.4vw,19px)] font-dm-sans font-normal tracking-[0.15em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-0.5 whitespace-nowrap">View More</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-[clamp(13px,1.4vw,18px)] h-[clamp(13px,1.4vw,18px)] transition-transform group-hover:translate-x-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </Link>
            </div>

            {newArrivals.length === 0 ? (
              <div className="py-20 text-center opacity-40">
                <p className="font-display text-2xl uppercase tracking-widest">No new arrivals presently.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,3vw,4rem)]">
                {newArrivals.map((product, index) => (
                  <ProductCard
                    key={product.serial || index}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Shop By Occasion - Lookbook */}
        <section className="w-full bg-[#F1E8CD] pt-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,6rem)] relative">
          <div className="site-container">
            <div className="flex flex-col items-center text-center w-full mb-[clamp(2rem,5vw,4rem)] px-4">
              <p className="font-dm-sans text-[clamp(12px,1.2vw,16px)] tracking-[0.3em] text-brand-gold uppercase mb-2 sm:mb-3">
                The Style Look book: SHOP BY OCCASION
              </p>
              <h2 className="font-dm-sans text-[clamp(18px,2.2vw,28px)] text-brand-black leading-tight max-w-5xl mx-auto">
                Find your perfect Style from our Look book and shop by occasion
              </h2>
              <div className="w-24 h-[1px] bg-brand-gold/40 mt-4 sm:mt-5"></div>
            </div>

            <div className="grid grid-cols-2 gap-[clamp(1rem,2.5vw,3rem)] w-full">
              {/* Left Column */}
              <div className="flex flex-col gap-[clamp(0.5rem,2vw,2.5rem)]">
                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[0]?.title || '')}`} className="relative h-[clamp(200px,44vw,560px)] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[0]?.image && <Image src={config.lookbookBlocks[0].image} alt="Lookbook 1" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,3vw,2.5rem)] left-[clamp(0.75rem,3vw,2.5rem)] right-[clamp(0.75rem,3vw,2.5rem)] flex justify-start">
                    <h4 className="font-dm-serif text-[clamp(15px,2.5vw,35px)] text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[0]?.title ? config.lookbookBlocks[0].title.replace(/\\n/g, ' ') : 'BRIDAL COLLECTION'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(15px,2.5vw,35px)] h-[clamp(15px,2.5vw,35px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>

                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[1]?.title || '')}`} className="relative h-[clamp(100px,22vw,280px)] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[1]?.image && <Image src={config.lookbookBlocks[1].image} alt="Lookbook 2" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,2.5vw,2rem)] left-[clamp(0.75rem,2.5vw,2rem)] right-[clamp(0.75rem,2.5vw,2rem)] flex justify-start">
                    <h4 className="font-dm-serif text-[clamp(15px,2.5vw,35px)] text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[1]?.title ? config.lookbookBlocks[1].title.replace(/\\n/g, ' ') : 'CEREMONY VIBE'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(15px,2.5vw,35px)] h-[clamp(15px,2.5vw,35px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>

                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[2]?.title || '')}`} className="relative h-[clamp(100px,22vw,280px)] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[2]?.image && <Image src={config.lookbookBlocks[2].image} alt="Lookbook 3" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,2.5vw,2rem)] left-[clamp(0.75rem,2.5vw,2rem)] right-[clamp(0.75rem,2.5vw,2rem)] flex justify-start">
                    <h4 className="font-dm-serif text-[clamp(15px,2.5vw,35px)] text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[2]?.title ? config.lookbookBlocks[2].title.replace(/\\n/g, ' ') : 'VALUE FOR MONEY'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(15px,2.5vw,35px)] h-[clamp(15px,2.5vw,35px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-[clamp(0.5rem,2vw,2.5rem)]">
                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[3]?.title || '')}`} className="relative h-[clamp(100px,22vw,280px)] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[3]?.image && <Image src={config.lookbookBlocks[3].image} alt="Lookbook 4" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(0.75rem,3vw,2.5rem)] left-[clamp(0.75rem,3vw,2.5rem)] right-[clamp(0.75rem,3vw,2.5rem)] flex justify-start">
                    <h4 className="font-dm-serif text-[clamp(15px,2.5vw,35px)] text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[3]?.title ? config.lookbookBlocks[3].title.replace(/\\n/g, ' ') : 'FRESH FROM LOOMS'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(15px,2.5vw,35px)] h-[clamp(15px,2.5vw,35px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>

                <Link href={`/tags?category=${encodeURIComponent(config.lookbookBlocks?.[4]?.title || '')}`} className="relative h-[calc(clamp(300px,66vw,840px)+clamp(0.5rem,2vw,2.5rem))] rounded-[clamp(12px,2vw,32px)] overflow-hidden group cursor-pointer bg-gray-200">
                  {config.lookbookBlocks?.[4]?.image && <Image src={config.lookbookBlocks[4].image} alt="Lookbook 5" fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-[clamp(1rem,4vw,3rem)] left-[clamp(1rem,4vw,3rem)] right-[clamp(1rem,4vw,3rem)] flex justify-start">
                    <h4 className="font-dm-serif text-[clamp(15px,2.5vw,35px)] text-white tracking-[0.05em] uppercase flex items-center gap-2 text-left">
                      {config.lookbookBlocks?.[4]?.title ? config.lookbookBlocks[4].title.replace(/\\n/g, ' ') : 'FESTIVE VIBE'}
                      <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(15px,2.5vw,35px)] h-[clamp(15px,2.5vw,35px)] text-white shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
                    </h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Exhibition Collection */}
        {exhibitionProducts.length > 0 && (
          <section className="w-full bg-[#FFFAEE] pt-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,6rem)] border-t border-brand-gold/10 relative">
            <div className="site-container">
              <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-[clamp(2rem,5vw,4rem)] gap-4 w-full">
                <div className="flex flex-col items-start">
                  <p className="font-dm-sans text-[clamp(11px,1.2vw,16px)] tracking-[0.2em] text-brand-green uppercase font-medium mb-2 sm:mb-3">
                    Signature Series
                  </p>
                  <h3 className="font-dm-sans text-[clamp(20px,2.5vw,32px)] text-brand-black leading-tight">
                    The Exhibition Collection
                  </h3>
                </div>
                <Link href="/tags?category=EXHIBITION+CATEGORIES#archive" className="flex items-center gap-1.5 text-brand-green group transition-all duration-300 shrink-0">
                  <span className="text-[clamp(14px,1.4vw,19px)] font-dm-sans font-normal tracking-[0.15em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-0.5 whitespace-nowrap">View More</span>
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-[clamp(13px,1.4vw,18px)] h-[clamp(13px,1.4vw,18px)] transition-transform group-hover:translate-x-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </Link>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,3vw,4rem)]">
                {exhibitionProducts.map((product, index) => (
                  <ProductCard
                    key={`exhibition-${product.serial || index}`}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trending Deals */}
        <section className="w-full bg-[#F1E8CD] pt-[clamp(1.5rem,3vw,3rem)] pb-[clamp(2.5rem,5vw,6rem)] border-t border-brand-gold/15 relative">
          <div className="site-container">
            <header className="flex flex-col items-center text-center mb-[clamp(1.5rem,4vw,2.5rem)] gap-4 w-full">
              <div className="flex flex-col items-center max-w-[800px] mx-auto">
                <p className="font-dm-sans text-[clamp(12px,1.2vw,16px)] tracking-[0.2em] text-brand-gold uppercase font-medium mb-2 sm:mb-3">
                  Trending Deals — Deal Of The Day
                </p>
                <h3 className="font-dm-sans text-[clamp(18px,2.2vw,28px)] text-brand-black leading-tight">
                  VRIDDHI VASTRA&apos;s Irresistible Deals
                </h3>
              </div>
            </header>

            <div className="flex justify-end mb-[clamp(1rem,2vw,1.5rem)]">
              <Link href="/tags?category=TRENDING+DEALS#archive" className="flex items-center gap-1.5 text-brand-green group transition-all duration-300">
                <span className="text-[clamp(14px,1.4vw,19px)] font-dm-sans font-normal tracking-[0.15em] uppercase border-b border-brand-green/30 group-hover:border-brand-green pb-0.5 whitespace-nowrap">View More</span>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-[clamp(13px,1.4vw,18px)] h-[clamp(13px,1.4vw,18px)] transition-transform group-hover:translate-x-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </Link>
            </div>

            {displayTrending.length === 0 ? (
              <div className="py-20 text-center opacity-40">
                <p className="font-display text-2xl uppercase tracking-widest">No trending deals presently.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,3vw,4rem)]">
                {displayTrending.slice(0, 4).map((product, index) => (
                  <ProductCard
                    key={`trending-${product.serial || index}`}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

      <PromoBanner {...config.promoBanner} logo={config.logo} />
      <Footer backgroundImage={config.footerImage} logo={config.logo} whatsappNumber={config.whatsappNumber} />

    </main>
  )
}