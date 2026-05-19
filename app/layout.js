import Providers from "./components/Providers"
import CartSidebar from "./components/CartSidebar"
import ToastProvider from "./components/ToastProvider"
import dbConnect from "@/lib/mongodb"
import SiteConfig from "@/models/SiteConfig"
import "./globals.css"
import { Marcellus, Jost, DM_Sans, DM_Serif_Display, Noto_Serif, Noto_Serif_Kannada } from 'next/font/google'

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-serif',
  display: 'swap',
})

const notoSerifKannada = Noto_Serif_Kannada({
  subsets: ['kannada', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-kannada',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com'),
  title: {
    default: "Vriddhi Vastra | Luxury Silk Sarees & Authentic South Indian Weaves",
    template: "%s | Vriddhi Vastra"
  },
  description: "Explore Vriddhi Vastra's exquisite collection of South Indian Silk Sarees. Discover authentic Kanchipuram, Banarasi, and Mysore silk collections curated for elegance.",
  keywords: ["Silk Sarees", "South India", "Kanchipuram Sarees", "Banarasi Silk", "Mysore Silk", "Designer Sarees", "Luxury Fashion", "Wedding Sarees", "Bangalore saree store", "Authentic silk sarees"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Vriddhi Vastra | Luxury Silk Sarees",
    description: "Discover our curated collections of premium silk sarees. Tradition meets modern elegance.",
    url: '/',
    siteName: 'Vriddhi Vastra',
    images: [
      {
        url: '/images/og-default.jpg', // Placeholder for default OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vriddhi Vastra | Luxury Silk Sarees",
    description: "Discover our curated collections of premium silk sarees.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A3D1C",
}

export default async function RootLayout({ children }) {
  let phone = "+919000000000";
  try {
    await dbConnect();
    const config = await SiteConfig.findOne({ configId: "main" }).lean();
    if (config?.whatsappNumber) {
      phone = config.whatsappNumber.startsWith('+') ? config.whatsappNumber : `+${config.whatsappNumber}`;
    }
  } catch (err) {
    console.error("Layout failed to fetch config:", err);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vriddhi Vastra',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com'}/images/Lotus.png`,
    description: "Exquisite Silk Sarees from South India.",
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'Customer Service'
    }
  };

  return (
    <html lang="en" className={`${marcellus.variable} ${jost.variable} ${dmSans.variable} ${dmSerifDisplay.variable} ${notoSerif.variable} ${notoSerifKannada.variable}`}>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e') }}
        />
        <Providers>
          <ToastProvider />
          {children}
          <CartSidebar />
        </Providers>
      </body>
    </html>
  )
}