"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatWhatsAppMessage, getWhatsAppUrl } from "../../../lib/utils";
import StarRating from "../../components/StarRating";


export default function ProductDetailClient({ product }) {
  const { addToCart, whatsappNumber } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image1);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleBuyNow = () => {
    const message = formatWhatsAppMessage([{ ...product, quantity }]);
    const url = getWhatsAppUrl(message, whatsappNumber);
    window.open(url, "_blank");
  };

  const [currentRating, setCurrentRating] = useState(product.rating || 0);
  const [numReviews, setNumReviews] = useState(product.numReviews || 0);

  const handleRate = async (rating) => {
    try {
      const res = await fetch(`/api/products/${product.serial}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentRating(data.rating);
        setNumReviews(data.numReviews);
      } else {
        alert(data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Rating error:", error);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-[clamp(10px,3vw,64px)] items-start w-full">

      {/* Left Column - Images with Zoom */}
      <div className="flex flex-col gap-4 max-w-[640px] mx-auto w-full">
        <div className="relative">
          <div
            className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-200 cursor-crosshair group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            {activeImage ? (
              <>
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Source Lens on active image */}
                {isZooming && (
                  <div
                    className="absolute z-10 pointer-events-none border border-white/50 bg-white/20"
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

          {/* External Zoom Preview Box (LUXURY SIDE SIDE) */}
          {isZooming && activeImage && (
            <div
              className="absolute left-[102%] top-0 w-[120%] h-full bg-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] z-[100] border border-gray-100 overflow-hidden hidden lg:block rounded-[24px] pointer-events-none"
              style={{
                backgroundImage: `url(${activeImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '300%', // Magnification level
              }}
            >
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[clamp(8px,1vw,12px)] font-bold tracking-widest rounded-full uppercase">
                High Detail View
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails — centered under main image */}
        <div className="flex justify-center gap-4 mt-2">
          {[product.image1, product.image2].map((img, i) => (
            img ? (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-green shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
              </button>
            ) : null
          ))}
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="flex flex-col py-3 gap-5">

        {/* Brand Label & Tag */}
        <div className="flex items-center gap-4 mb-4">
          <p className="display-h6 text-brand-green">Vriddhi Vastra</p>
          {product.tags && product.tags.some(t => t.toUpperCase() === 'EXHIBITION CATEGORIES') && (
            <span className="px-4 py-1.5 bg-brand-green/10 text-brand-green text-[clamp(8px,1vw,12px)] font-bold tracking-[0.2em] uppercase rounded-full border border-brand-green/20">Exhibition Signature</span>
          )}
        </div>

        {/* Product Name */}
        <h1 className="font-dm-sans text-[clamp(12px,4vw,48px)] text-brand-green font-medium leading-snug">
          {product.name}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-[clamp(5px,2vw,20px)] pt-[clamp(10px,4vw,24px)] border-t border-gray-100">
          <span className="font-sans text-[clamp(12px,4vw,38px)] font-bold text-gold tracking-tight">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-[clamp(10px,3vw,25px)] font-light">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Quantity */}
        <div className="pt-2">
          <p className="text-[clamp(16px,2vw,25px)] DMsansC3 text-[#020202] mb-8">Quantity</p>
          <div className="inline-flex items-center border border-[#E3D7BD] rounded-xl bg-[#F7F1DF] overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-15 h-15 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200 text-lg"
            >
              -
            </button>
            <span className="w-15 text-center text-base font-medium text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-15 h-15 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-200 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* CTA Buttons - stacked */}
        <div className="flex flex-col gap-7 pt-10 ">
          <button
            onClick={() => addToCart(product, quantity)}
            className="w-full sm:w-[80%] md:w-[60%] mx-auto px-2 py-[clamp(0.5rem,2vw,1rem)] rounded-full bg-white/45 text-[#2E4B36] font-dm-sans text-[clamp(8px,1.5vw,21px)] tracking-[0.1em] hover:bg-brand-green hover:text-white transition-all duration-300 active:scale-95"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full sm:w-[80%] md:w-[60%] mx-auto px-2 py-[clamp(0.5rem,2vw,1rem)] rounded-full bg-white/45 text-[#2E4B36] font-dm-sans text-[clamp(8px,1.5vw,21px)] tracking-[0.1em] hover:bg-brand-green hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.04L0 24l6.117-1.605a11.787 11.787 0 005.925 1.585h.005c6.64 0 12.042-5.402 12.045-12.043a11.794 11.794 0 00-3.418-8.525z" /></svg>
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
}
