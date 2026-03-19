"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useCart } from "../context/CartContext"

export default function Navbar({ theme = "light", logo = "" }) {
  const isLight = theme === "light";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
        py-[clamp(0.8rem,1.5vw,1.2rem)] px-[clamp(1rem,4vw,5vw)]
        bg-white/20 backdrop-blur-md border-b border-white/10
        ${isLight ? 'text-brand-green' : 'text-white'}
      `}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 md:gap-5 group">
          {logo ? (
            <div className="rounded-full overflow-hidden border border-brand-gold/30 shadow-lg group-hover:scale-105 transition-all duration-500 w-[clamp(45px,6vw,90px)] h-[clamp(45px,6vw,90px)]">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-gold/40 bg-brand-green flex flex-col items-center justify-center shadow-xl relative shrink-0 overflow-hidden transform group-hover:rotate-3 transition-all duration-500 w-[clamp(45px,6vw,90px)] h-[clamp(45px,6vw,90px)] container-type-inline-size">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
              <span className="text-[clamp(3px,10cqi,14px)] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10 mb-0.5">
                VRIDDHI
              </span>
              <div className="w-[40%] h-[1px] bg-brand-gold/30 relative z-10 mb-0.5"></div>
              <span className="text-[clamp(3px,10cqi,14px)] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10">
                VASTRA
              </span>
            </div>
          )}
          <h1 className={`
            font-display tracking-[0.1em] md:tracking-[0.25em] transition-all duration-500 mt-1 whitespace-nowrap
            text-[clamp(14px,2.5vw,55px)] pl-3 md:pl-6
            ${isLight ? 'text-brand-green' : 'text-white'}`
          }>
            VRIDDHI VASTRA
          </h1>
        </Link>
      </div>

      <div className={`hidden lg:flex gap-[clamp(1.5rem,4vw,5rem)] font-dm-sans tracking-[0.05em] transition-all duration-500 mt-2 text-[clamp(14px,1.2vw,30px)] ${isLight ? 'text-brand-green/90' : 'text-white/90'}`}>
        <Link href="/" className="hover:text-brand-gold transition duration-300">Home</Link>
        <Link href="/tags?category=HOT+OFFERS#archive" className="hover:text-brand-gold transition duration-300">Hot Offers</Link>
        <Link href="/tags?category=BEST+SELLER#archive" className="hover:text-brand-gold transition duration-300">Best Seller</Link>
        <Link href="/contact" className="hover:text-brand-gold transition duration-300">Contact us</Link>
      </div>

      <div className={`flex gap-3 md:gap-5 items-center flex-shrink-0 mt-2 ${isLight ? 'text-brand-green' : 'text-white'}`}>
        <div
          ref={searchRef}
          className={`hidden md:flex items-center rounded-full transition-all duration-500 overflow-hidden ${isSearchOpen
            ? `px-4 py-[10px] md:py-[15px] w-[200px] md:w-[250px] border-[2px] md:border-[3px] ${isLight ? 'border-brand-green/30 bg-white/40 backdrop-blur-md' : 'border-white/40 bg-white/10 backdrop-blur-md'}`
            : `w-[32px] h-[32px] md:w-[38px] md:h-[38px] border border-transparent justify-center cursor-pointer ${isLight ? 'hover:bg-brand-green/5' : 'hover:bg-white/10 group'}`
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
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className={isSearchOpen ? "w-[35px] h-[35px] transition-all duration-300" : "w-7 h-7 transition-all duration-300"}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
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
        <button className="md:hidden">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5 hover:text-brand-gold cursor-pointer transition"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
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
      </div>

    </nav>

  )
}