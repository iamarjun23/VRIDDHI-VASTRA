import Link from "next/link";

export default function PromoBanner({ image, heading, subtext, logo }) {
  return (
    <section className="relative w-full min-h-[30vh] md:min-h-[60vh] lg:min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-[#1c1a17] py-12 md:py-0">
      {image && (
        <img
          src={image}
          alt="Promo Background"
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
        />
      )}

      {/* Corner logo banner overlay - behind the tint */}
      {logo && (
        <div className="absolute right-10 bottom-10 z-0 hidden md:flex">
          <img
            src={logo}
            alt="Vriddhi Vastra Logo"
            className="w-48 h-auto object-contain brightness-[1.1] contrast-[1.1]"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gray-900/65 z-10" />

      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-7xl">

        <h2 className="text-white font-display text-[clamp(18px,6vw,65px)] font-medium mb-[clamp(0.5rem,2vw,2.5rem)] leading-[1.1] drop-shadow-lg whitespace-pre-line">
          {heading ? heading.replace(/\\n/g, '\n') : "Unwrap and Unlock Timeless Elegance\nwith upto 50% Off"}
        </h2>

        <p className="text-white/95 font-sans text-[clamp(10px,2vw,24px)] font-normal mb-[clamp(1rem,3vw,3rem)] max-w-4xl drop-shadow-md">
          {subtext || "Celebrate timeless beauty with handcrafted silk sarees at a price that feels good and looks stunning"}
        </p>

        <Link href="/collections" className="group flex items-center justify-center gap-2 px-[clamp(2rem,5vw,3rem)] py-[clamp(0.5rem,2vw,1rem)] rounded-xl border border-white text-white font-sans text-[clamp(12px,2vw,17px)] tracking-widest hover:bg-white hover:text-black transition-all duration-500">
          Shop Now
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-[clamp(14px,2vw,20px)] h-[clamp(14px,2vw,20px)] group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
        </Link>

      </div>
    </section>
  )
}
