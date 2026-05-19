"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import { useCart } from "../context/CartContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// E.164 phone verification helper
function validateAndFormatE164(phone) {
  if (!phone) return null;
  // Strip spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // Regex for E.164 (optional leading plus, followed by 7 to 15 digits)
  const e164Regex = /^\+?[1-9]\d{6,14}$/;
  if (!e164Regex.test(cleaned)) {
    return null;
  }
  // For wa.me, we want the number without the leading plus
  return cleaned.replace("+", "");
}

function NavbarContent({ theme = "light", logo = "", bgColor = "" }) {
  const isLight = theme === "light";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsCartOpen, cartCount, whatsappNumber } = useCart();
  const navRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Setup social links dynamically using the WhatsApp number from our Cart Context
  const cleanPhone = validateAndFormatE164(whatsappNumber) || "919000000000";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Vriddhi Vastra, I would like to inquire about your collections.")}`;
  const instagramUrl = "https://www.instagram.com/vriddhivastra.sarees?igsh=NmtkNThmM3MxZnI0";

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine active route states
  const isHomeActive = pathname === "/";
  const isHotOffersActive = pathname === "/tags" && searchParams.get("category") === "HOT OFFERS";
  const isBestSellerActive = pathname === "/tags" && searchParams.get("category") === "BEST SELLER";
  const isContactActive = pathname === "/contact";

  // Handle SPA search navigation
  const handleSearchSubmit = (value) => {
    if (!value) return;
    router.push(`/tags?search=${encodeURIComponent(value)}`);
    setIsSearchOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`
        absolute top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out
        ${bgColor ? 'backdrop-blur-[2px]' : 'bg-white/10 backdrop-blur-xl'}
        border-b border-white/10
        ${isLight ? 'text-brand-green' : 'text-white'}
      `}
      style={bgColor ? { backgroundColor: bgColor } : {}}
    >
      <div className="site-container w-full flex justify-between lg:grid lg:grid-cols-[auto_1fr_auto] items-center py-3 lg:py-4">

        {/* ── LEFT: Logo + Brand Name ── */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            {logo ? (
              <div className="relative rounded-full overflow-hidden border border-brand-gold/30 shadow-lg group-hover:scale-105 transition-all duration-500 w-10 h-10 lg:w-[50px] lg:h-[50px] shrink-0">
                <Image
                  src={logo}
                  alt="Vriddhi Vastra Logo"
                  fill
                  sizes="(max-width: 640px) 40px, 50px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="rounded-xl border border-brand-gold/40 bg-brand-green flex flex-col items-center justify-center shadow-xl relative shrink-0 overflow-hidden transform group-hover:rotate-3 transition-all duration-500 w-10 h-10 lg:w-[50px] lg:h-[50px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                <span className="text-[5px] lg:text-[7px] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10 mb-0.5">
                  VRIDDHI
                </span>
                <div className="w-[40%] h-[1px] bg-brand-gold/30 relative z-10 mb-0.5" />
                <span className="text-[5px] lg:text-[7px] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10">
                  VASTRA
                </span>
              </div>
            )}

            <span className={`
              font-marcellus tracking-[0.25em] leading-none
              transition-all duration-500 whitespace-nowrap
              text-[15px] sm:text-[18px] lg:text-[26px] xl:text-[36px] 2xl:text-[50px]
              ${isLight ? 'text-brand-green' : 'text-white'}
            `}>
              VRIDDHI VASTRA
            </span>
          </Link>
        </div>

        {/* ── CENTER: Nav Links (Desktop >= 1024px lg only) ── */}
        <div className={`
          hidden lg:flex items-center justify-center
          gap-6 lg:gap-8 xl:gap-10
          tracking-[0.15em] uppercase font-medium font-jost
          text-[13px] lg:text-[14px]
          transition-opacity duration-300
          ${isLight ? 'text-brand-green/80' : 'text-white/80'}
        `}>
          <Link 
            href="/" 
            className={`relative py-1 hover:text-brand-gold transition-colors duration-300 whitespace-nowrap group/link ${isHomeActive ? 'text-brand-gold font-semibold' : ''}`}
            aria-current={isHomeActive ? "page" : undefined}
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover/link:w-full"></span>
          </Link>
          <Link 
            href="/tags?category=HOT+OFFERS#archive" 
            className={`relative py-1 hover:text-brand-gold transition-colors duration-300 whitespace-nowrap group/link ${isHotOffersActive ? 'text-brand-gold font-semibold' : ''}`}
            aria-current={isHotOffersActive ? "page" : undefined}
          >
            Hot Offers
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover/link:w-full"></span>
          </Link>
          <Link 
            href="/tags?category=BEST+SELLER#archive" 
            className={`relative py-1 hover:text-brand-gold transition-colors duration-300 whitespace-nowrap group/link ${isBestSellerActive ? 'text-brand-gold font-semibold' : ''}`}
            aria-current={isBestSellerActive ? "page" : undefined}
          >
            Best Seller
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover/link:w-full"></span>
          </Link>
          <Link 
            href="/contact" 
            className={`relative py-1 hover:text-brand-gold transition-colors duration-300 whitespace-nowrap group/link ${isContactActive ? 'text-brand-gold font-semibold' : ''}`}
            aria-current={isContactActive ? "page" : undefined}
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 group-hover/link:w-full"></span>
          </Link>
        </div>

        {/* ── RIGHT: Search Pill + Cart + Mobile Toggle ── */}
        <div className="flex items-center gap-4 lg:gap-6 justify-end shrink-0">

          {/* Desktop Search: Static Pill (Always visible on >= 1024px lg) */}
          <div className={`
            hidden lg:flex items-center rounded-full border h-[36px] w-[180px] xl:w-[220px] transition-all px-3.5 relative
            ${isLight 
              ? 'border-brand-green/25 bg-brand-green/5 text-brand-green focus-within:border-brand-gold/60 focus-within:bg-white' 
              : 'border-white/25 bg-white/10 text-white focus-within:border-brand-gold/60 focus-within:bg-black/40'}
          `}>
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-[15px] h-[15px] shrink-0 opacity-70">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search our archive..."
              className="bg-transparent text-[13px] tracking-wide focus:outline-none placeholder:text-current placeholder:opacity-50 font-dm-sans w-full pl-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(e.currentTarget.value);
              }}
            />
          </div>

          {/* Mobile Search Icon (< 1024px lg) */}
          <button
            className="lg:hidden hover:text-brand-gold transition-colors p-1"
            onClick={() => { setIsSearchOpen(!isSearchOpen); if (!isSearchOpen) setIsMobileMenuOpen(false); }}
            aria-label="Search"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-[20px] h-[20px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>

          {/* Cart Bag Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-brand-gold transition-colors group p-1"
            aria-label="Open cart"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-[22px] h-[22px] lg:w-[24px] lg:h-[24px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className={`
              absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3 shadow-md
              transition-all duration-300
              ${cartCount > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
            `}>
              {cartCount}
            </span>
          </button>

          {/* Hamburger Menu Toggle (< 1024px lg) */}
          <button
            className="lg:hidden hover:text-brand-gold transition-colors p-1"
            onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsSearchOpen(false); }}
            aria-label="Toggle menu"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
              {isMobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown (< 1024px lg) */}
      <div className={`
        absolute top-full left-0 w-full border-t transition-all duration-300 ease-in-out lg:hidden overflow-hidden z-40
        ${isLight 
          ? 'bg-white/95 backdrop-blur-xl border-brand-green/10 text-brand-green shadow-xl' 
          : 'bg-neutral-950/95 backdrop-blur-xl border-white/10 text-white shadow-xl'}
        ${isSearchOpen ? 'max-h-[80px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0 border-t-0'}
      `}>
        <div className="site-container">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search our archive..."
              className={`w-full border rounded-full py-2.5 px-5 pr-11 text-sm focus:outline-none focus:border-brand-gold/50 transition-all font-dm-sans
                ${isLight 
                  ? 'bg-brand-green/5 border-brand-green/10 text-brand-green placeholder:text-brand-green/45' 
                  : 'bg-white/5 border-white/10 text-white placeholder:text-white/45'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(e.currentTarget.value);
              }}
              autoFocus={isSearchOpen}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 hover:text-brand-gold transition-colors"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling;
                if (input?.value) handleSearchSubmit(input.value);
              }}
              aria-label="Submit search"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Hamburger Menu (< 1024px lg) */}
      <div className={`
        absolute top-full left-0 w-full border-t transition-all duration-300 ease-in-out lg:hidden origin-top z-40 overflow-hidden
        ${isLight 
          ? 'bg-white/95 backdrop-blur-xl border-brand-green/10 text-brand-green shadow-2xl' 
          : 'bg-neutral-950/95 backdrop-blur-xl border-white/10 text-white shadow-2xl'}
        ${isMobileMenuOpen ? 'max-h-[460px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0 border-t-0'}
      `}>
        <div className="site-container flex flex-col gap-6 font-jost text-[15px] tracking-wider font-medium">
          <Link 
            href="/" 
            className={`hover:text-brand-gold transition-colors duration-300 border-b border-current/10 pb-3 ${isHomeActive ? 'text-brand-gold font-semibold' : ''}`} 
            aria-current={isHomeActive ? "page" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/tags?category=HOT+OFFERS#archive" 
            className={`hover:text-brand-gold transition-colors duration-300 border-b border-current/10 pb-3 ${isHotOffersActive ? 'text-brand-gold font-semibold' : ''}`} 
            aria-current={isHotOffersActive ? "page" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Hot Offers
          </Link>
          <Link 
            href="/tags?category=BEST+SELLER#archive" 
            className={`hover:text-brand-gold transition-colors duration-300 border-b border-current/10 pb-3 ${isBestSellerActive ? 'text-brand-gold font-semibold' : ''}`} 
            aria-current={isBestSellerActive ? "page" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Best Seller
          </Link>
          <Link 
            href="/contact" 
            className={`hover:text-brand-gold transition-colors duration-300 border-b border-current/10 pb-3 ${isContactActive ? 'text-brand-gold font-semibold' : ''}`} 
            aria-current={isContactActive ? "page" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
          
          {/* Social and Contact Links at the bottom of Mobile Menu */}
          <div className="flex flex-row items-center justify-between pt-2">
            <Link href="/admin" className="hover:text-brand-gold transition-colors duration-300 text-current/50 text-[12px] uppercase tracking-widest font-sans" onClick={() => setIsMobileMenuOpen(false)}>
              Admin Console
            </Link>
            
            <div className="flex items-center gap-4">
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#E1306C] transition-colors p-1" 
                aria-label="Instagram"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-[20px] h-[20px]">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#25D366] transition-colors p-1" 
                aria-label="WhatsApp"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-[20px] h-[20px]">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.4 4.8 1.4 5.3 0 9.7-4.3 9.7-9.7 0-2.6-1-5-2.8-6.8-1.8-1.8-4.2-2.8-6.8-2.8-5.3 0-9.7 4.3-9.7 9.7 0 1.8.5 3.5 1.4 5l-.4 1.6 1.8-.4zM16.9 13.9c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C9.7 8.9 9 7.2 8.7 6.5c-.3-.7-.6-.6-.8-.6-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1-.2 0-.4-.1-.6-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Navbar(props) {
  return (
    <Suspense fallback={<div className="h-16 bg-transparent" />}>
      <NavbarContent {...props} />
    </Suspense>
  );
}
