# TryVerse — AI Fashion Universe

> **Scan your body. Find your style. Try before you buy.**

TryVerse is a full-stack AI-powered fashion platform that combines body scanning, virtual try-on, and personalised styling into one seamless experience. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma, and NextAuth.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Body Scan | Upload photos or enter measurements to generate a body shape profile |
| 👗 Virtual Try-On | Overlay clothing on your photo with a simulated AR mirror |
| 💬 Smart Stylist | AI chat assistant for outfit advice by occasion, weather, and budget |
| ⛅ Weather Styling | Outfit suggestions tuned to today's weather and season |
| 🔍 Reverse Search | Upload a fashion photo and find similar items across Zara, Amazon, Gucci, H&M, and more |
| 🗄️ Smart Wardrobe | Save looks to Wishlist, My Wardrobe, and Try Later with notes |
| 📊 Dashboard | Body profile, AI picks, weather widget, wardrobe preview, trending looks |
| 🛍️ Shopping Feed | 22 mock products with category, occasion, and price filters |
| 🔍 **Reverse Image Search** | Upload any image, find similar items across thousands of brands |
| 🧺 **Smart Wardrobe** | Organise your clothes and discover new combinations |
| 🛍️ **Shop** | Browse 200K+ AI-curated products from top brands |
| ⚙️ **Background Jobs** | Nightly trend refresh, price updates, and restock alerts |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS variables
- **Database**: SQLite (dev) / PostgreSQL (prod) via [Prisma ORM](https://www.prisma.io/)
- **Auth**: [NextAuth.js v4](https://next-auth.js.org/) (Credentials + session)
- **State**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-org/tryverse.git
cd tryverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the required values (see [Environment Variables](#-environment-variables) below).

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Push the database schema

```bash
npx prisma db push
```

### 6. (Optional) Seed the database

```bash
npm run db:seed
```

This creates 2 test users, body profiles, 10 products, and sample wardrobe items.

**Test credentials:**
- `alex@tryverse.com` / `password123`
- `jordan@tryverse.com` / `password123`

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## �� Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | SQLite: `file:./dev.db` — PostgreSQL: full connection string |
| `NEXTAUTH_URL` | ✅ | Your app URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | ✅ | Random secret — generate with `openssl rand -base64 32` |
| `OPENAI_API_KEY` | ⬜ | Powers the real AI Stylist chat |
| `WEATHER_API_KEY` | ⬜ | OpenWeatherMap key for weather-based styling |
| `STRIPE_SECRET_KEY` | ⬜ | Stripe secret key for payment processing |
| `STRIPE_PUBLISHABLE_KEY` | ⬜ | Stripe publishable key for frontend checkout |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout + providers
│   ├── globals.css         # Global styles + Tailwind
│   ├── auth/               # Login & signup pages
│   ├── dashboard/          # User dashboard
│   ├── body-scan/          # AI body measurement page
│   ├── shop/               # Product browse + filter
│   ├── wardrobe/           # Virtual wardrobe manager
│   ├── try-on/             # Virtual try-on experience
│   ├── stylist/            # AI stylist chat
│   ├── search/             # Reverse image search
│   ├── profile/            # User profile & preferences
│   ├── onboarding/         # New user setup flow
│   ├── admin/              # Background jobs dashboard
│   └── api/                # API route handlers
│       ├── auth/           # NextAuth + signup
│       ├── products/       # Product endpoints
│       ├── wardrobe/       # Wardrobe CRUD
│       ├── body-profile/   # Body data endpoints
│       ├── chat/           # AI stylist chat API
│       ├── health/         # Health check endpoint
│       └── mobile/         # Mobile API (token-based auth)
│           ├── auth/       # Mobile login/register/logout
│           ├── profile/    # User profile CRUD
│           ├── products/   # Product browse + filter (paginated)
│           ├── wardrobe/   # Wardrobe CRUD
│           ├── body-profile/ # Body measurements
│           ├── body-scan/  # Body scan analysis
│           ├── chat/       # AI fashion chat
│           ├── stylist/    # AI stylist + product recs
│           ├── weather/    # Weather-based suggestions
│           └── reverse-search/ # Reverse image search
├── components/             # Reusable UI components
│   ├── layout/             # Header, Footer
│   ├── ui/                 # Button, Card, Input, Badge...
│   ├── Providers.tsx       # NextAuth session provider
│   └── ProductCard.tsx     # Product display card
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── db.ts               # Prisma client singleton
│   └── mobile-auth.ts      # Mobile token auth utilities
├── data/
│   ├── products.ts         # Mock product data
│   └── mockProducts.ts     # Extended mock data
└── types/
    ├── index.ts            # Shared TypeScript types
    └── next-auth.d.ts      # NextAuth type extensions

prisma/
├── schema.prisma           # Database schema (includes MobileToken model)
└── seed.ts                 # Database seed script
```

---

## 📱 Mobile API

TryVerse provides a full REST API under `/api/mobile/` designed for native mobile apps (React Native, Flutter, Swift, Kotlin, etc.). All mobile endpoints use **Bearer token** authentication instead of browser cookies.

### Authentication Flow

```
1. POST /api/mobile/auth          — Login (returns Bearer token)
   Body: { "email": "...", "password": "..." }

2. POST /api/mobile/auth          — Register
   Body: { "email": "...", "password": "...", "action": "register" }

3. DELETE /api/mobile/auth         — Logout (revokes token)
   Header: Authorization: Bearer <token>
```

### Mobile Endpoints

All authenticated endpoints require the header: `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/mobile/auth` | No | Login or register |
| DELETE | `/api/mobile/auth` | Yes | Logout (revoke token) |
| GET | `/api/mobile/profile` | Yes | Get user profile |
| PUT | `/api/mobile/profile` | Yes | Update user profile |
| GET | `/api/mobile/products?category=&q=&page=&limit=` | No | Browse products (paginated) |
| GET | `/api/mobile/wardrobe?category=` | Yes | Get wardrobe items |
| POST | `/api/mobile/wardrobe` | Yes | Add item to wardrobe |
| DELETE | `/api/mobile/wardrobe?productId=&category=` | Yes | Remove wardrobe item |
| GET | `/api/mobile/body-profile` | Yes | Get body measurements |
| POST | `/api/mobile/body-profile` | Yes | Save body measurements |
| POST | `/api/mobile/body-scan` | No | Analyze body measurements |
| POST | `/api/mobile/chat` | No | AI fashion chat |
| POST | `/api/mobile/stylist` | No | AI stylist + product recommendations |
| GET | `/api/mobile/weather?city=` | No | Weather + outfit suggestion |
| POST | `/api/mobile/reverse-search` | No | Reverse image search |
| GET | `/api/health` | No | Health check / uptime monitoring |

### Example: Mobile Login (cURL)

```bash
curl -X POST https://your-domain.com/api/mobile/auth \
  -H "Content-Type: application/json" \
  -d '{"email": "alex@tryverse.com", "password": "password123"}'
```

Response:
```json
{
  "token": "aBcDeFgH...",
  "expiresAt": "2025-02-14T00:00:00.000Z",
  "user": { "id": "...", "email": "alex@tryverse.com", "name": "Alex" }
}
```

### CORS

All `/api/*` routes include CORS headers so mobile apps and external frontends can access the API from any origin. The middleware automatically handles `OPTIONS` preflight requests.

---

## 🚀 Deployment (Vercel)

TryVerse is configured for one-click deployment on [Vercel](https://vercel.com).

### 1. Connect your repo to Vercel

Import the repository from your Vercel dashboard.

### 2. Set environment variables

In the Vercel project settings, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string (e.g. from [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app)) |
| `NEXTAUTH_URL` | Your production URL (e.g. `https://tryverse.vercel.app`) |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |

### 3. Switch to PostgreSQL (production)

Update `prisma/schema.prisma` datasource for production:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. Deploy

Vercel will automatically:
- Run `npx prisma generate` (via build command in `vercel.json`)
- Build the Next.js app
- Serve the app with all API routes live

### Health Check

Monitor your deployment at `GET /api/health` — returns server status, database connectivity, and uptime.

---

## �� Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with test data |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 🔮 Future Integrations

| Integration | Purpose |
|---|---|
| **Real AI Body Scanning** | MediaPipe / custom CV model for accurate measurements from photos |
| **AR / WebXR Try-On** | Real-time augmented reality overlay of clothing via WebXR API |
| **OpenAI GPT-4o** | Power the AI Stylist with genuine conversational intelligence |
| **OpenWeatherMap API** | Live weather data for auto location-based outfit suggestions |
| **Live Product Scraping** | Puppeteer + cheerio pipeline for real-time brand price & stock sync |
| **Stripe Payments** | In-app checkout with saved cards and Apple/Google Pay |
| **Push Notifications** | Restock alerts, price drops, and trend notifications |
| **3D Body Avatar** | Three.js avatar rendered from body measurements for try-on |

---

## 📸 Screenshots

> _Screenshots coming soon — run the app locally to see the full experience._

| Page | Description |
|---|---|
| Landing Page | Hero with features, testimonials, and CTA |
| Dashboard | Personalised feed with recommendations |
| Shop | Product grid with AI-powered filtering |
| Body Scan | Upload photo + measurement extraction UI |
| Virtual Try-On | Product overlaid on user body |
| AI Stylist | Chat interface with outfit suggestions |
| Smart Wardrobe | Categorised clothing organiser |
| Onboarding | 5-step style + body setup flow |

---

## 📄 Licence

MIT © TryVerse 2024
