"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"

export default function HeroContent({ logo = "" }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 400)
    const t2 = setTimeout(() => setStage(2), 1000)
    const t3 = setTimeout(() => setStage(3), 1600)
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

      {/* Hero Text Content */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-start text-left px-[clamp(1rem,4vw,5rem)] pt-[clamp(100px,16vw,200px)]">

        {/* Main Heading */}
        <h2
          className={`text-white font-display text-[clamp(22px,4.5vw,90px)] tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.25em] font-light mb-1 uppercase leading-[1.1] will-change-[transform,opacity] ${tr} ${stage >= 2 ? vis : hid}`}
        >
          TIMELESS &nbsp; ELEGANCE
        </h2>

        {/* Kannada Subtext */}
        <h3
          className={`text-white font-kannada text-[clamp(12px,2.5vw,60px)] tracking-[0.2em] sm:tracking-[0.3em] font-light mb-6 sm:mb-10 mt-1 xl:mt-2 will-change-[transform,opacity] ${tr} ${stage >= 2 ? vis : hid}`}
        >
          ಭಾ ರ ತೀ ಯ &nbsp;ಪ ರ ೦ ಪ ರೆ
        </h3>

        {/* CTA Buttons */}
        <div
          className={`flex flex-row gap-[clamp(0.5rem,2.5vw,2rem)] mt-2 sm:mt-4 items-center justify-start w-auto ${tr} ${stage >= 3 ? vis : hid}`}
        >
          <Link
            href="/collections"
            className="group w-auto flex items-center justify-center gap-[clamp(0.4rem,1.5vw,0.75rem)] px-[clamp(0.8rem,3vw,2.5rem)] py-[clamp(0.5rem,2vw,1rem)] rounded-lg border border-white/80 bg-[#D2A156]/15 backdrop-blur-sm text-white font-dm-sans text-[clamp(9px,1.2vw,16px)] tracking-[0.12em] sm:tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 whitespace-nowrap"
          >
            Shop Now
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.5vw,16px)] h-[clamp(10px,1.5vw,16px)] group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
          </Link>
          <Link
            href="/collections"
            className="group w-auto flex items-center justify-center gap-[clamp(0.3rem,1vw,0.5rem)] px-[clamp(0.5rem,1.5vw,1.5rem)] py-[clamp(0.5rem,2vw,1rem)] text-white font-dm-sans text-[clamp(9px,1.2vw,16px)] tracking-[0.12em] sm:tracking-[0.2em] uppercase hover:text-brand-gold transition-colors duration-300 whitespace-nowrap"
          >
            <span className="border-b border-white/50 group-hover:border-brand-gold pb-1 transition-colors duration-300">Explore</span>
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(10px,1.5vw,16px)] h-[clamp(10px,1.5vw,16px)] group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </Link>
        </div>

      </div>
    </>
  )
}
