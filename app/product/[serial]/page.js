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
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com';
  const productUrl = `${siteUrl}/product/${serial}`;
  const description = product.description || `Buy the elegant ${product.name} at Vriddhi Vastra. Premium quality silk sarees.`;

  return {
    title: product.name,
    description: description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | Vriddhi Vastra`,
      description: description,
      url: productUrl,
      images: product.image1 ? [
        {
          url: product.image1,
          width: 800,
          height: 1000,
          alt: product.name,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: product.image1 ? [product.image1] : [],
    }
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

  // Dynamic Trending Logic
  const trendingProducts = products.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === 'trending')).slice(0, 4);
  const displayTrending = trendingProducts.length > 0 
    ? trendingProducts 
    : [...products].sort(() => 0.5 - Math.random()).slice(0, 4);

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image1 ? [product.image1] : [],
    description: product.description || `Buy ${product.name} at Vriddhi Vastra.`,
    sku: product.serial,
    brand: {
      '@type': 'Brand',
      name: 'Vriddhi Vastra'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com'}/product/${product.serial}`
    },
    aggregateRating: product.numReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.numReviews,
    } : undefined,
  };

  return (
    <main className="bg-[#F1E8CD] min-h-screen selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar logo={config.logo} />

      <section className="pt-24 md:pt-40 pb-24 px-[clamp(1rem,4vw,5vw)] bg-[#F1E8CD] w-full">
        <ProductDetailClient product={product} />

        <div className="mt-32 w-full pt-16 border-t border-black/5 text-left">
          <p className="font-dm-sans text-[23px] font-bold tracking-[0.2em] text-brand-green uppercase mb-4">
            TRENDING COLLECTION
          </p>
          <h2 className="font-dm-sans text-[36px] font-normal leading-tight flex items-center gap-4 flex-wrap mb-12 text-black">
            Want to look through our Trending Collections
            <img src="/images/fire.png" alt="🔥" className="w-8 h-8 object-contain inline-block" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[clamp(15px,3vw,60px)] gap-y-[clamp(16px,4vw,64px)]">
            {displayTrending.map(p => (
              <ProductCard key={`trend-${p.serial}`} product={p} bgWhite={true} />
            ))}
          </div>
        </div>
      </section>

      <Footer backgroundImage={config.footerImage} logo={config.logo} />
    </main>
  )
}
