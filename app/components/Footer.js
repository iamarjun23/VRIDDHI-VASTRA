"use client";

import Link from "next/link"
import Image from "next/image"
import { useCart } from "../context/CartContext"

export default function Footer({ backgroundImage, logo = "", whatsappNumber: propNumber }) {
  const { whatsappNumber: contextNumber } = useCart();
  const whatsappNumber = propNumber || contextNumber;
  
  const defaultBg = "https://images.unsplash.com/photo-1596484552834-5a58f7004dc?q=80&w=2574&auto=format&fit=crop";
  const finalBg = backgroundImage || defaultBg;
  const instagramLink = "https://www.instagram.com/vriddhivastra.sarees?igsh=NmtkNThmM3MxZnI0";

  const getWhatsAppLink = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <footer className="relative w-full text-white overflow-hidden pt-[clamp(1.5rem,4vw,6rem)] pb-[30px] mt-auto">
      {/* Background Image & Overlay */}
      {finalBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 blur-[1px]"
          style={{ backgroundImage: `url('${finalBg}')` }}
        />
      )}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 w-full max-w-[2000px] mx-auto px-[clamp(1rem,4vw,5rem)]">

        {/* Main Row — always horizontal, never stacking */}
        <div className="flex flex-row justify-between items-start gap-[clamp(1rem,4vw,4rem)]">

          {/* Left: Logo + Brand + Contact */}
          <div className="flex flex-row gap-[clamp(0.5rem,2vw,2rem)] items-start flex-shrink-0 max-w-[55%]">

            {/* Logo */}
            {logo && (
              <Link href="/" className="shrink-0 mt-1">
                <div className="relative w-[clamp(36px,7vw,200px)] h-[clamp(36px,7vw,200px)] overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                  <Image
                    src={logo}
                    alt="Vriddhi Vastra Logo"
                    fill
                    sizes="(max-width: 640px) 36px, (max-width: 1024px) 80px, 200px"
                    className="object-contain"
                  />
                </div>
              </Link>
            )}

            {/* Brand Content */}
            <div className="flex flex-col gap-[clamp(0.4rem,1.5vw,2rem)]">
              <h2 className="font-dm-serif text-[clamp(10px,2vw,48px)] leading-tight tracking-wider text-white/90 uppercase whitespace-nowrap">
                VRIDDHI VASTRA
              </h2>

              <p className="font-dm-sans text-[clamp(8px,1.1vw,16px)] leading-relaxed text-white/60 max-w-[280px] hidden sm:block">
                Celebrating the art of Indian handloom sarees with contemporary designs.
              </p>

              {/* Contact Details */}
              <div className="flex flex-col gap-[clamp(0.25rem,0.8vw,1rem)] font-dm-sans text-[clamp(8px,1vw,15px)] text-white/60">
                <div className="flex items-center gap-[clamp(4px,0.6vw,10px)]">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.2vw,18px)] h-[clamp(10px,1.2vw,18px)] shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="hidden xs:inline">Mansi Nagar, Mysore</span>
                  <span className="xs:hidden">Mysore, KA</span>
                </div>
                <div className="flex items-center gap-[clamp(4px,0.6vw,10px)]">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.2vw,18px)] h-[clamp(10px,1.2vw,18px)] shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" />
                  </svg>
                  <span>+91-9876543210</span>
                </div>
                <div className="flex items-start gap-[clamp(4px,0.6vw,10px)]">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.2vw,18px)] h-[clamp(10px,1.2vw,18px)] shrink-0 mt-[1px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span className="break-all leading-tight">Vriddhivastrasarees@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 Link Columns — always in a row */}
          <div className="flex flex-row gap-[clamp(1rem,3vw,4rem)] flex-shrink-0">

            {/* Shop Column */}
            <div className="flex flex-col gap-[clamp(0.5rem,1.2vw,1.5rem)]">
              <h4 className="font-dm-sans font-bold text-[clamp(9px,1.1vw,19px)] uppercase tracking-[0.15em] text-white/90 border-b border-brand-gold/80 pb-[clamp(4px,0.5vw,12px)] whitespace-nowrap">
                Shop
              </h4>
              <ul className="flex flex-col gap-[clamp(4px,0.8vw,1rem)] font-dm-sans text-[clamp(8px,1vw,16px)] text-white/60">
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Categories</Link></li>
                <li><Link href="/tags?category=NEW+ARRIVALS" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">New Arrivals</Link></li>
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Occasions</Link></li>
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Sort by price</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="flex flex-col gap-[clamp(0.5rem,1.2vw,1.5rem)]">
              <h4 className="font-dm-sans font-bold text-[clamp(9px,1.1vw,19px)] uppercase tracking-[0.15em] text-white/90 border-b border-brand-gold/80 pb-[clamp(4px,0.5vw,12px)] whitespace-nowrap">
                Company
              </h4>
              <ul className="flex flex-col gap-[clamp(4px,0.8vw,1rem)] font-dm-sans text-[clamp(8px,1vw,16px)] text-white/60">
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">About us</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Our Story</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Artisans</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Contact</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-[clamp(0.5rem,1.2vw,1.5rem)]">
              <h4 className="font-dm-sans font-bold text-[clamp(9px,1.1vw,19px)] uppercase tracking-[0.15em] text-white/90 border-b border-brand-gold/80 pb-[clamp(4px,0.5vw,12px)] whitespace-nowrap">
                Support
              </h4>
              <ul className="flex flex-col gap-[clamp(4px,0.8vw,1rem)] font-dm-sans text-[clamp(8px,1vw,16px)] text-white/60">
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like assistance regarding shipping information.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Shipping</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to request a return for my order.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Returns</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I have a few questions regarding your products and services.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">FAQs</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to track my order status.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Track Order</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-[clamp(1.5rem,3vw,3rem)] pt-[clamp(0.75rem,1.5vw,1.5rem)] border-t border-white/10 flex flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 opacity-30">
            {logo && (
              <div className="w-[clamp(20px,2.5vw,40px)] h-[clamp(20px,2.5vw,40px)] relative grayscale brightness-150">
                <Image src={logo} alt="Vriddhi Vastra Icon" fill sizes="40px" className="object-contain" />
              </div>
            )}
          </div>
          <div className="flex items-center font-dm-sans text-[clamp(8px,0.8vw,11px)] text-white/40 tracking-[0.2em] uppercase">
            <span>&copy; 2026 All Rights Reserved by LYPTRON</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
