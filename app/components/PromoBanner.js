import Image from "next/image"
import Link from "next/link"

export default function PromoBanner({ image, heading, subtext, logo }) {
  if (!image && !heading && !subtext) return null;

  return (
    <section className="relative w-full overflow-hidden min-h-[clamp(200px,30vw,500px)] flex items-center justify-center py-[clamp(2rem,5vw,5rem)]">
      {/* Background Image */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('${image}')` }}
        />
      )}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 site-container flex flex-col items-center justify-center text-center gap-6">
        <div className="flex flex-col items-center text-center w-full px-4">
          {heading && (
            <h2 className="font-serif text-[clamp(24px,3.5vw,40px)] first-line:text-[clamp(36px,5vw,64px)] text-white font-medium leading-snug tracking-wide drop-shadow-xl max-w-4xl mx-auto whitespace-pre-line">
              {heading}
            </h2>
          )}
          {subtext && (
            <p className="font-dm-sans text-[clamp(16px,2vw,22px)] first-line:text-[clamp(22px,2.8vw,30px)] text-white/90 mt-5 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
              {subtext}
            </p>
          )}
          <Link
            href="/collections"
            className="group mt-6 sm:mt-8 w-auto inline-flex items-center justify-center gap-[clamp(0.4rem,1.2vw,1rem)] px-[clamp(1rem,2.8vw,3rem)] py-[clamp(0.5rem,1.5vw,1.2rem)] rounded-2xl border-2 border-white bg-[#D2A156]/20 backdrop-blur-sm text-white font-dm-sans text-[clamp(12px,1.6vw,23px)] tracking-wide hover:bg-[#D2A156] transition-all duration-300 active:scale-95 whitespace-nowrap"
          >
            Explore Collections
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(12px,1.6vw,23px)] h-[clamp(12px,1.6vw,23px)] group-hover:translate-x-1.5 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
