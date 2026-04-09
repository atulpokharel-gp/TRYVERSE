# TryVerse — AI Fashion Universe

> **Scan your body. Find your style. Try before you buy.**

TryVerse is a full-stack AI-powered fashion platform that combines body scanning, virtual try-on, and personalised styling into one seamless experience. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma, and NextAuth.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Body Scan** | Upload a photo — AI maps your exact measurements in seconds |
| 👗 **Virtual Try-On** | See how any outfit looks on your body before you buy |
| 💬 **Smart Stylist** | Chat with your AI personal stylist for outfit advice |
| ☁️ **Weather Styling** | Auto outfit suggestions based on today's local weather |
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
│       └── chat/           # AI stylist chat API
├── components/             # Reusable UI components
│   ├── layout/             # Header, Footer
│   ├── ui/                 # Button, Card, Input, Badge...
│   ├── Providers.tsx       # NextAuth session provider
│   └── ProductCard.tsx     # Product display card
├── lib/
│   ├── auth.ts             # NextAuth config
│   └── db.ts               # Prisma client singleton
├── data/
│   ├── products.ts         # Mock product data
│   └── mockProducts.ts     # Extended mock data
└── types/
    ├── index.ts            # Shared TypeScript types
    └── next-auth.d.ts      # NextAuth type extensions

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Database seed script
```

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
