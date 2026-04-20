import Navbar from "../components/Navbar"
import PromoBanner from "../components/PromoBanner"
import Footer from "../components/Footer"
import ContactForm from "../components/ContactForm"
import dbConnect from "../../lib/mongodb"
import SiteConfig from "../../models/SiteConfig"

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Vriddhi Vastra for bespoke styling, inquiries, or assistance.",
}

export default async function Contact() {
  await dbConnect();

  // Fetch site configuration
  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) configData = {};
  const config = JSON.parse(JSON.stringify(configData));

  // Use dynamic background from config if available
  const contactBg = config.contactHeroImage || 'https://images.unsplash.com/photo-1583391733958-6488d5e16ec?q=80&w=2574&auto=format&fit=crop';

  return (
    <main className="bg-[#f3efe6] min-h-screen selection:bg-brand-green selection:text-white flex flex-col">

      {/* Navbar with light theme */}
      <div className="relative z-50">
        <Navbar theme="light" logo={config.logo} />
      </div>

      {/* Hero Contact Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] md:h-[800px] flex items-center mt-[80px] lg:mt-[140px] pt-16 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('${contactBg}')` }}
        ></div>

        {/* Grey Glass Overlay */}
        <div className="absolute inset-0 bg-[#3a403d]/10 backdrop-blur-md z-0"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Left Text Content */}
          <div className="flex flex-col w-full lg:w-1/2 text-white">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-brand-gold"></span>
              <h4 className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-brand-gold">
                CONNECT WITH US
              </h4>
            </div>

            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-8 leading-[1.1] drop-shadow-2xl">
              Elevate Your <br /><span className="italic text-brand-gold">Experience.</span>
            </h2>

            <p className="font-sans text-xl text-white/80 max-w-lg mb-14 leading-relaxed font-light">
              Whether you seek bespoke styling, inquiry on our exclusive archive, or general assistance, our curation team is dedicated to providing an unparalleled service.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 font-sans">
              <div className="flex flex-col gap-3 group cursor-pointer">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Hotline</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" /></svg>
                  </div>
                  <p className="text-lg group-hover:text-brand-gold transition-colors">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 group cursor-pointer">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Email Archive</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  </div>
                  <p className="text-lg transition-colors uppercase tracking-tight">Vriddhivastrasarees@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Container (Glassmorphism Form Component) */}
          <ContactForm />

        </div>
      </section>

      {/* Promotional Banner */}
      <PromoBanner
        image={config.promoBanner?.image}
        heading={config.promoBanner?.heading}
        subtext={config.promoBanner?.subtext}
        logo={config.logo}
      />

      {/* Footer */}
      <Footer backgroundImage={config.footerImage || config.contactHeroImage} logo={config.logo} />

    </main>
  )
}
