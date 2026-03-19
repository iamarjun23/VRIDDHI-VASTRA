"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useCart } from "../context/CartContext"
import Navbar from "./Navbar"

export default function HeroContent({ logo = "" }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    // Stage 1: Overlay reveal starts — 400ms
    const t1 = setTimeout(() => setStage(1), 400)
    // Stage 2: Main Heading reveal — 1000ms
    const t2 = setTimeout(() => setStage(2), 1000)
    // Stage 3: Subtext and Buttons reveal — 1600ms
    const t3 = setTimeout(() => setStage(3), 1600)
    // Stage 4: Navbar reveal — 2200ms
    const t4 = setTimeout(() => setStage(4), 2200)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])


  const vis = "opacity-100 translate-y-0 blur-0 scale-100"
  const hid = "opacity-0 translate-y-12 blur-sm scale-95"
  const tr = "transition-all duration-[1200ms] cubic-bezier-[0.22,1,0.36,1]"

  return (
    <>
      {/* Staged grey tint overlay — starts dark, fades lighter once content reveals */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-[2000ms] ease-out ${stage >= 1
          ? "bg-gray-900/50"
          : "bg-gray-900/80"
          }`}
      />

      {/* Navbar — fades in LAST at stage 4 */}
      <div className={`transition-opacity duration-700 ${stage >= 4 ? "opacity-100" : "opacity-0"}`}>
        <Navbar theme="dark" logo={logo} />
      </div>

      {/* Hero Text Content — pinned top-left, just below navbar */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-start text-left px-10 md:px-32 pt-[clamp(150px,20vh,300px)]">

        {/* Main Heading */}
        <h2
          className={`text-white font-display text-[clamp(28px,8vw,90px)] tracking-[0.15em] md:tracking-[0.25em] font-light mb-4 uppercase leading-[1.1] will-change-[transform,opacity] ${tr} ${stage >= 2 ? vis : hid}`}
        >
          TIMELESS &nbsp; ELEGANCE
        </h2>

        {/* Kannada Subtext */}
        <h3
          className={`text-white Noto Serif Kannada text-[clamp(16px,4.5vw,60px)] tracking-[0.3em] font-light mb-14 mt-10 will-change-[transform,opacity] ${tr} ${stage >= 2 ? vis : hid}`}
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
