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
      {/* Navbar — fades in LAST at stage 4 */}
      <div className={`transition-opacity duration-700 ${stage >= 4 ? "opacity-100" : "opacity-0"}`}>
        <Navbar theme="dark" logo={logo} />
      </div>

      {/* Hero Text Content — pinned top-left, just below navbar */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-start text-left px-[clamp(1rem,4vw,5vw)] pt-[clamp(150px,20vh,300px)]">

        {/* Main Heading */}
        <h2
          className={`text-white font-display text-[clamp(24px,4vw,90px)] tracking-[0.15em] md:tracking-[0.25em] font-light mb-4 uppercase leading-[1.1] will-change-[transform,opacity] whitespace-nowrap ${tr} ${stage >= 2 ? vis : hid}`}
        >
          TIMELESS &nbsp; ELEGANCE
        </h2>

        {/* Kannada Subtext */}
        <h3
          className={`text-white Noto Serif Kannada text-[clamp(14px,3vw,60px)] tracking-[0.3em] font-light mb-14 mt-10 will-change-[transform,opacity] whitespace-nowrap ${tr} ${stage >= 2 ? vis : hid}`}
        >
          ಭಾ ರ ತೀ ಯ &nbsp;ಪ ರ ೦ ಪ ರೆ
        </h3>

        {/* CTA Buttons */}
        <div
          className={`flex flex-row gap-[clamp(0.5rem,3vw,2rem)] mt-4 items-center justify-start w-auto ${tr} ${stage >= 3 ? vis : hid}`}
        >
          <Link href="/collections" className="group w-auto flex items-center justify-center gap-[clamp(0.5rem,2vw,0.75rem)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(0.75rem,3vw,1rem)] rounded-lg border border-white/80 bg-[#D2A156]/15 backdrop-blur-sm text-white font-dm-sans text-[clamp(10px,1.5vw,16px)] tracking-[0.15em] md:tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 whitespace-nowrap">
            Shop Now
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(12px,2vw,16px)] h-[clamp(12px,2vw,16px)] group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
          </Link>
          <Link href="/collections" className="group w-auto flex items-center justify-center gap-[clamp(0.3rem,1vw,0.5rem)] px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(0.75rem,3vw,1rem)] text-white font-dm-sans text-[clamp(10px,1.5vw,16px)] tracking-[0.15em] md:tracking-[0.2em] uppercase hover:text-brand-gold transition-colors duration-300 whitespace-nowrap">
            <span className="border-b border-white/50 group-hover:border-brand-gold pb-1 transition-colors duration-300">Explore</span>
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(12px,2vw,16px)] h-[clamp(12px,2vw,16px)] group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </Link>
        </div>

      </div>
    </>
  )
}
