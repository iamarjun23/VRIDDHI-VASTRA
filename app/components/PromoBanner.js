import Link from "next/link";

export default function PromoBanner({ image, heading, subtext, logo }) {
  return (
    <section className="relative w-full h-[800px] flex items-center justify-center overflow-hidden bg-[#1c1a17]">
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

        <h2 className="text-white font-display text-[45px] md:text-[65px] font-medium mb-10 leading-[1.1] drop-shadow-lg whitespace-pre-line">
          {heading ? heading.replace(/\\n/g, '\n') : "Unwrap and Unlock Timeless Elegance\nwith upto 50% Off"}
        </h2>

        <p className="text-white/95 font-sans text-xl md:text-2xl font-normal mb-12 max-w-4xl drop-shadow-md">
          {subtext || "Celebrate timeless beauty with handcrafted silk sarees at a price that feels good and looks stunning"}
        </p>

        <Link href="/collections" className="group flex items-center justify-center gap-3 px-12 py-4 rounded-xl border border-white text-white font-sans text-[17px] tracking-widest hover:bg-white hover:text-black transition-all duration-500">
          Shop Now
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
        </Link>

      </div>
    </section>
  )
}
