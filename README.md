# Vriddhi Vastra

A production-grade e-commerce and operations platform for a luxury South Indian silk saree brand. Built with Next.js 16 App Router, MongoDB, and Cloudinary — designed from the ground up to feel handcrafted, premium, and operationally polished.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Animation | Framer Motion, Tailwind animate-in |
| Database | MongoDB Atlas via Mongoose |
| Media | Cloudinary |
| Email | Nodemailer (SMTP) |
| Auth | Cookie-based session (bcryptjs) |
| Deployment | Vercel / Node.js |

---

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard — Inventory, Inquiries, Settings
│   ├── api/                # API routes — Products, Settings, Auth, Analytics
│   ├── category/[slug]/    # Dynamic category pages
│   ├── collections/        # All collections overview
│   ├── components/         # Shared UI components
│   ├── contact/            # Contact & inquiry form page
│   ├── context/            # Cart context (localStorage-backed)
│   ├── login/              # Admin login portal
│   ├── product/[serial]/   # Product detail page
│   ├── search/             # Full-text product search
│   ├── tags/               # Tag-based filtered catalog
│   └── globals.css         # Tailwind v4 + custom utility classes
├── lib/
│   ├── cloudinary.js       # Cloudinary client (server-side only)
│   ├── mongodb.js          # Mongoose connection with global caching
│   └── utils.js            # WhatsApp message formatting utilities
├── models/
│   ├── Admin.js            # Admin credentials schema
│   ├── ContactSubmission.js# Inquiry/contact form submissions
│   ├── Product.js          # Product schema
│   ├── ProductClick.js     # Click analytics schema
│   └── SiteConfig.js       # CMS configuration schema
├── middleware.js            # Route protection + API rate limiting
├── next-sitemap.config.js   # Sitemap generation config
└── .env.example             # Environment variable reference
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/vriddhivastra.git
cd vriddhivastra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your MongoDB Atlas URI, Cloudinary credentials, and SMTP email. See `.env.example` for documentation on each variable.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.
The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin) — protected by cookie-based auth.

---

## Admin Portal

The admin panel lives at `/admin` and requires login via `/login`.

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — live analytics, trending products, recent inquiries |
| `/admin/products` | Inventory catalog management |
| `/admin/products/create` | Create and publish a new product |
| `/admin/products/[serial]` | Edit an existing product |
| `/admin/inquiries` | Manage and respond to client inquiries |
| `/admin/settings` | CMS — Logo, hero images, collections, lookbook, contact |

**First-time setup:** An admin document must exist in your MongoDB `admins` collection with a bcrypt-hashed password. The forgot-password flow uses SMTP to deliver OTPs.

---

## Key Features

- **Real-time storefront** — All pages use `force-dynamic` rendering; inventory updates are live.
- **Full CMS** — Admins can update the hero image, logo, lookbook, collections, and site-wide promotional banner through the Settings dashboard without touching code.
- **WhatsApp checkout** — The cart generates a pre-formatted WhatsApp message directly to the store owner, keeping the purchase flow frictionless.
- **Analytics** — Product click tracking feeds the "Top Engaging Pieces" dashboard widget.
- **SEO-first** — Dynamic metadata (`generateMetadata`) on every product and category page, structured JSON-LD, and an auto-generated sitemap.
- **Security** — Middleware-level route protection on all `/admin` and `/api` paths, plus in-memory API rate limiting (60 req/min per IP).

---

## Deployment

The project is configured for Vercel. Set all environment variables from `.env.example` in your Vercel project settings before deploying.

```bash
npm run build   # Validate production build locally
npm run start   # Run production server locally
```

The `postbuild` step automatically generates `sitemap.xml` and `robots.txt` via `next-sitemap`.
