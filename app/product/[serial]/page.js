import Image from "next/image"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"
import dbConnect from "../../../lib/mongodb"
import Product from "../../../models/Product"
import SiteConfig from "../../../models/SiteConfig"
import ProductDetailClient from "./ProductDetailClient"
import { sanitizeMongoose } from "../../../lib/utils"

export const revalidate = 3600;

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
  const { serial } = await params
  
  const productData = await Product.findOne({ serial }).lean()
  const product = productData ? sanitizeMongoose(productData) : null;

  // Fetch site configuration
  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) configData = {};
  const config = sanitizeMongoose(configData);

  // Dynamic Trending Logic
  let displayTrendingData = await Product.find({ tags: { $regex: /^trending$/i } }).limit(4).lean();
  
  if (displayTrendingData.length === 0) {
    displayTrendingData = await Product.aggregate([
      { $sample: { size: 4 } }
    ]);
  }
  
  const displayTrending = sanitizeMongoose(displayTrendingData);

  if (!product) {
    return (
      <main className="bg-[#F1E8CD] min-h-screen">
        <Navbar logo={config.logo} />
        <div className="pt-40 text-center">
          <h1 className="text-[clamp(18px,3vw,28px)]">Product not found</h1>
        </div>
        <Footer backgroundImage={config.footerImage} logo={config.logo} whatsappNumber={config.whatsappNumber} />
      </main>
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com';
  const productJsonLd = {
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
      url: `${siteUrl}/product/${product.serial}`
    },
    aggregateRating: product.numReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.numReviews,
    } : undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${siteUrl}/collections` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${siteUrl}/product/${product.serial}` }
    ]
  };

  return (
    <main className="bg-[#F1E8CD] min-h-screen selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]).replace(/</g, '\\u003c').replace(/>/g, '\\u003e') }}
      />
      <Navbar logo={config.logo} />

      <section className="pt-[clamp(80px,12vw,160px)] pb-[clamp(3rem,6vw,6rem)] bg-[#F1E8CD] w-full">
        <ProductDetailClient product={product} whatsappNumber={config.whatsappNumber} />

        <div className="mt-[clamp(4rem,8vw,8rem)] w-full pt-[clamp(2rem,4vw,4rem)] border-t border-black/5 text-left site-container">
          <p className="font-dm-sans text-[clamp(13px,1.6vw,23px)] font-bold tracking-[0.2em] text-brand-green uppercase mb-4">
            TRENDING COLLECTION
          </p>
          <h2 className="font-dm-sans text-[clamp(20px,2.5vw,36px)] font-normal leading-tight flex items-center gap-3 flex-wrap mb-8 sm:mb-12 text-black">
            Want to look through our Trending Collections
            <Image src="/images/fire.png" alt="Trending this season" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 object-contain inline-block" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,3vw,4rem)]">
            {displayTrending.map(p => (
              <ProductCard key={`trend-${p.serial}`} product={p} bgWhite={true} />
            ))}
          </div>
        </div>
      </section>

      <Footer backgroundImage={config.footerImage} logo={config.logo} whatsappNumber={config.whatsappNumber} />
    </main>
  )
}
