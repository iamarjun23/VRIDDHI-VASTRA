"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useCart } from "../context/CartContext"
import Navbar from "./Navbar"

export default function HeroContent({ logo = "" }) {
  const [stage, setStage] = useState(0)

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
      <div className={`transition-opacity duration-700 ${stage >= 4 ? "opacity-100" : "opacity-0"}`}>
        <Navbar theme="dark" logo={logo} />
      </div>

      {/* Hero Text Content — pinned top-left, just below navbar */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-start text-left px-10 md:px-32 pt-[250px]">

        {/* Main Heading */}
        <h2
          className={`text-white display-h1 text-[clamp(30px,8vw,70px)] tracking-[0.15em] md:tracking-[0.25em] font-light mb-4 uppercase leading-[1.1] ${tr} ${stage >= 1 ? vis : hid}`}
        >
          TIMELESS &nbsp; ELEGANCE
        </h2>

        {/* Kannada Subtext */}
        <h3
          className={`text-white Noto Serif Kannada text-[clamp(20px,4.5vw,48px)] tracking-[0.3em] font-light mb-14 mt-10 ${tr} ${stage >= 2 ? vis : hid}`}
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
