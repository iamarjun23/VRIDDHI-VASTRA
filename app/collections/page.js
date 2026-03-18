import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import PromoBanner from "../components/PromoBanner"
import dbConnect from "../../lib/mongodb"
import Product from "../../models/Product"
import SiteConfig from "../../models/SiteConfig"

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Collections",
  description: "Browse our signature silk saree collections including Kanchipuram Luxury, Banarasi Silk, and more.",
}

export default async function CollectionsPage() {
  await dbConnect();
  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(productsData));

  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) {
    configData = {
      featuredBlocks: [],
      logo: "",
      footerImage: "",
      promoBanner: {}
    };
  }
  const config = JSON.parse(JSON.stringify(configData));

  // Helper to filter products by category/tag
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
      <Navbar logo={config.logo} />

      <main className="pt-0">
        {/* Header Section - Inspired by Landing Page Categories */}
        <section className="w-full bg-[#F1E8CD] pt-32 md:pt-48 pb-24 px-10 md:px-32">
          <div className="flex flex-col items-center text-center w-full mb-16 px-4">
            <p className="dm-sans-h4 tracking-[0.3em] text-brand-gold uppercase mb-6">
              Shop By Categories
            </p>
            <h1 className="dm-sans-h1 text-brand-green mb-4 leading-tight">
              Discover Our Signature Categories and Collection
            </h1>
            <div className="w-24 h-[1px] bg-brand-gold/40 mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-44 gap-y-24 mx-auto">
            {(config.featuredBlocks || []).slice(0, 4).map((block, i) => {
              const categoryName = block.title || `Category ${i + 1}`;
              const img = block.image || "";
              const catSlug = (categoryName || '').toLowerCase().replace(/\s+/g, '-');

              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="mb-6 flex justify-center">
                    <img src="/images/Lotus.png" alt="Lotus" className="w-32 h-32 object-contain" />
                  </div>
                  <Link href={`/category/${catSlug}`} className="flex flex-col items-center group w-full">
                    <div className="overflow-hidden bg-[#e5e0d8] relative mb-6 shadow-md group-hover:shadow-xl transition-all duration-700 w-full aspect-[3/5.5] rounded-t-full">
                      {img ? (
                        <img src={img} alt={categoryName} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-brand-green/5 flex items-center justify-center text-brand-green/20 uppercase tracking-widest text-xs">{categoryName}</div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                    <h4 className="dm-sans-h2 text-center tracking-[0.2em] text-brand-green group-hover:text-brand-gold transition-colors duration-300 uppercase">
                      {categoryName}
                    </h4>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Collection Sections with Alternating Backgrounds */}
        {collections.map((col, idx) => {
          const catProducts = getProductsByCategory(col.name);
          if (catProducts.length === 0) return null;

          return (
            <section key={idx} className={`w-full ${col.bgColor} py-24 px-10 md:px-32`}>
              <div className="w-full">
                <header className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <p className="dm-sans-h2 tracking-[0.2em] text-brand-green uppercase font-medium mb-8">
                      {col.name}
                    </p>
                    <h3 className="dm-sans-h1 text-brand-black leading-tight">
                      {col.subtext}
                    </h3>
                  </div>
                  <Link
                    href={`/tags?category=${encodeURIComponent(col.name)}`}
                    className="flex items-center gap-2 text-[clamp(14px,1.2vw,16px)] DM Sans C4 tracking-widest uppercase text-brand-green hover:text-brand-gold transition-all group"
                  >
                    <span className="border-b border-brand-green/30 group-hover:border-brand-gold pb-1 whitespace-nowrap">View More</span>
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
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
