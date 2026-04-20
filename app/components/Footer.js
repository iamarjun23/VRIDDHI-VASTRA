import Link from "next/link"

export default function Footer({ backgroundImage, logo = "" }) {
  const defaultBg = "https://images.unsplash.com/photo-1596484552834-5a58f7004dc?q=80&w=2574&auto=format&fit=crop";
  const finalBg = backgroundImage || defaultBg;

  return (
    <footer className="relative w-full text-white overflow-hidden py-12 md:py-24 px-[clamp(1rem,4vw,5vw)]">
      {/* Background Image - Only background */}
      {finalBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('${finalBg}')` }}
        />
      )}
      {/* Dark tint overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 flex flex-row flex-wrap lg:flex-nowrap gap-[clamp(2rem,5vw,5rem)] justify-between items-start w-full">

        {/* Brand & Contact Section */}
        <div className="flex flex-row gap-[clamp(1.5rem,2vw,3.5rem)] flex-[1.5] min-w-0 items-start">
          {/* Logo - Minimal */}
          <Link href="/" className="shrink-0">
            {logo ? (
              <div className="w-[clamp(40px,10vw,350px)] h-[clamp(40px,10vw,350px)] overflow-hidden">
                <img src={logo} alt="Vriddhi Vastra Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-[clamp(100px,15vw,200px)] h-[clamp(100px,15vw,200px)] flex flex-col items-center justify-center shrink-0">
                <span className="text-[clamp(14px,2vw,24px)] font-serif leading-none text-center text-brand-gold tracking-[0.2em] uppercase mb-1">
                  VRIDDHI
                </span>
                <div className="w-[clamp(3rem,3vw,8rem)] h-[0.5px] bg-brand-gold/40 mb-1"></div>
                <span className="text-[clamp(14px,2vw,24px)] font-serif leading-none text-center text-brand-gold tracking-[0.2em] uppercase">
                  VASTRA
                </span>
              </div>
            )}
          </Link>

          {/* Text Group - Right of Logo */}
          <div className="flex flex-col gap-[clamp(0.4rem,1vw,1.5rem)] pt-1 w-full min-w-0">
            <h2 className="Display H3 font-display text-[clamp(24px,5vw,55px)] leading-tight tracking-wider text-white uppercase drop-shadow-md">
              VRIDDHI VASTRA
            </h2>
            <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,2.5rem)]">
              <p className="font-dm-sans text-[clamp(14px,2vw,16px)] leading-relaxed text-white/85 max-w-xl">
                Celebrating the art of Indian handloom sarees with contemporary designs. Each piece is a testament to our artisans' skill and dedication.
              </p>

              {/* Contact Info - Below description */}
              <div className="flex flex-col gap-[clamp(0.4rem,1vw,1.5rem)] font-dm-sans text-[clamp(14px,2vw,16px)] text-white/85 tracking-wide">
                <div className="flex items-start gap-2">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(18px,3vw,1.25rem)] h-[clamp(18px,3vw,1.25rem)] shrink-0 mt-1 opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                  <p>random no. bengaluru,<br />india, pin</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(18px,3vw,1.25rem)] h-[clamp(18px,3vw,1.25rem)] shrink-0 opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" /></svg>
                  <p>+91-XXXXX-XXXXX</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[clamp(18px,3vw,1.25rem)] h-[clamp(18px,3vw,1.25rem)] shrink-0 opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  <p>hello@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Columns */}
        <div className="grid grid-cols-3 gap-[clamp(1.5rem,3vw,3rem)] flex-[1.2] xl:max-w-xl xl:self-end pt-10 lg:pt-0 min-w-0 w-full lg:w-auto">
          {/* Shop Column */}
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="font-dm-sans font-medium text-[clamp(16px,2vw,18px)] mb-2 pb-1 border-b border-brand-gold/60 inline-block w-full pr-1 text-white/90">
              Shop
            </h4>
            <ul className="flex flex-col gap-1.5 font-dm-sans text-[clamp(14px,1vw,16px)] text-white/80">
              <li><Link href="/tags" className="hover:text-brand-gold transition-colors">Categories</Link></li>
              <li><Link href="/tags?category=NEW+ARRIVALS" className="hover:text-brand-gold transition-colors">New Arrivals</Link></li>
              <li><Link href="/tags" className="hover:text-brand-gold transition-colors">Occasions</Link></li>
              <li><Link href="/tags" className="hover:text-brand-gold transition-colors">Sort by price</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="font-dm-sans font-medium text-[clamp(16px,2vw,18px)] mb-2 pb-1 border-b border-brand-gold/60 inline-block w-full pr-1 text-white/90">
              Company
            </h4>
            <ul className="flex flex-col gap-1.5 font-dm-sans text-[clamp(14px,1vw,16px)] text-white/80">
              <li><a href="#" className="hover:text-brand-gold transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Artisans</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="font-dm-sans font-medium text-[clamp(16px,2vw,18px)] mb-2 pb-1 border-b border-brand-gold/60 inline-block w-full pr-1 text-white/90">
              Support
            </h4>
            <ul className="flex flex-col gap-1.5 font-dm-sans text-[clamp(14px,1vw,16px)] text-white/80">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="relative z-10 mt-28 pt-8 border-t border-white/10 flex justify-end md:justify-end justify-center">
        <div className="flex items-center gap-2 font-dm-sans text-[clamp(12px,1vw,14px)] text-white/60 tracking-wider">
          <span className="text-[clamp(14px,1vw,18px)]">©</span>
          <p>2026 All Rights Reserved by LYPTRON</p>
        </div>
      </div>

    </footer>
  )
}
