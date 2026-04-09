# TryVerse

> **Try Before You Buy. From Every Angle.**

TryVerse is an AI-powered fashion shopping platform that combines body-aware shopping, virtual fitting, wardrobe planning, weather-based styling, and cross-platform product discovery.

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

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/atulpokharel-gp/TRYVERSE
cd TRYVERSE

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and set NEXTAUTH_SECRET to any random string

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials
```
Email:    demo@tryverse.com
Password: demo1234
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Authentication | NextAuth.js v4 (credentials provider) |
| State | Zustand + React hooks |
| Icons | Lucide React |
| Database | In-memory (MVP) — see Future Integrations |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with Navbar + Footer
│   ├── providers.tsx            # NextAuth SessionProvider
│   ├── auth/
│   │   ├── signin/page.tsx      # Sign-in page
│   │   └── signup/page.tsx      # Sign-up page
│   ├── dashboard/page.tsx       # User dashboard
│   ├── feed/page.tsx            # Shopping feed with filters
│   ├── stylist/page.tsx         # AI stylist chat
│   ├── body-scan/page.tsx       # Body scan + measurements
│   ├── try-on/page.tsx          # Virtual try-on
│   ├── wardrobe/page.tsx        # Wardrobe / wishlist
│   ├── reverse-search/page.tsx  # Reverse image search
│   ├── profile/page.tsx         # User preferences
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth handler
│       ├── auth/register/       # User registration
│       ├── products/            # Product catalog API
│       ├── body-scan/           # Body analysis API
│       ├── stylist/chat/        # AI stylist API
│       ├── wardrobe/            # Wardrobe CRUD API
│       ├── reverse-search/      # Reverse search API
│       └── weather/             # Weather API
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   └── ProductCard.tsx
│   ├── stylist/
│   │   └── ChatMessage.tsx
│   └── body/
│       └── BodyAvatar.tsx       # SVG body shape avatar
├── data/
│   ├── products.ts              # 22 mock fashion products
│   ├── testimonials.ts          # Landing page testimonials
│   └── features.ts              # Feature highlights
├── lib/
│   ├── auth.ts                  # NextAuth config + in-memory user store
│   ├── body-analysis.ts         # Body measurements → shape/size analysis
│   ├── mock-ai.ts               # Keyword-based stylist response generator
│   ├── weather.ts               # Mock weather service
│   └── utils.ts                 # General utilities (cn, formatPrice, etc.)
└── types/
    ├── product.ts               # Product, FilterOptions types
    ├── user.ts                  # UserProfile, BodyProfile, WardrobeItem types
    └── stylist.ts               # ChatMessage, StyleRecommendation types
```

---

## 🌱 Seed Data

The app ships with **22 mock fashion products** in `src/data/products.ts` covering:
- Dresses (Wrap, Silk Slip, Bodycon, Floral Skirt)
- Tops (Button Shirt, Knit Sweater, Linen Shirt, Cashmere Turtleneck, Cardigan)
- Pants (Skinny Jeans, Wide-Leg Linen, Pleated Trousers)
- Jackets (Trench Coat, Blazer, Puffer, Leather Jacket, Rain Jacket)
- Shoes (Ankle Boots, Sneakers, Strappy Sandals)
- Accessories (Crossbody Bag, Gold Hoops)

Each product includes: size range, body shape compatibility, weather suitability, occasion tags, source platform, rating, fit estimate.

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🔮 Future Integrations

### Real AI Body Scanning
Replace the measurement-based analysis in `src/lib/body-analysis.ts`:
```typescript
// Integration point in body-analysis.ts
// POST photos to a FastAPI service wrapping MediaPipe / OpenPose / custom CV model
const response = await fetch(process.env.BODY_SCAN_API_URL, {
  method: "POST",
  body: formData, // front + side photos
});
```

### OpenAI-Powered Stylist
Replace `generateStylistResponse()` in `src/lib/mock-ai.ts`:
```typescript
// Integration point in src/app/api/stylist/chat/route.ts
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [systemPrompt, ...conversationHistory],
});
```

### Live Weather API
Replace `getMockWeather()` in `src/lib/weather.ts`:
```typescript
// Integration point in src/lib/weather.ts
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
);
```

### Real Database (Prisma + PostgreSQL)
Replace the in-memory stores:
```typescript
// src/lib/auth.ts — replace inMemoryUsers with:
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
// ...
adapter: PrismaAdapter(prisma),

// src/app/api/wardrobe/route.ts — replace wardrobeStore with:
const items = await prisma.wardrobeItem.findMany({ where: { userId } });
```

### AR/WebXR Virtual Try-On
Upgrade `src/app/try-on/page.tsx`:
```typescript
// Integration point for WebXR Body Tracking API
// or a third-party AR SDK (e.g., Snap AR, 8th Wall)
const session = await navigator.xr.requestSession("immersive-ar", {
  requiredFeatures: ["hit-test", "dom-overlay"],
});
```

### Live E-Commerce Search APIs
Replace the mock reverse search in `src/app/api/reverse-search/route.ts`:
- Google Cloud Vision API for image recognition
- SERP API / SerpAPI for Google Shopping results
- Amazon Product Advertising API
- Custom CLIP-based embedding similarity search

---

## 📊 Background Intelligence Architecture

The `RefreshCw` banner on the dashboard represents a nightly background job concept:
- **Trend refresh**: Scrape fashion trend APIs and update product tags
- **Price monitoring**: Check for price drops on saved wardrobe items
- **Restock alerts**: Notify users when out-of-stock items are back
- **Recommendation refresh**: Re-rank personalised feed based on new data

Future implementation: Next.js Cron (Vercel), BullMQ + Redis, or a separate Python microservice.

---

## ⚠️ Demo Limitations

- **Authentication**: Uses in-memory user store (resets on server restart). For production, use Prisma + PostgreSQL.
- **Wardrobe**: In-memory store per request lifecycle. For production, use a real database.
- **AI Stylist**: Keyword-matching rules. For production, integrate OpenAI GPT-4o.
- **Body Scan**: Rule-based measurement analysis. For production, use computer vision / pose estimation.
- **Virtual Try-On**: CSS overlay simulation. For production, use WebXR + body pose estimation.
- **Reverse Search**: Returns shuffled mock data. For production, use image embedding similarity search.
- **Passwords**: Stored in plain text in demo (never acceptable in production — use bcrypt/argon2).

---

## 📄 License

MIT
