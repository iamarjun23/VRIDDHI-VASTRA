import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import FeaturedCategoryGrid from "../components/FeaturedCategoryGrid"
import PromoBanner from "../components/PromoBanner"
import dbConnect from "../../lib/mongodb"
import Product from "../../models/Product"
import { getSiteConfig } from "../../lib/fetchSettings"
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

  const config = await getSiteConfig();

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
        <section className="w-full bg-[#F1E8CD] pt-[clamp(60px,9vw,135px)] pb-[clamp(2.5rem,5vw,6rem)]">
          <div className="site-container">
            <header className="flex flex-col items-center mb-[clamp(3rem,8vw,5rem)] gap-4 text-center relative w-full">
              <div className="flex flex-col items-center text-center">
                <p className="font-dm-sans text-[clamp(12px,1.2vw,16px)] tracking-[0.3em] text-brand-gold uppercase mb-2 sm:mb-3">
                  Shop By Categories
                </p>
                <h1 className="font-dm-sans text-[clamp(11px,3.7vw,28px)] text-brand-black leading-tight whitespace-nowrap">
                  Discover Our Signature Categories and Collection
                </h1>
                <div className="w-24 h-[1px] bg-brand-gold/40 mt-4 sm:mt-5"></div>
              </div>
            </header>

            <FeaturedCategoryGrid blocks={(config.featuredBlocks || []).slice(0, 4)} />
          </div>
        </section>

        {/* Collection Sections */}
        {collections.map((col, idx) => {
          const catProducts = getProductsByCategory(col.name);
          if (catProducts.length === 0) return null;

          return (
            <section key={idx} className={`w-full ${col.bgColor} py-[clamp(2.5rem,5vw,6rem)]`}>
              <div className="site-container">
                <header className="flex flex-col items-start text-left mb-[clamp(1.5rem,4vw,2.5rem)] gap-4 w-full">
                  <div className="flex flex-col items-start max-w-[800px]">
                    <p className="font-dm-sans text-[clamp(13px,1.6vw,23px)] tracking-[0.2em] text-brand-green uppercase font-medium mb-2 sm:mb-3">
                      {col.name}
                    </p>
                    <h3 className="font-dm-sans text-[clamp(16px,2vw,28px)] text-brand-black leading-tight">
                      {col.subtext}
                    </h3>
                  </div>
                </header>

                <div className="flex justify-end mb-[clamp(1rem,2vw,1.5rem)]">
                  <Link
                    href={`/tags?category=${encodeURIComponent(col.name)}`}
                    className="flex items-center gap-1.5 text-[clamp(14px,1.4vw,19px)] font-dm-sans font-normal tracking-[0.15em] uppercase text-brand-green group transition-all duration-300"
                  >
                    <span className="border-b border-brand-green/30 group-hover:border-brand-green pb-0.5 whitespace-nowrap">View More</span>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-[clamp(13px,1.4vw,18px)] h-[clamp(13px,1.4vw,18px)] transition-transform group-hover:translate-x-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                </div>

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
