# Vriddhi Vastra | Luxury Silk Saree Marketplace

A high-end e-commerce platform dedicated to exquisite South Indian silk sarees, built with performance, SEO, and visual excellence in mind.

## 🚀 Technical Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: React 19, Vanilla CSS with [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ORM
- **Authentication**: Next-Auth
- **Media Storage**: Cloudinary (via Multer)
- **Deployment Ready**: Fully configured with `force-dynamic` for real-time data and full SEO metadata support.

## 📁 Directory Structure

```bash
├── app/
│   ├── admin/                # Admin dashboard for product & site management
│   ├── api/                  # API routes (products, settings, auth)
│   ├── category/[slug]/      # Dynamic category detail pages
│   ├── collections/          # Collection overview pages
│   ├── components/           # Reusable UI components (Navbar, Footer, ProductCard)
│   ├── context/              # React Context (Cart, Auth)
│   ├── product/[serial]/     # Dynamic product detail pages
│   ├── tags/                 # Search and Archive page with filtering
│   └── globals.css           # Styling with Tailwind v4 utilities
├── lib/                      # Utility functions and DB connection
├── models/                   # Mongoose schemas (Product, SiteConfig)
└── public/                   # Static assets (images, icons)
```

## 🛠️ Key Features

### 1. Dynamic Marketplace
- **Real-time Data**: Every page is set to `force-dynamic`, ensuring that price changes, new arrivals, and inventory updates are reflected instantly without stale cache issues.
- **Dynamic SEO**: Each product and category page generates its own metadata (title, description, OG images) dynamically from the database.

### 2. Luxury UI/UX
- **Custom Typography**: Integrated curated fonts (Marcellus, Jost, DM Sans) with custom H1-H6 utilities.
- **Micro-animations**: Smooth reveals and transitions powered by Framer Motion.
- **Product Zoom**: Premium high-detail zoom functionality on product pages for inspecting saree weaves.

### 3. Smart Cart & WhatsApp Checkout
- **Local Persistence**: The cart persists in `localStorage` across sessions.
- **Direct Ordering**: Instead of a complex checkout flow, the "Buy Now" button generates a pre-formatted WhatsApp message directly to the brand owner with the product details and total price.

## ⚙️ How the Code Works

### Data Flow
1. **Server-Side Rendering**: When a user visits a page (e.g., `/product/XYZ`), Next.js calls `dbConnect()` to establish a MongoDB connection.
2. **Dynamic Data**: The page fetches the product info based on the URL parameter (`serial`).
3. **SEO Generation**: `generateMetadata` runs on the server to set the browser title and meta tags before the page reaches the client.
4. **Client-Side Interaction**: `ProductDetailClient` handles quantity changes, image switching, and zoom effects.

### Styling System
The project uses **Tailwind v4** with custom `@utility` classes defined in `globals.css`:
- `display-h1` to `display-h6` for the elegant serif headers.
- `dm-sans-h1` to `dm-sans-h6` for clean, modern sans-serif text.

## 📦 Deployment

The project is optimized for Vercel or any Node.js environment. 
- Run `npm run dev` for local development.
- Run `npm run build` to prepare for production.
