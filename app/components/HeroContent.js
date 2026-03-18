"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useCart } from "../context/CartContext"

export default function HeroContent({ logo = "" }) {
  const [stage, setStage] = useState(0)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef(null)
  const { setIsCartOpen, cartCount } = useCart()

  useEffect(() => {
    // Stage 1: Heading fades in — 600ms
    const t1 = setTimeout(() => setStage(1), 600)
    // Stage 2: Subtext fades in — 1400ms
    const t2 = setTimeout(() => setStage(2), 1400)
    // Stage 3: Buttons fade in — 2100ms
    const t3 = setTimeout(() => setStage(3), 2100)
    // Stage 4: Navbar fades in LAST — 2800ms
    const t4 = setTimeout(() => setStage(4), 2800)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const vis = "opacity-100 translate-y-0"
  const hid = "opacity-0 translate-y-8"
  const tr = "transition-all duration-1000 ease-out"

  return (
    <>
      {/* Staged grey tint overlay — starts dark, fades lighter once content reveals */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-[2000ms] ease-out ${stage >= 1
          ? "bg-gray-900/50 backdrop-blur-[1px]"
          : "bg-gray-900/80 backdrop-blur-[1px]"
          }`}
      />

      {/* Navbar — fades in LAST at stage 4 */}
      <nav
        className={`absolute top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-14 py-8 backdrop-blur-md bg-white/10 border-b border-white/10 transition-all duration-700 ${stage >= 4 ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-5 group">
            {logo ? (
              <div className="w-32 h-32 rounded-full overflow-hidden border border-brand-gold/30 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl border border-brand-gold/40 bg-brand-green flex flex-col items-center justify-center shadow-xl relative shrink-0 overflow-hidden transform group-hover:rotate-3 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                <span className="text-[7px] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10 mb-1">VRIDDHI</span>
                <div className="w-6 h-[1px] bg-brand-gold/30 relative z-10 mb-1" />
                <span className="text-[7px] font-display leading-none text-center text-brand-gold tracking-[0.3em] uppercase relative z-10">VASTRA</span>
                {/* Refined Decorative element */}
                <div className="absolute w-1 h-1 bg-red-600 rounded-full top-2 right-2 shadow-sm shadow-red-900/50" />
              </div>
            )}
            <h1 className="text-[50px] pl-10 md:text-[60px] mt-1 font-display tracking-[0.35em] text-white drop-shadow-xl">
              VRIDDHI VASTRA
            </h1>
          </Link>
        </div>

        <div className="hidden lg:flex gap-20 font-dm-sans tracking-[0.05em] text-[26px] mt-2 text-white/90">
          <Link href="/" className="hover:text-brand-gold transition duration-300">Home</Link>
          <Link href="/tags?category=HOT+OFFERS" className="hover:text-brand-gold transition duration-300">Hot Offers</Link>
          <Link href="/tags?category=BEST+SELLER" className="hover:text-brand-gold transition duration-300">Best Seller</Link>
          <Link href="/contact" className="hover:text-brand-gold transition duration-300">Contact us</Link>
        </div>

        <div className="flex gap-5 items-center text-white mt-2">

          {/* Expanding Search Bar */}
          <div
            ref={searchRef}
            className={`flex items-center rounded-full transition-all duration-500 overflow-hidden cursor-pointer group ${isSearchOpen
              ? "px-4 py-[15px] w-[250px] border-[3px] border-white/40 bg-white/10 backdrop-blur-md"
              : "w-[38px] h-[38px] border border-white/0 hover:border-white/30 hover:bg-white/10 justify-center"
              }`}
            onClick={() => { if (!isSearchOpen) setIsSearchOpen(true) }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isSearchOpen) {
                const query = e.currentTarget.querySelector("input")?.value
                if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`
              }
            }}
          >
            <button
              type={isSearchOpen ? "submit" : "button"}
              className={`flex items-center justify-center transition-all duration-300 ${isSearchOpen
                ? "mr-2 opacity-70 hover:opacity-100"
                : "opacity-90 hover:opacity-100 hover:text-brand-gold group-hover:scale-110"
                }`}
              onClick={(e) => {
                if (!isSearchOpen) {
                  e.preventDefault()
                  setIsSearchOpen(true)
                }
              }}
            >
              <svg
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24"
                className={`transition-all duration-300 ${isSearchOpen ? "w-[35px] h-[35px]" : "w-7 h-7"}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            <input
              type="text"
              name="q"
              placeholder="Search..."
              className={`bg-transparent text-[13px] tracking-wide text-white focus:outline-none placeholder:text-white/50 font-sans transition-all duration-500 ${isSearchOpen ? "w-full opacity-100" : "w-0 opacity-0 px-0"
                }`}
              required={isSearchOpen}
              readOnly={!isSearchOpen}
              autoFocus={isSearchOpen}
            />

            {/* Close button when open */}
            {isSearchOpen && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsSearchOpen(false) }}
                className="ml-2 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Cart */}
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-brand-gold transition-colors p-1 group">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6 group-hover:scale-110 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Text Content — pinned top-left, just below navbar */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-start text-left px-10 md:px-32 pt-[250px]">

        {/* Main Heading */}
        <h2
          className={`text-white font-display text-4xl md:text-5xl lg:text-[76px] tracking-[0.25em] md:tracking-[0.35em] font-light mb-4 uppercase leading-[1.1] ${tr} ${stage >= 1 ? vis : hid}`}
        >
          T I M E L E S S &nbsp; E L E G A N C E
        </h2>

        {/* Kannada Subtext */}
        <h3
          className={`text-white Noto Serif Kannada text-3xl md:text-4xl lg:text-[64px] tracking-[0.4em] font-light mb-14 mt-10 ${tr} ${stage >= 2 ? vis : hid}`}
        >
          ಭಾ ರ ತೀ ಯ &nbsp;ಪ ರ ೦ ಪ ರೆ
        </h3>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-8 mt-4 items-center sm:items-start ${tr} ${stage >= 3 ? vis : hid}`}
        >
          <Link href="/collections" className="group flex items-center justify-center gap-3 px-10 py-4 rounded-lg border border-white/80 bg-[#D2A156]/15 backdrop-blur-sm text-white font-dm-sans C2-[23px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500">
            Shop Now
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
          </Link>
          <Link href="/collections" className="group flex items-center justify-center gap-2 px-6 py-4 text-white font-dm-sans C2-[23px] tracking-[0.2em] uppercase hover:text-brand-gold transition-colors duration-300">
            <span className="border-b border-white/50 group-hover:border-brand-gold pb-1 transition-colors duration-300">Explore</span>
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </Link>
        </div>

      </div>
    </>
  )
}
