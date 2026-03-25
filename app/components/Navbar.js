"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useCart } from "../context/CartContext"

export default function Navbar({ theme = "light", logo = "" }) {
  const isLight = theme === "light";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsCartOpen, cartCount } = useCart();
  const searchRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`
        absolute top-0 left-0 w-full z-50 flex justify-between items-center transition-all duration-500 ease-in-out
        py-[clamp(0.5rem,1.2vw,1rem)] px-[clamp(0.5rem,1.5vw,2rem)]
        bg-white/20 backdrop-blur-md border-b border-white/10
        ${isLight ? 'text-brand-green' : 'text-white'}
      `}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)] group">
          {logo ? (
            <div className="rounded-full overflow-hidden border border-brand-gold/30 shadow-lg group-hover:scale-105 transition-all duration-500 w-[clamp(45px,6vw,100px)] h-[clamp(45px,6vw,100px)]">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-gold/40 bg-brand-green flex flex-col items-center justify-center shadow-xl relative shrink-0 overflow-hidden transform group-hover:rotate-3 transition-all duration-500 w-[clamp(45px,6vw,100px)] h-[clamp(45px,6vw,100px)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
              <span className="text-[clamp(6px,0.8vw,12px)] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10 mb-0.5">
                VRIDDHI
              </span>
              <div className="w-[40%] h-[1px] bg-brand-gold/30 relative z-10 mb-0.5"></div>
              <span className="text-[clamp(6px,0.8vw,12px)] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10">
                VASTRA
              </span>
            </div>
          )}
          <h1 className={`
            font-display tracking-[0.2em] md:tracking-[0.4em] transition-all duration-500 mt-1 whitespace-nowrap
            text-[clamp(14px,2.2vw,40px)] pl-1 md:pl-2
            ${isLight ? 'text-brand-green' : 'text-white'}`
          }>
            VRIDDHI VASTRA
          </h1>
        </Link>
      </div>

      <div className={`hidden lg:flex gap-[clamp(1rem,2.5vw,4rem)] dm-sans-h3 tracking-[0.05em] transition-all duration-500 mt-2 !text-[clamp(11px,1.25vw,24px)] ${isLight ? 'text-brand-green/90' : 'text-white/90'}`}>
        <Link href="/" className="hover:text-brand-gold transition duration-300 whitespace-nowrap">Home</Link>
        <Link href="/tags?category=HOT+OFFERS#archive" className="hover:text-brand-gold transition duration-300 whitespace-nowrap">Hot Offers</Link>
        <Link href="/tags?category=BEST+SELLER#archive" className="hover:text-brand-gold transition duration-300 whitespace-nowrap">Best Seller</Link>
        <Link href="/contact" className="hover:text-brand-gold transition duration-300 whitespace-nowrap">Contact us</Link>
      </div>

      <div className={`flex gap-3 md:gap-5 items-center flex-shrink-0 mt-2 ${isLight ? 'text-brand-green' : 'text-white'}`}>
        <div
          ref={searchRef}
          className={`hidden md:flex items-center rounded-full transition-all duration-500 overflow-hidden h-[clamp(36px,3vw,46px)] ${isSearchOpen
            ? `px-4 w-[clamp(180px,18vw,280px)] border-[2px] ${isLight ? 'border-brand-green/30 bg-white/40 backdrop-blur-md' : 'border-white/40 bg-white/10 backdrop-blur-md'}`
            : `w-[clamp(36px,3vw,46px)] border border-transparent justify-center cursor-pointer ${isLight ? 'hover:bg-brand-green/5' : 'hover:bg-white/10 group'}`
            }`}
          onClick={() => {
            if (!isSearchOpen) setIsSearchOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isSearchOpen) {
              const query = e.currentTarget.querySelector('input').value;
              if (query) window.location.href = `/tags?search=${encodeURIComponent(query)}`;
            }
          }}
        >
          <button
            type={isSearchOpen ? "submit" : "button"}
            className={`flex items-center justify-center transition-all duration-300 ${isSearchOpen ? 'mr-2 opacity-70 hover:opacity-100' : 'opacity-90 hover:opacity-100 hover:text-brand-gold'}`}
            onClick={(e) => {
              if (!isSearchOpen) {
                e.preventDefault();
                setIsSearchOpen(true);
              }
            }}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5 transition-all duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          </button>

          <input
            type="text"
            name="q"
            placeholder="Search..."
            className={`bg-transparent text-[13px] tracking-wide focus:outline-none placeholder:text-current placeholder:opacity-60 font-sans transition-all duration-500 ${isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0 px-0'}`}
            required={isSearchOpen}
            readOnly={!isSearchOpen}
            autoFocus={isSearchOpen}
          />
        </div>

        {/* Mobile Search Icon */}
        <button
          className="md:hidden hover:text-brand-gold"
          onClick={(e) => {
            e.preventDefault();
            setIsSearchOpen(!isSearchOpen);
            if (!isSearchOpen) setIsMobileMenuOpen(false);
          }}
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5 cursor-pointer transition"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative hover:text-brand-gold transition group p-1"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
        <button
          className="lg:hidden p-1 hover:text-brand-gold transition ml-1"
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            if (!isMobileMenuOpen) setIsSearchOpen(false);
          }}
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Search Overlay - New Section for All Device Friendliness */}
      <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-brand-green/10 shadow-xl transition-all duration-500 ease-in-out md:hidden overflow-hidden ${isSearchOpen ? 'max-h-[80px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="px-6 relative">
          <input
            type="text"
            placeholder="Search our archive..."
            className="w-full bg-brand-green/5 border border-brand-green/10 rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:border-brand-gold/40 transition-all font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const query = e.currentTarget.value;
                if (query) window.location.href = `/tags?search=${encodeURIComponent(query)}`;
              }
            }}
            autoFocus={isSearchOpen}
          />
          <button className="absolute right-10 top-1/2 -translate-y-1/2 text-brand-green/50">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-brand-green/10 shadow-2xl transition-all duration-300 ease-in-out lg:hidden origin-top z-40 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0 border-t-0'}`}>
        <div className="flex flex-col px-6 gap-4 font-dm-sans text-[16px] tracking-wide text-brand-green">
          <Link href="/" className="hover:text-brand-gold transition duration-300 border-b border-brand-green/10 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/tags?category=HOT+OFFERS#archive" className="hover:text-brand-gold transition duration-300 border-b border-brand-green/10 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Hot Offers</Link>
          <Link href="/tags?category=BEST+SELLER#archive" className="hover:text-brand-gold transition duration-300 border-b border-brand-green/10 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Best Seller</Link>
          <Link href="/contact" className="hover:text-brand-gold transition duration-300 border-b border-brand-green/10 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Contact us</Link>
          <Link href="/admin" className="hover:text-brand-gold transition duration-300 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
        </div>
      </div>

    </nav>
  )
}