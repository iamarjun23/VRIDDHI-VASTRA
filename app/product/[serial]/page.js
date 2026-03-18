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
          <h1 className="text-2xl">Product not found</h1>
        </div>
        <Footer backgroundImage={config.footerImage} logo={config.logo} />
      </main>
    )
  }

  return (
    <main className="bg-[#F1E8CD] min-h-screen selection:bg-black selection:text-white">
      <Navbar logo={config.logo} />

      <section className="pt-68 pb-24 px-6 md:px-14 bg-[#F1E8CD] w-full">
        <ProductDetailClient product={product} />

        {/* Trending Section */}
        <div className="mt-32 w-full pt-16 border-t border-black/5">
          <h2 className="dm-sans-h1 text-[36px] leading-tight text-foreground mb-12">
            Want to look through our <span className="font-display italic text-brand-green">Trending Collections</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-16">
            {products.slice(0, 4).map(p => (
              <ProductCard key={`trend-${p.serial}`} product={p} />
            ))}
          </div>
        </div>

      </section>

      <Footer backgroundImage={config.footerImage} logo={config.logo} />
    </main>
  )
}
