import Link from "next/link"

export default function Footer({ backgroundImage, logo = "" }) {
  const defaultBg = "https://images.unsplash.com/photo-1596484552834-5a58f7004dc?q=80&w=2574&auto=format&fit=crop";
  const finalBg = backgroundImage || defaultBg;

  return (
    <footer className="relative w-full text-white overflow-hidden py-24 px-[clamp(1rem,4vw,5vw)]">
      {/* Background Image - Only background */}
      {finalBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('${finalBg}')` }}
        />
      )}
      {/* Dark tint overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 flex flex-col xl:flex-row gap-16 lg:gap-20 justify-between items-start">

        {/* Brand & Contact Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 w-full xl:w-3/5 items-start">
          {/* Logo - Minimal */}
          <Link href="/" className="shrink-0">
            {logo ? (
              <div className="w-70 h-70 md:w-70 md:h-70 overflow-hidden">
                <img src={logo} alt="Vriddhi Vastra Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-50 h-50 md:w-36 md:h-36 flex flex-col items-center justify-center shrink-0">
                <span className="text-[1rem] font-serif leading-none text-center text-brand-gold tracking-[0.3em] uppercase mb-2">
                  VRIDDHI
                </span>
                <div className="w-[5rem] h-[1px] bg-brand-gold/30 mb-2"></div>
                <span className="text-[1rem] font-serif leading-none text-center text-brand-gold tracking-[0.3em] uppercase">
                  VASTRA
                </span>
              </div>
            )}
          </Link>

          {/* Text Group - Right of Logo */}
          <div className="flex flex-col gap-6 pt-4 lg:pt-8 w-full">
            <h2 className="Display H3 font-display text-[clamp(28px,4vw,55px)] leading-tight tracking-wider text-white uppercase drop-shadow-md">
              VRIDDHI VASTRA
            </h2>
            <div className="flex flex-col gap-10">
              <p className="font-dm-sans text-[clamp(14px,1.2vw,16px)] leading-relaxed text-white/85 max-w-xl">
                Celebrating the art of Indian handloom sarees with contemporary designs. Each piece is a testament to our artisans' skill and dedication.
              </p>

              {/* Contact Info - Below description */}
              <div className="flex flex-col gap-6 font-dm-sans text-[clamp(14px,1.1vw,16px)] text-white/85 tracking-wide">
                <div className="flex items-start gap-4">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[1.25rem] h-[1.25rem] shrink-0 mt-1 opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                  <p>random no. bengaluru,<br />india, pin</p>
                </div>
                <div className="flex items-center gap-4">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[1.25rem] h-[1.25rem] shrink-0 opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" /></svg>
                  <p>+91-XXXXX-XXXXX</p>
                </div>
                <div className="flex items-center gap-4">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[1.25rem] h-[1.25rem] shrink-0 opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  <p>hello@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Columns */}
        <div className="flex flex-wrap justify-between gap-12 xl:max-w-xl xl:self-end pt-12 xl:pt-0">
          {/* Shop Column */}
          <div className="flex flex-col min-w-[140px]">
            <h4 className="font-dm-sans font-medium text-[clamp(15px,1.2vw,18px)] mb-6 pb-2 border-b border-brand-gold/60 inline-block w-full pr-8 text-white/90">
              Shop
            </h4>
            <ul className="flex flex-col gap-5 font-dm-sans text-[clamp(13px,1.1vw,16px)] text-white/80">
              <li><Link href="/tags" className="hover:text-brand-gold transition-colors">Categories</Link></li>
              <li><Link href="/tags?category=NEW+ARRIVALS" className="hover:text-brand-gold transition-colors">New Arrivals</Link></li>
              <li><Link href="/tags" className="hover:text-brand-gold transition-colors">Occasions</Link></li>
              <li><Link href="/tags" className="hover:text-brand-gold transition-colors">Sort by price</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col min-w-[140px]">
            <h4 className="font-dm-sans font-medium text-[clamp(15px,1.2vw,18px)] mb-6 pb-2 border-b border-brand-gold/60 inline-block w-full pr-8 text-white/90">
              Company
            </h4>
            <ul className="flex flex-col gap-5 font-dm-sans text-[clamp(13px,1.1vw,16px)] text-white/80">
              <li><a href="#" className="hover:text-brand-gold transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Artisans</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col min-w-[140px]">
            <h4 className="font-dm-sans font-medium text-[clamp(15px,1.2vw,18px)] mb-6 pb-2 border-b border-brand-gold/60 inline-block w-full pr-8 text-white/90">
              Support
            </h4>
            <ul className="flex flex-col gap-5 font-dm-sans text-[clamp(13px,1.1vw,16px)] text-white/80">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="relative z-10 mt-28 pt-8 border-t border-white/10 flex justify-end">
        <div className="flex items-center gap-2 font-dm-sans text-[clamp(11px,1vw,14px)] text-white/60 tracking-wider">
          <span className="text-lg">©</span>
          <p>2026 All Rights Reserved by LYPTRON</p>
        </div>
      </div>

    </footer>
  )
}
