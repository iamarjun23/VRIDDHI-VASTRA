"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatWhatsAppMessage, getWhatsAppUrl, trackProductClick } from "../../../lib/utils";
import StarRating from "../../components/StarRating";
import { useProductRating } from "../../hooks/useProductRating";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductDetailClient({ product, whatsappNumber: serverWhatsappNumber }) {
  const { addToCart, whatsappNumber: contextWhatsappNumber } = useCart();
  const whatsappNumber = serverWhatsappNumber || contextWhatsappNumber;
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image1);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const { currentRating, numReviews, handleRate: baseHandleRate } = useProductRating(product.serial, product.rating, product.numReviews);

  const handleRate = async (rating) => {
    const result = await baseHandleRate(rating);
    if (result.success) toast.success("Rating submitted!");
    else toast.error(result.error || "Failed to submit rating");
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleBuyNow = () => {
    trackProductClick(product.serial, product.name);
    const message = formatWhatsAppMessage([{ ...product, quantity }]);
    const url = getWhatsAppUrl(message, whatsappNumber);
    window.open(url, "_blank");
  };

  return (
    <div className="site-container relative">
      {/* Background Blur Overlay when Zooming */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-md z-[90] pointer-events-none transition-opacity duration-500 ease-out ${
          isZooming ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[clamp(10px,1vw,14px)] text-brand-green/60 uppercase tracking-widest pt-4 sm:pt-8 mb-4">
        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-brand-gold transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-brand-green font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start w-full pt-6 md:pt-10 lg:pt-16">

        {/* Left Column - Large Image with Hover Lens Zoom */}
        <div className="w-full z-[100] flex flex-col gap-4 self-start">
          <div className="flex items-center gap-2 mb-2 md:hidden">
            <span className="font-dm-sans text-[clamp(12px,1.2vw,16px)] text-brand-gold tracking-[0.3em] uppercase font-bold">Vriddhi Vastra</span>
            <div className="flex-1 h-[1px] bg-brand-gold/20"></div>
          </div>
          
          <div className="relative w-full lg:max-w-[60%] mx-auto">
            <div
              className="relative w-full aspect-[3/4] rounded-[24px] lg:rounded-[32px] overflow-hidden bg-gray-200 cursor-crosshair group"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              {activeImage ? (
                <>
                  <Image
                    src={activeImage}
                    alt={product.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Source Lens on active image - LG ONLY */}
                  {isZooming && (
                    <div
                      className="absolute z-10 pointer-events-none border border-white/50 bg-white/20 hidden lg:block"
                      style={{
                        left: `${zoomPos.x}%`,
                        top: `${zoomPos.y}%`,
                        width: '35%',
                        height: '45%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-black/5 flex items-center justify-center text-gray-500 font-sans tracking-widest text-sm uppercase">
                  No Image Available
                </div>
              )}
            </div>

            {/* External Zoom Preview Box */}
            {isZooming && activeImage && (
              <div
                className="absolute left-[104%] top-0 w-[120%] h-full bg-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] z-[9999] border border-white/50 overflow-hidden hidden lg:block rounded-[24px] lg:rounded-[32px] pointer-events-none"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '250%',
                }}
              >
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold tracking-widest rounded-full uppercase">
                  High Detail View
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3 sm:gap-4 mt-2 lg:max-w-[60%] mx-auto w-full">
            {[product.image1, product.image2].map((img, i) => (
              img ? (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-[70px] h-[84px] rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-green shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ) : null
            ))}
          </div>
        </div>

        {/* Right Column - Premium Details Card */}
        <div className="w-full relative z-10 self-start">
          <div className="bg-white/45 backdrop-blur-md border border-white/50 shadow-sm rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 lg:p-10 flex flex-col gap-6 w-full self-start">

            {/* Tag for Exhibition */}
            {product.tags && product.tags.some(t => t.toUpperCase() === 'EXHIBITION CATEGORIES') && (
              <div className="flex">
                <span className="px-3 py-1.5 bg-brand-green/10 text-brand-green text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase rounded-full border border-brand-green/20">
                  Exhibition Signature
                </span>
              </div>
            )}

            <div>
              <h1 className="font-dm-sans text-[clamp(22px,2.5vw,32px)] text-brand-green font-medium leading-tight mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <StarRating
                  rating={currentRating}
                  numReviews={numReviews}
                  interactive={true}
                  onRate={handleRate}
                  size="18px"
                  gap="0.15rem"
                />
                {numReviews > 0 && (
                  <span className="text-gray-500 text-[13px] font-dm-sans">({numReviews} Reviews)</span>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-4 py-4 border-y border-black/5">
              <span className="font-dm-sans text-[clamp(24px,3vw,34px)] font-bold text-gold tracking-tight">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-[clamp(16px,1.8vw,20px)] font-normal font-dm-sans">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-bold uppercase tracking-wider text-brand-green">Quantity</p>
              <div className="inline-flex items-center border border-[#E3D7BD]/60 rounded-xl bg-[#F7F1DF]/40 overflow-hidden w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white/60 transition-colors border-r border-[#E3D7BD]/60 text-lg"
                >
                  -
                </button>
                <span className="min-w-[2.5rem] px-2 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white/60 transition-colors border-l border-[#E3D7BD]/60 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 px-4 py-3.5 rounded-full bg-white/80 border border-brand-green/20 text-[#2E4B36] font-dm-sans text-[14px] font-semibold tracking-[0.1em] hover:bg-brand-green hover:text-white hover:border-transparent transition-all duration-300 active:scale-95 shadow-sm whitespace-nowrap"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-4 py-3.5 rounded-full bg-brand-green text-white font-dm-sans text-[14px] font-semibold tracking-[0.1em] hover:bg-brand-green/90 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-md whitespace-nowrap"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.04L0 24l6.117-1.605a11.787 11.787 0 005.925 1.585h.005c6.64 0 12.042-5.402 12.045-12.043a11.794 11.794 0 00-3.418-8.525z" /></svg>
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 py-4 px-2 border-y border-black/5 mt-4 bg-white/20 rounded-2xl">
              <div className="flex flex-col items-center gap-1.5 text-center px-1">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-dm-sans font-bold text-brand-green uppercase tracking-wider leading-tight">100% Pure Silk</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center px-1 border-x border-black/5">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-dm-sans font-bold text-brand-green uppercase tracking-wider leading-tight">Handcrafted</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center px-1">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.427.76-.427.933 0l1.418 3.504a1 1 0 00.758.627l3.824.298c.459.036.643.599.28.879l-2.88 2.22a1 1 0 00-.317.976l.872 3.766c.105.452-.387.809-.77.56l-3.23-2.102a1 1 0 00-1.07 0l-3.23 2.102c-.383.249-.875-.108-.77-.56l.872-3.766a1 1 0 00-.317-.976l-2.88-2.22a1 1 0 00.28-.879l3.824-.298a1 1 0 00.758-.627l1.418-3.504z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-dm-sans font-bold text-brand-green uppercase tracking-wider leading-tight">Heritage Weave</span>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mt-4">
                <h3 className="font-dm-sans text-[14px] font-bold uppercase tracking-wider text-brand-green mb-3">Description</h3>
                <p className="font-dm-sans text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Info Accordions */}
            <div className="flex flex-col border-t border-black/5 pt-2">
              <details className="group border-b border-black/5 py-4 cursor-pointer">
                <summary className="flex justify-between items-center font-dm-sans text-[14px] font-bold text-brand-green uppercase tracking-wider list-none [&::-webkit-details-marker]:hidden">
                  Fabric & Care
                  <span className="transition group-open:rotate-180 text-brand-green">
                    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-3 font-dm-sans text-[13px] text-gray-600 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Dry clean only to maintain the luster and longevity of the silk.</li>
                    <li>Store in a cool, dry place away from direct sunlight, preferably wrapped in pure cotton or muslin cloth.</li>
                    <li>Do not spray perfume directly on the fabric.</li>
                    <li>Air occasionally to prevent moisture buildup and preserve the zari work.</li>
                  </ul>
                </div>
              </details>

              <details className="group border-b border-black/5 py-4 cursor-pointer">
                <summary className="flex justify-between items-center font-dm-sans text-[14px] font-bold text-brand-green uppercase tracking-wider list-none [&::-webkit-details-marker]:hidden">
                  Shipping & Returns
                  <span className="transition group-open:rotate-180 text-brand-green">
                    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-3 font-dm-sans text-[13px] text-gray-600 leading-relaxed space-y-2">
                  <p><strong>Dispatch:</strong> Orders are typically dispatched within 24-48 hours of confirmation.</p>
                  <p><strong>Delivery:</strong> Standard delivery takes 3-7 business days depending on the location.</p>
                  <p><strong>Returns:</strong> We accept returns within 7 days of delivery. The saree must be unworn, unwashed, and in its original condition with all tags intact.</p>
                </div>
              </details>

              <details className="group border-b border-black/5 py-4 cursor-pointer">
                <summary className="flex justify-between items-center font-dm-sans text-[14px] font-bold text-brand-green uppercase tracking-wider list-none [&::-webkit-details-marker]:hidden">
                  Authenticity Guarantee
                  <span className="transition group-open:rotate-180 text-brand-green">
                    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-3 font-dm-sans text-[13px] text-gray-600 leading-relaxed">
                  <p>Every Vriddhi Vastra saree is meticulously woven by master artisans using premium quality silk and authentic zari. We stand proudly by the heritage and craftsmanship of our weaves, ensuring you receive a genuine masterpiece.</p>
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
