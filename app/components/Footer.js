import Link from "next/link"
import Image from "next/image"
 
export default function Footer({ backgroundImage, logo = "" }) {
  const defaultBg = "https://images.unsplash.com/photo-1596484552834-5a58f7004dc?q=80&w=2574&auto=format&fit=crop";
  const finalBg = backgroundImage || defaultBg;
  const whatsappNumber = "919876543210"; 
  const instagramLink = "https://www.instagram.com/vriddhivastra.sarees?igsh=NmtkNThmM3MxZnI0";
 
  const getWhatsAppLink = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
 
  return (
    <footer className="relative w-full text-white overflow-hidden pt-16 lg:pt-24 pb-4 px-[clamp(1rem,4vw,30px)] mt-auto">
      {/* Background Image & Overlay */}
      {finalBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 blur-[1px]"
          style={{ backgroundImage: `url('${finalBg}')` }}
        />
      )}
      <div className="absolute inset-0 bg-black/70 z-0" />
 
      <div className="relative z-10 w-full max-w-[2000px] mx-auto px-[clamp(0.5rem,2vw,30px)]">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-16">
          
          {/* Left Brand & Contact Section */}
          <div className="flex flex-row gap-6 md:gap-8 items-start max-w-2xl">
            {/* Logo Anchor */}
            <Link href="/" className="shrink-0 mt-2">
              <div className="relative w-24 h-24 md:w-[200px] md:h-[200px] overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                <Image src={logo} alt="Vriddhi Vastra Logo" fill sizes="200px" className="object-contain" />
              </div>
            </Link>
 
            {/* Brand Content - Aligned vertically */}
            <div className="flex flex-col gap-8">
              <h2 className="font-dm-serif text-[clamp(28px,4vw,48px)] leading-none tracking-wider text-white/90 uppercase whitespace-nowrap">
                VRIDDHI VASTRA
              </h2>
 
              <div className="flex flex-col gap-6">
                <p className="font-dm-sans text-[19px] leading-[1.6] text-white/60 max-w-[450px]">
                  Celebrating the art of Indian handloom sarees with contemporary designs. Each piece is a testament to our artisans' skill and dedication.
                </p>
 
                {/* Contact Details */}
                <div className="flex flex-col gap-4 font-dm-sans text-[16px] text-white/60 tracking-wide">
                  <div className="flex items-center gap-3">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    <span>Mansi Nagar, Mysore, Karnataka</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" /></svg>
                    <span>+91-9876543210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                    <span>Vriddhivastrasarees@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Right Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-10 lg:pt-[40px]">
            {/* Shop Column */}
            <div className="flex flex-col gap-6">
              <h4 className="font-dm-sans font-bold text-[19px] uppercase tracking-[0.2em] text-white/90 border-b border-brand-gold/80 pb-3">
                Shop
              </h4>
              <ul className="flex flex-col gap-4 font-dm-sans text-[16px] text-white/60 tracking-wide">
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300">Categories</Link></li>
                <li><Link href="/tags?category=NEW+ARRIVALS" className="hover:text-brand-gold transition-all duration-300">New Arrivals</Link></li>
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300">Occasions</Link></li>
                <li><Link href="/tags" className="hover:text-brand-gold transition-all duration-300">Sort by price</Link></li>
              </ul>
            </div>
 
            {/* Company Column */}
            <div className="flex flex-col gap-6">
              <h4 className="font-dm-sans font-bold text-[19px] uppercase tracking-[0.2em] text-white/90 border-b border-brand-gold/80 pb-3">
                Company
              </h4>
              <ul className="flex flex-col gap-4 font-dm-sans text-[16px] text-white/60 tracking-wide">
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">About us</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">Our Story</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">Artisans</a></li>
                <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">Contact</a></li>
              </ul>
            </div>
 
            {/* Support Column */}
            <div className="flex flex-col gap-6">
              <h4 className="font-dm-sans font-bold text-[19px] uppercase tracking-[0.2em] text-white/90 border-b border-brand-gold/80 pb-3">
                Support
              </h4>
              <ul className="flex flex-col gap-4 font-dm-sans text-[16px] text-white/60 tracking-wide">
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like assistance regarding shipping information.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">Shipping</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to request a return for my order.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">Returns</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I have a few questions regarding your products and services.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">FAQs</a></li>
                <li><a href={getWhatsAppLink("Hello Vriddhi Vastra, I would like to track my order status.")} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-all duration-300">Track Order</a></li>
              </ul>
            </div>
          </div>
        </div>
 
        {/* Bottom Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 opacity-30">
            <div className="w-10 h-10 relative grayscale brightness-150">
              <Image src={logo} alt="Vriddhi Vastra Icon" fill sizes="40px" className="object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-1 font-dm-sans text-[11px] text-white/40 tracking-[0.3em] uppercase">
            <span>&copy; 2026 All Rights Reserved by LYPTRON</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
