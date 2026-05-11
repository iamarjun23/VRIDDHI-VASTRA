import Providers from "./components/Providers"
import CartSidebar from "./components/CartSidebar"
import ToastProvider from "./components/ToastProvider"
import "./globals.css"

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
  themeColor: "#103323",
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vriddhi Vastra',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com'}/images/Lotus.png`,
    description: "Exquisite Silk Sarees from South India.",
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919876543210', // Update with actual phone number if needed
      contactType: 'Customer Service'
    }
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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