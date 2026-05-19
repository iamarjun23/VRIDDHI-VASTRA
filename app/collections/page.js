import Link from "next/link"
import Image from "next/image"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import PromoBanner from "../components/PromoBanner"
import dbConnect from "../../lib/mongodb"
import Product from "../../models/Product"
import SiteConfig from "../../models/SiteConfig"
import { sanitizeMongoose } from "../../lib/utils"

export const revalidate = 3600;

export const metadata = {
  title: "Collections | Vriddhi Vastra",
  description: "Explore all our premium silk saree collections.",
  alternates: {
    canonical: "https://www.vriddhivastra.com/collections",
  },
  openGraph: {
    title: "Collections | Vriddhi Vastra",
    description: "Explore all our premium silk saree collections.",
    url: "https://www.vriddhivastra.com/collections",
    siteName: "Vriddhi Vastra",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  }
}

export default async function CollectionsPage() {
  await dbConnect();
  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = sanitizeMongoose(productsData);

  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) {
    configData = {
      featuredBlocks: [],
      logo: "",
      footerImage: "",
      promoBanner: {}
    };
  }
  const config = sanitizeMongoose(configData);

  const getProductsByCategory = (catName) => {
    return products.filter(p => {
      const isCategoryMatch = p.category && p.category.toUpperCase() === catName.toUpperCase();
      const isTagMatch = p.tags && p.tags.some(t => t.toUpperCase() === catName.toUpperCase());
      return isCategoryMatch || isTagMatch;
    }).slice(0, 4);
  };

  const collections = [
    { name: "KANCHIPURAM LUXURY", subtext: "Collection straight from KANCHIPURAM", bgColor: "bg-[#FFFAEE]" },
    { name: "BANARASI SILK", subtext: "Saree Slay – Banarasi Edition", bgColor: "bg-[#F1E8CD]" },
    { name: "MYSORE SILK", subtext: "The Elegance of Mysore", bgColor: "bg-[#FFFAEE]" },
    { name: "BRIDAL COLLECTION", subtext: "Your Perfect Wedding Match", bgColor: "bg-[#F1E8CD]" }
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen selection:bg-brand-green selection:text-white">
      <Navbar logo={config.logo} bgColor="#E9DAC1" />

      <main className="pt-0">
        {/* Header Section */}
        <section className="w-full bg-[#F1E8CD] pt-[clamp(80px,12vw,180px)] pb-[clamp(2.5rem,5vw,6rem)]">
          <div className="site-container">
            <div className="flex flex-col items-center text-center w-full mb-[clamp(2rem,5vw,4rem)] px-4">
              <p className="font-dm-sans text-[clamp(11px,1.2vw,16px)] tracking-[0.3em] text-brand-gold uppercase mb-4 sm:mb-6">
                Shop By Categories
              </p>
              <h1 className="font-dm-sans text-[clamp(18px,2.2vw,28px)] text-brand-green leading-tight">
                Discover Our Signature Categories and Collection
              </h1>
              <div className="w-24 h-[1px] bg-brand-gold/40 mt-4 sm:mt-6"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,3vw,4rem)] mx-auto mt-[clamp(2.5rem,6vw,5rem)]">
              {(config.featuredBlocks || []).slice(0, 4).map((block, i) => {
                const categoryName = block.title || `Category ${i + 1}`;
                const img = block.image || "";

                return (
                  <div key={i} className="flex flex-col items-center">
                    {/* Lotus image */}
                    <div className="mb-4 sm:mb-6 flex justify-center">
                      <Image
                        src="/images/Lotus.png"
                        alt=""
                        role="presentation"
                        width={128}
                        height={128}
                        loading="lazy"
                        className="w-auto h-[clamp(56px,8vw,128px)] object-contain"
                      />
                    </div>

                    <Link href={`/tags?category=${encodeURIComponent(categoryName)}#archive`} className="flex flex-col items-center group w-full dynamic-title-container">
                      <div className="overflow-hidden bg-[#e5e0d8] relative mb-2 shadow-md group-hover:shadow-xl transition-all duration-700 w-[75%] sm:w-[95%] mx-auto aspect-[3/6] rounded-t-full">
                        {img ? (
                          <Image src={img} alt={categoryName} fill sizes="(max-width: 640px) 38vw, (max-width: 1024px) 20vw, 15vw" className="object-cover transform transition-transform duration-1000 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-brand-green/5 flex items-center justify-center text-brand-green/20 uppercase tracking-widest text-[clamp(7px,0.8vw,12px)]">{categoryName}</div>
                        )}
                        <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/15 transition-colors duration-500" />
                      </div>

                      <h4 className="font-dm-sans text-[clamp(10px,1.5vw,23px)] tracking-[0.1em] text-brand-green group-hover:text-brand-gold transition-colors duration-300 uppercase mt-1 px-1 text-center w-full">
                        {categoryName}
                      </h4>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Collection Sections */}
        {collections.map((col, idx) => {
          const catProducts = getProductsByCategory(col.name);
          if (catProducts.length === 0) return null;

          return (
            <section key={idx} className={`w-full ${col.bgColor} py-[clamp(2.5rem,5vw,6rem)]`}>
              <div className="site-container">
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-[clamp(2rem,4vw,4rem)] gap-4 w-full">
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <p className="font-dm-sans text-[clamp(13px,1.6vw,23px)] tracking-[0.2em] text-brand-green uppercase mb-2 sm:mb-4">
                      {col.name}
                    </p>
                    <h3 className="font-dm-sans text-[clamp(16px,2vw,28px)] text-brand-black leading-tight truncate w-full">
                      {col.subtext}
                    </h3>
                  </div>
                  <Link
                    href={`/tags?category=${encodeURIComponent(col.name)}`}
                    className="flex items-center gap-1 text-[clamp(10px,1.1vw,16px)] tracking-widest uppercase text-brand-green hover:text-brand-gold transition-all group shrink-0"
                  >
                    <span className="border-b border-brand-green/30 group-hover:border-brand-gold pb-1 whitespace-nowrap">View More</span>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[clamp(1rem,3vw,4rem)]">
                  {catProducts.map(product => (
                    <ProductCard key={product.serial} product={product} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <PromoBanner {...config.promoBanner} logo={config.logo} />
      <Footer backgroundImage={config.footerImage} logo={config.logo} />
    </div>
  )
}
