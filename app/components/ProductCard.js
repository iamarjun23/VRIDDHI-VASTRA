"use client";

import Link from "next/link"
import { useCart } from "../context/CartContext"
import { formatWhatsAppMessage, getWhatsAppUrl } from "../../lib/utils"
import StarRating from "./StarRating"
import { useState } from "react"


export default function ProductCard({ product, bgWhite = false }) {
  const { addToCart, whatsappNumber } = useCart();

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
      }
    } catch (error) {
      console.error("Rating error:", error);
    }
  };

  const handleWhatsAppBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = formatWhatsAppMessage([{ ...product, quantity: 1 }]);
    const url = getWhatsAppUrl(message, whatsappNumber);
    window.open(url, "_blank");
  };

  return (
    <div className={`group relative overflow-hidden transition-all duration-700 flex flex-col h-full rounded-[clamp(20px,4vw,40px)] ${bgWhite ? 'bg-white shadow-sm hover:shadow-md' : ''}`}>

      <div className="relative overflow-hidden aspect-[4/5] rounded-t-[clamp(20px,4vw,40px)] bg-black/[0.03]">
        <Link href={`/product/${product.serial}`} className="block h-full group/img relative">
          {product.image1 ? (
            <>
              <img
                src={product.image1}
                className="w-full h-full object-cover transform transition-all duration-1000 group-hover:scale-110 group-hover/img:opacity-0"
                alt={product.name}
              />
              {product.image2 && (
                <img
                  src={product.image2}
                  className="absolute inset-0 w-full h-full object-cover transform scale-105 opacity-0 group-hover/img:opacity-100 group-hover/img:scale-110 transition-all duration-1000"
                  alt={`${product.name} alternate view`}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 font-sans tracking-widest text-[clamp(8px,1vw,10px)] uppercase">
              No Image
            </div>
          )}
        </Link>

        {/* Hover Actions for Cart/Buy */}
        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 hidden sm:flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full py-[clamp(0.2rem,0.8vw,0.75rem)] bg-white/90 backdrop-blur-md text-black rounded-full font-sans text-[clamp(5px,0.8vw,11px)] font-bold tracking-[0.1em] uppercase hover:bg-black hover:text-white transition-all shadow-lg active:scale-95"
          >
            Add to Cart
          </button>
          <button
            onClick={handleWhatsAppBuyNow}
            className="w-full py-[clamp(0.2rem,0.8vw,0.75rem)] bg-brand-green text-white rounded-full font-sans text-[clamp(5px,0.8vw,11px)] font-bold tracking-[0.1em] uppercase hover:bg-opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-[clamp(2px,0.5vw,8px)]"
          >
            <svg className="w-[clamp(8px,1vw,14px)] h-[clamp(8px,1vw,14px)]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.04L0 24l6.117-1.605a11.787 11.787 0 005.925 1.585h.005c6.64 0 12.042-5.402 12.045-12.043a11.794 11.794 0 00-3.418-8.525z" /></svg>
            Buy Now
          </button>
        </div>
      </div>

      <div className={`p-[clamp(0.4rem,1.5vw,1.25rem)] flex flex-col items-center flex-1 ${bgWhite ? 'px-[clamp(0.5rem,1.5vw,1.5rem)] pb-[clamp(0.5rem,1.5vw,1.5rem)]' : ''}`}>
        <h2 className="text-[clamp(8px,1.2vw,22px)] font-dm-sans font-bold text-[#1A3D1C] tracking-wide truncate w-full text-center mb-1.5 group-hover:text-brand-green transition-colors">
          {product.name}
        </h2>

        <div className="flex justify-center items-baseline gap-5 font-dm-sans mb-3">
          <p className="text-[clamp(6px,1.5vw,23px)] font-bold text-[#b38b59]">
            ₹{product.price.toLocaleString()}
          </p>
          {(product.originalPrice && product.originalPrice > product.price) && (
            <p className="text-[clamp(5px,1vw,17px)] text-gray-400 line-through font-light">
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex flex-row flex-nowrap justify-between items-center w-full mt-auto pt-5 gap-x-2">
          <StarRating
            rating={currentRating}
            numReviews={numReviews}
            interactive={true}
            onRate={handleRate}
            size="clamp(8px, 1vw, 16px)"
            gap="0.1rem"
          />

          <Link
            href={`/product/${product.serial}`}
            className="flex items-center gap-[clamp(2px,0.5vw,4px)] text-[clamp(5px,0.8vw,12px)] font-medium tracking-[0.1em] text-gray-800 hover:text-brand-green transition-all uppercase underline whitespace-nowrap ml-auto"
          >
            <span>View details</span>
            <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-[clamp(6px,1vw,14px)] h-[clamp(6px,1vw,14px)]"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </div>

    </div>
  )
}
