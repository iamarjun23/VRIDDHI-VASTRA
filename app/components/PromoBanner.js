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

      {/* Content */}
      <div className="relative z-10 site-container flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">

        {/* Left Text */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          {heading && (
            <h2 className="font-serif text-[clamp(20px,4vw,56px)] text-white font-medium leading-tight drop-shadow-xl">
              {heading}
            </h2>
          )}
          {subtext && (
            <p className="font-sans text-[clamp(13px,1.4vw,20px)] text-white/80 mt-3 sm:mt-4 max-w-xl leading-relaxed font-light">
              {subtext}
            </p>
          )}
          <Link
            href="/collections"
            className="mt-6 sm:mt-8 inline-flex items-center gap-3 px-[clamp(1.5rem,4vw,3rem)] py-[clamp(0.6rem,1.5vw,1rem)] border border-white/60 text-white text-[clamp(10px,1.1vw,14px)] font-bold tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-500 rounded-full backdrop-blur-sm bg-white/10"
          >
            Explore Collections
          </Link>
        </div>

        {/* Right Logo */}
        {logo && (
          <div className="shrink-0 opacity-20 hidden sm:block">
            <div className="relative w-[clamp(80px,10vw,180px)] h-[clamp(80px,10vw,180px)]">
              <Image
                src={logo}
                alt="Brand Logo"
                fill
                sizes="(max-width: 1024px) 100px, 180px"
                className="object-contain filter brightness-0 invert"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
