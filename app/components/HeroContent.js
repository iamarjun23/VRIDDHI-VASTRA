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
          className={`text-white font-dm-serif text-[clamp(12px,4vw,90px)] tracking-[0.45em] font-light mb-[clamp(0.75rem,2.5vw,3rem)] uppercase leading-[1.1] whitespace-nowrap will-change-[transform,opacity] ${tr} ${stage >= 2 ? vis : hid}`}
        >
          TIMELESS &nbsp; ELEGANCE
        </h2>

        {/* Kannada Subtext */}
        <h3
          className={`text-white font-noto-kannada text-[clamp(12px,4vw,75px)] tracking-[0.3em] font-light mt-0 mb-[clamp(1.5rem,3.5vw,4.5rem)] whitespace-nowrap will-change-[transform,opacity] ${tr} ${stage >= 2 ? vis : hid}`}
        >
          ಭಾ ರ ತೀ ಯ &nbsp;ಪ ರ ೦ ಪ ರೆ
        </h3>

        {/* CTA Buttons */}
        <div
          className={`flex flex-row gap-[clamp(0.5rem,2vw,2rem)] mt-0 items-center justify-start w-auto ${tr} ${stage >= 3 ? vis : hid}`}
        >
          <Link
            href="/collections"
            className="group w-auto flex items-center justify-center gap-[clamp(0.4rem,1.2vw,1rem)] px-[clamp(1rem,2.8vw,3rem)] py-[clamp(0.5rem,1.5vw,1.2rem)] rounded-2xl border-2 border-white bg-[#D2A156]/20 backdrop-blur-sm text-white font-dm-sans text-[clamp(12px,1.6vw,23px)] tracking-wide hover:bg-[#D2A156] transition-all duration-300 active:scale-95 whitespace-nowrap"
          >
            Shop Now
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(12px,1.6vw,23px)] h-[clamp(12px,1.6vw,23px)] group-hover:translate-x-1.5 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
          </Link>
          <Link
            href="/collections"
            className="group w-auto flex items-center justify-center gap-[clamp(0.2rem,0.8vw,0.5rem)] px-[clamp(0.4rem,1.2vw,1.5rem)] py-[clamp(0.4rem,1.5vw,1rem)] text-white font-dm-sans text-[clamp(12px,1.6vw,23px)] tracking-wide hover:text-[#D2A156] transition-colors duration-300 whitespace-nowrap"
          >
            <span className="border-b border-white/50 group-hover:border-[#D2A156] pb-1 transition-colors duration-300">Explore</span>
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(12px,1.6vw,23px)] h-[clamp(12px,1.6vw,23px)] group-hover:translate-x-1.5 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </Link>
        </div>

      </div>
    </>
  )
}
