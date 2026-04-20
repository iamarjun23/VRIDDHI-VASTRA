import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"
import dbConnect from "../../../lib/mongodb"
import Product from "../../../models/Product"
import SiteConfig from "../../../models/SiteConfig"
import ProductDetailClient from "./ProductDetailClient"

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  await dbConnect();
  const { serial } = await params;
  const product = await Product.findOne({ serial }).lean();
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: product.name,
    description: `Buy ${product.name} at Vriddhi Vastra. ${product.description || ""}`,
    openGraph: {
      images: [product.image1],
    },
  };
}

export default async function ProductDetailsPage({ params }) {
  await dbConnect()
  const productsData = await Product.find({}).sort({ createdAt: -1 }).lean()
  const products = JSON.parse(JSON.stringify(productsData))

  const { serial } = await params
  const product = products.find(p => p.serial === serial)

  // Fetch site configuration
  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) configData = {};
  const config = JSON.parse(JSON.stringify(configData));

  if (!product) {
    return (
      <main className="bg-[#F1E8CD] min-h-screen">
        <Navbar logo={config.logo} />
        <div className="pt-40 text-center">
          <h1 className="text-[clamp(18px,3vw,28px)]">Product not found</h1>
        </div>
        <Footer backgroundImage={config.footerImage} logo={config.logo} />
      </main>
    )
  }

  return (
    <main className="bg-[#F1E8CD] min-h-screen selection:bg-black selection:text-white">
      <Navbar logo={config.logo} />

      <section className="pt-68 pb-24 px-[clamp(1rem,4vw,5vw)] bg-[#F1E8CD] w-full">
        <ProductDetailClient product={product} />

        {/* Trending Section */}
        {/* Trending Section */}
        <div className="mt-32 w-full pt-16 border-t border-black/5 text-left">
          <p className="dm-sans-h2 tracking-[0.2em] text-brand-green uppercase font-medium mb-4">
            TRENDING COLLECTION
          </p>
          <h2 className="font-[var(--font-dm-sans)] text-[clamp(28px,4vw,56px)] leading-tight flex items-center gap-4 flex-wrap mb-12">
            Want to look through our Trending Collections
            <img src="/images/fire.png" alt="🔥" className="w-5 h-5 md:w-8 md:h-8 object-contain inline-block" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[clamp(10px,2vw,40px)] gap-y-[clamp(16px,4vw,64px)]">
            {products.slice(0, 4).map(p => (
              <ProductCard key={`trend-${p.serial}`} product={p} bgWhite={true} />
            ))}
          </div>
        </div>
      </section>

      <Footer backgroundImage={config.footerImage} logo={config.logo} />
    </main>
  )
}
