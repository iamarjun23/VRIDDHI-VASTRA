"use client";

import Link from "next/link"
import Image from "next/image"
import { useCart } from "../context/CartContext"

export default function Footer({ backgroundImage, logo = "", whatsappNumber: propNumber }) {
  const { whatsappNumber: contextNumber } = useCart();
  const whatsappNumber = propNumber || contextNumber;

  const currentYear = new Date().getFullYear();
  const finalBg = backgroundImage || "";
  const instagramLink = "https://www.instagram.com/vriddhivastra.sarees?igsh=NmtkNThmM3MxZnI0";
  const displayPhone = whatsappNumber
    ? `+${whatsappNumber.replace(/^\+/, "")}`
    : "+91-9876543210";

  const getWhatsAppLink = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <footer className="relative w-full text-white overflow-hidden pt-[clamp(2.5rem,6vw,6rem)] pb-[clamp(2rem,4vw,3.5rem)] mt-auto">
      {/* Background Image & Overlay */}
      {finalBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 blur-[1px]"
          style={{ backgroundImage: `url('${finalBg}')` }}
        />
      )}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 site-container">

        {/* Main Grid — stacks on mobile, row on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-[clamp(2rem,6vw,6rem)]">

          {/* Left: Logo + Brand + Contact */}
          <div className="flex flex-row gap-4 sm:gap-6 items-start">

            {/* Logo */}
            {logo && (
              <Link href="/" className="shrink-0 mt-1">
                <div className="relative w-[clamp(44px,8vw,72px)] h-[clamp(44px,8vw,72px)] overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                  <Image
                    src={logo}
                    alt="Vriddhi Vastra Logo"
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </div>
              </Link>
            )}

            {/* Brand Content */}
            <div className="flex flex-col gap-4">
              <h2 className="font-dm-serif text-[clamp(16px,2.5vw,32px)] leading-tight tracking-wider text-white/90 uppercase">
                VRIDDHI VASTRA
              </h2>

              <p className="font-dm-sans text-[clamp(12px,1.1vw,15px)] leading-relaxed text-white/60 max-w-[280px]">
                Celebrating the art of Indian handloom sarees with contemporary designs.
              </p>

              {/* Contact Details */}
              <div className="flex flex-col gap-2.5 font-dm-sans text-[clamp(12px,1.1vw,15px)] text-white/60">
                <div className="flex items-center gap-2.5">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span>Mansi Nagar, Mysore</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" />
                  </svg>
                  <span>{displayPhone}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-[2px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span className="break-all leading-tight">Vriddhivastrasarees@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 Link Columns */}
          <div className="grid grid-cols-3 gap-x-[clamp(1rem,4vw,3rem)] gap-y-8">

            {/* Shop Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-dm-sans font-bold text-[clamp(11px,1.1vw,14px)] uppercase tracking-[0.15em] text-white/90 border-b border-brand-gold/80 pb-3 whitespace-nowrap">
                Shop
              </h4>
              <ul className="flex flex-col gap-3 font-dm-sans text-[clamp(12px,1vw,14px)] text-white/60">
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Categories</Link></li>
                <li><Link href="/tags?category=NEW+ARRIVALS" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">New Arrivals</Link></li>
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Occasions</Link></li>
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Sort by price</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-dm-sans font-bold text-[clamp(11px,1.1vw,14px)] uppercase tracking-[0.15em] text-white/90 border-b border-brand-gold/80 pb-3 whitespace-nowrap">
                Company
              </h4>
              <ul className="flex flex-col gap-3 font-dm-sans text-[clamp(12px,1vw,14px)] text-white/60">
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">About us</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Our Story</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Artisans</a></li>
                <li><Link href="/contact" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Contact</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-dm-sans font-bold text-[clamp(11px,1.1vw,14px)] uppercase tracking-[0.15em] text-white/90 border-b border-brand-gold/80 pb-3 whitespace-nowrap">
                Support
              </h4>
              <ul className="flex flex-col gap-3 font-dm-sans text-[clamp(12px,1vw,14px)] text-white/60">
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like assistance regarding shipping information.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Shipping</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to request a return for my order.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Returns</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I have a few questions regarding your products and services.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">FAQs</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to track my order status.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300 whitespace-nowrap">Track Order</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-[clamp(2rem,4vw,3rem)] pt-5 border-t border-white/10 flex flex-row justify-between items-center gap-4 flex-wrap">
          {logo && (
            <div className="flex items-center gap-2.5 opacity-25">
              <div className="w-6 h-6 relative grayscale brightness-150">
                <Image src={logo} alt="" fill sizes="24px" className="object-contain" />
              </div>
              <span className="font-dm-sans text-[11px] tracking-[0.2em] uppercase text-white">Vriddhi Vastra</span>
            </div>
          )}
          <span className="font-dm-sans text-[11px] text-white/40 tracking-[0.15em] uppercase">
            &copy; {currentYear} All Rights Reserved by LYPTRON
          </span>
        </div>

      </div>
    </footer>
  )
}
