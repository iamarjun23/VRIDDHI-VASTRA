import Providers from "./components/Providers"
import CartSidebar from "./components/CartSidebar"
import "./globals.css"

export const metadata = {
  title: {
    default: "Vriddhi Vastra | Luxury Silk Sarees",
    template: "%s | Vriddhi Vastra"
  },
  description: "Exquisite Silk Sarees from South India. Discover Kanchipuram, Banarasi, and Mysore silk collections.",
  keywords: ["Silk Sarees", "South India", "Kanchipuram", "Banarasi", "Mysore Silk", "Luxury Fashion"],
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#103323",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <CartSidebar />
        </Providers>
      </body>
    </html>
  )
}