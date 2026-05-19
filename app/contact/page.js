import Navbar from "../components/Navbar"
import PromoBanner from "../components/PromoBanner"
import Footer from "../components/Footer"
import ContactForm from "../components/ContactForm"
import dbConnect from "../../lib/mongodb"
import SiteConfig from "../../models/SiteConfig"
import { sanitizeMongoose } from "../../lib/utils"

export const revalidate = 3600;

export const metadata = {
  title: "Contact Us | Vriddhi Vastra",
  description: "Get in touch with Vriddhi Vastra for inquiries about our premium silk sarees.",
  openGraph: {
    title: "Contact Us | Vriddhi Vastra",
    description: "Get in touch with Vriddhi Vastra for inquiries about our premium silk sarees.",
    url: "https://www.vriddhivastra.com/contact",
    siteName: "Vriddhi Vastra",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  }
}

export default async function Contact() {
  await dbConnect();

  let configData = await SiteConfig.findOne({ configId: "main" }).lean();
  if (!configData) configData = {};
  const config = sanitizeMongoose(configData);

  const contactBg = config.contactHeroImage || 'https://images.unsplash.com/photo-1583391733958-6488d5e16ec?q=80&w=2574&auto=format&fit=crop';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us | Vriddhi Vastra',
    description: 'Get in touch with Vriddhi Vastra for inquiries about our premium silk sarees.',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Vriddhi Vastra',
      telephone: config.whatsappNumber || '+91-9876543210',
      email: 'Vriddhivastrasarees@gmail.com',
      url: 'https://www.vriddhivastra.com'
    }
  };

  return (
    <main className="bg-[#f3efe6] min-h-screen selection:bg-brand-green selection:text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar theme="light" logo={config.logo} bgColor="#F1E8CD" />
      </div>

      {/* Hero Contact Section */}
      <section className="relative w-full min-h-screen flex items-center pt-[clamp(80px,12vw,140px)] pb-[clamp(3rem,6vw,5rem)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('${contactBg}')` }}
        ></div>

        <div className="absolute inset-0 bg-[#3a403d]/10 backdrop-blur-[2px] z-0"></div>

        <div className="relative z-10 site-container flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

          {/* Left Text Content */}
          <div className="flex flex-col w-full lg:w-1/2 text-white">
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <span className="w-12 h-[1px] bg-brand-gold"></span>
              <h4 className="font-sans text-[clamp(9px,1vw,11px)] font-bold tracking-[0.3em] uppercase text-brand-gold">
                CONNECT WITH US
              </h4>
            </div>

            <h2 className="font-serif text-[clamp(2rem,6vw,5.5rem)] font-medium mb-6 sm:mb-8 leading-[1.1] drop-shadow-2xl">
              Elevate Your <br /><span className="italic text-brand-gold">Experience.</span>
            </h2>

            <p className="font-sans text-[clamp(14px,1.4vw,21px)] text-white/80 max-w-lg mb-8 sm:mb-14 leading-relaxed font-light">
              Whether you seek bespoke styling, inquiry on our exclusive archive, or general assistance, our curation team is dedicated to providing an unparalleled service.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 font-sans">
              <div className="flex flex-col gap-3 group cursor-pointer">
                <p className="text-[clamp(9px,0.9vw,10px)] font-bold tracking-[0.2em] text-white/50 uppercase">Hotline</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.13-1.31.54l-1.93 2.41a15.157 15.157 0 0 1-5.748-5.748l2.409-1.93c.41-.326.618-.82.54-1.311l-.54-3.413a1.125 1.125 0 0 0-1.048-.864H4.5a2.25 2.25 0 0 0-2.25 2.25Z" /></svg>
                  </div>
                  <p className="text-[clamp(14px,1.3vw,18px)] group-hover:text-brand-gold transition-colors">+91-9876543210</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 group cursor-pointer">
                <p className="text-[clamp(9px,0.9vw,10px)] font-bold tracking-[0.2em] text-white/50 uppercase">Email Archive</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  </div>
                  <p className="text-[clamp(12px,1.1vw,18px)] transition-colors lowercase tracking-tight break-all">Vriddhivastrasarees@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
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
