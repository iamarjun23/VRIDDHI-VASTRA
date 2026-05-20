"use client";

import { useState } from "react";
import Link from "next/link"
import Image from "next/image"
import { useCart } from "../context/CartContext"

export default function Footer({ backgroundImage, logo = "", whatsappNumber: propNumber }) {
  const { whatsappNumber: contextNumber } = useCart();
  const whatsappNumber = propNumber || contextNumber;

  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const currentYear = new Date().getFullYear();
  const finalBg = backgroundImage || "";
  const instagramLink = "https://www.instagram.com/vriddhivastra.sarees?igsh=NmtkNThmM3MxZnI0";
  const displayPhone = whatsappNumber
    ? `+${whatsappNumber.replace(/^\+/, "")}`
    : "+919513399668";

  const getWhatsAppLink = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <footer className="relative w-full text-white overflow-hidden pt-[clamp(2.5rem,6vw,6rem)] pb-0 mt-auto">
      {/* Background Image & Overlay */}
      {finalBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 blur-[1px]"
          style={{ backgroundImage: `url('${finalBg}')` }}
        />
      )}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 w-full px-4 md:px-[20px]">

        {/* Mobile Accordion Redesign (md:hidden) */}
        <div className="md:hidden flex flex-col gap-6 w-full mb-6">
          {/* Logo & Title */}
          {logo && (
            <div className="flex flex-col items-center mb-2">
              <div className="flex flex-row items-center gap-3">
                <div className="relative w-10 h-10 overflow-hidden opacity-95">
                  <Image
                    src={logo}
                    alt="Vriddhi Vastra Logo"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
                <h2 className="font-dm-serif text-xl leading-tight tracking-wider text-white/95 uppercase">
                  VRIDDHI VASTRA
                </h2>
              </div>
              <p className="font-dm-sans text-xs text-white/50 max-w-[280px] text-center mt-2">
                Celebrating the art of Indian handloom sarees with contemporary designs.
              </p>
            </div>
          )}

          {/* Accordion Sections */}
          <div className="flex flex-col border-y border-white/10">
            {/* Section: Shop */}
            <div className="border-b border-white/10 last:border-none">
              <button
                onClick={() => toggleSection("shop")}
                className="w-full flex items-center justify-between py-4 text-left font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-white/95"
              >
                <span>Shop</span>
                <span className="text-brand-gold text-lg transition-transform duration-300">
                  {openSection === "shop" ? "−" : "+"}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === "shop" ? "max-h-48 pb-4" : "max-h-0"}`}>
                <ul className="flex flex-col gap-3 font-dm-sans text-sm text-white/60">
                  <li><Link href="/tags" className="hover:text-brand-gold transition-colors block">Categories</Link></li>
                  <li><Link href="/tags?category=NEW+ARRIVALS" className="hover:text-brand-gold transition-colors block">New Arrivals</Link></li>
                  <li><Link href="/tags" className="hover:text-brand-gold transition-colors block">Occasions</Link></li>
                  <li><Link href="/tags" className="hover:text-brand-gold transition-colors block">Sort by price</Link></li>
                </ul>
              </div>
            </div>

            {/* Section: Company */}
            <div className="border-b border-white/10 last:border-none">
              <button
                onClick={() => toggleSection("company")}
                className="w-full flex items-center justify-between py-4 text-left font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-white/95"
              >
                <span>Company</span>
                <span className="text-brand-gold text-lg transition-transform duration-300">
                  {openSection === "company" ? "−" : "+"}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === "company" ? "max-h-48 pb-4" : "max-h-0"}`}>
                <ul className="flex flex-col gap-3 font-dm-sans text-sm text-white/60">
                  <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors block">About us</a></li>
                  <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors block">Our Story</a></li>
                  <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors block">Artisans</a></li>
                  <li><Link href="/contact" className="hover:text-brand-gold transition-colors block">Contact</Link></li>
                </ul>
              </div>
            </div>

            {/* Section: Support */}
            <div className="border-b border-white/10 last:border-none">
              <button
                onClick={() => toggleSection("support")}
                className="w-full flex items-center justify-between py-4 text-left font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-white/95"
              >
                <span>Support</span>
                <span className="text-brand-gold text-lg transition-transform duration-300">
                  {openSection === "support" ? "−" : "+"}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === "support" ? "max-h-48 pb-4" : "max-h-0"}`}>
                <ul className="flex flex-col gap-3 font-dm-sans text-sm text-white/60">
                  <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like assistance regarding shipping information.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors block">Shipping</a></li>
                  <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to request a return for my order.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors block">Returns</a></li>
                  <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I have a few questions regarding your products and services.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors block">FAQs</a></li>
                  <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to track my order status.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors block">Track Order</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Row & Contact Details */}
          <div className="flex flex-col items-center gap-4 text-center mt-2">
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-xs font-dm-sans"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span>Follow us on Instagram</span>
            </a>

            <div className="flex flex-col gap-3 font-dm-sans text-xs text-white/70 mt-2 items-center">
              <div className="flex items-center gap-2">
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-brand-gold shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>Mansi Nagar, Mysore</span>
              </div>
              <div className="flex items-center gap-2">
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-brand-gold shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" />
                </svg>
                <span>{displayPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-brand-gold shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className="break-all">Vriddhivastrasarees@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View (hidden on mobile, flex on md+) */}
        <div className="hidden md:flex flex-row gap-x-[clamp(2rem,6vw,6rem)] items-start w-full animate-fade-in">
          
          {/* Logo Column (Far Left) */}
          {logo && (
            <Link href="/" className="shrink-0">
              <div className="relative w-[200px] h-[200px] overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                <Image
                  src={logo}
                  alt="Vriddhi Vastra Logo"
                  fill
                  sizes="200px"
                  className="object-contain"
                />
              </div>
            </Link>
          )}

          {/* Right Content Column */}
          <div className="flex flex-col gap-8 w-full">
            {/* Brand Title */}
            <h3 className="font-dm-serif text-[41px] leading-tight tracking-wider text-white/90 uppercase pt-2">
              VRIDDHI VASTRA
            </h3>

            {/* Grid for Tagline/Contact and Link Columns */}
            <div className="grid lg:grid-cols-[1fr_1.5fr] grid-cols-2 gap-y-10 gap-x-[clamp(2rem,6vw,6rem)] items-start">
              {/* Left: Tagline + Contact */}
              <div className="flex flex-col gap-4">
                <p className="font-dm-sans text-[clamp(12px,1.1vw,15px)] leading-relaxed text-white/60 max-w-[280px]">
                  Celebrating the art of Indian handloom sarees with contemporary designs.
                </p>

                <div className="flex flex-col gap-2.5 font-dm-sans text-[clamp(12px,1.1vw,15px)] text-white/60">
                  <div className="flex items-center gap-2.5">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 text-brand-gold shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span>Mansi Nagar, Mysore</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 text-brand-gold shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" />
                    </svg>
                    <span>{displayPhone}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 text-brand-gold shrink-0 mt-[2px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <span className="break-all leading-tight">Vriddhivastrasarees@gmail.com</span>
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
        </div>
      </div>

        {/* Bottom Bar */}
        <div className="mt-[clamp(2rem,4vw,3rem)] pt-5 pb-2 border-t border-white/10 flex flex-row justify-between items-center gap-2 overflow-hidden text-[clamp(8px,2vw,11px)] tracking-[0.08em] uppercase text-white/40">
          <div className="flex items-center gap-1.5 shrink-0">
            {logo && (
              <div className="w-4 h-4 relative grayscale brightness-150 opacity-60">
                <Image src={logo} alt="" fill sizes="16px" className="object-contain" />
              </div>
            )}
            <span className="font-dm-sans font-medium text-white/50 whitespace-nowrap">Vriddhi Vastra</span>
          </div>
          <span className="font-dm-sans text-right shrink-0 whitespace-nowrap">
            &copy; {currentYear} All Rights Reserved by LYPTRON
          </span>
        </div>

      </div>
    </footer>
  )
}
