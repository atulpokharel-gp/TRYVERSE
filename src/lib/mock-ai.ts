import type { ChatMessage, SuggestedProduct } from "@/types/stylist";
import { mockProducts } from "@/data/products";

/**
 * Mock AI stylist response generator.
 *
 * TODO: Replace with a real OpenAI / Anthropic integration.
 * Integration point:
 *   const response = await openai.chat.completions.create({
 *     model: "gpt-4o",
 *     messages: buildSystemPrompt(userProfile) + history + [{ role:"user", content: message }],
 *   });
 */
export function generateStylistResponse(message: string): {
  content: string;
  products: SuggestedProduct[];
} {
  const lower = message.toLowerCase();

  if (lower.includes("rain") || lower.includes("wet") || lower.includes("umbrella")) {
    const products = getProductsByWeather(["rainy", "fall"], 3);
    return {
      content:
        "Rainy days call for smart layering! Here are my top picks to keep you dry and stylish: a waterproof rain jacket is a must, pair it with dark wash jeans and ankle boots. Stick to darker tones so water marks are less visible.",
      products,
    };
  }

  if (lower.includes("party") || lower.includes("club") || lower.includes("night out")) {
    const products = getProductsByOccasion("party", 3);
    return {
      content:
        "Time to turn heads! For a night out I recommend a bodycon or silk slip dress, strappy heeled sandals, and minimal gold jewellery. Keep the colour palette bold — black, red, or cobalt always work.",
      products,
    };
  }

  if (lower.includes("office") || lower.includes("work") || lower.includes("professional") || lower.includes("meeting")) {
    const products = getProductsByOccasion("work", 3);
    return {
      content:
        "For a polished office look, a tailored blazer over pleated trousers is always a winner. Add a classic white button shirt and loafers. Want something more relaxed? A midi dress with a blazer reads professional without trying too hard.",
      products,
    };
  }

  if (lower.includes("summer") || lower.includes("hot") || lower.includes("beach") || lower.includes("warm")) {
    const products = getProductsByWeather(["summer"], 3);
    return {
      content:
        "Stay cool and chic this summer! Light linen shirts and wide-leg pants are your best friends. For evenings, a floral midi skirt with a simple cami is a perfect go-to. Don't forget strappy sandals!",
      products,
    };
  }

  if (lower.includes("winter") || lower.includes("cold") || lower.includes("snow") || lower.includes("freezing")) {
    const products = getProductsByWeather(["winter"], 3);
    return {
      content:
        "Bundle up in style! A cashmere turtleneck under a tailored coat is the ultimate winter combo. Layer a chunky cardigan over jeans with ankle boots for a cosy weekend look. Invest in good knitwear — it pays off all season.",
      products,
    };
  }

  if (lower.includes("date") || lower.includes("romantic") || lower.includes("dinner")) {
    const products = getProductsByOccasion("date", 3);
    return {
      content:
        "For a romantic evening I love a silk slip dress or a wrap dress — both are feminine and flattering. Pair with heeled sandals or block heel boots. Keep accessories minimal: gold hoops and a small crossbody.",
      products,
    };
  }

  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("affordable") || lower.includes("under")) {
    const products = mockProducts
      .filter((p) => p.price < 80)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3)
      .map(toSuggestedProduct);
    return {
      content:
        "Great style doesn't require a huge budget! Here are some of my favourite affordable picks under $80 that look way more expensive than they are.",
      products,
    };
  }

  if (lower.includes("casual") || lower.includes("weekend") || lower.includes("everyday")) {
    const products = getProductsByOccasion("casual", 3);
    return {
      content:
        "For effortless everyday style I recommend building around a great pair of jeans, a classic white tee or linen shirt, and clean white sneakers. Layer with a chunky cardigan or denim jacket in cooler months.",
      products,
    };
  }

  // Default
  const products = mockProducts
    .filter((p) => p.tags?.includes("trending") || p.tags?.includes("bestseller"))
    .slice(0, 3)
    .map(toSuggestedProduct);

  return {
    content:
      "Happy to help you find the perfect outfit! Could you tell me a bit more? For example, are you dressing for a specific occasion, weather, or do you have a budget in mind? Here are some of our trending picks in the meantime.",
    products,
  };
}

function getProductsByOccasion(occasion: string, count: number): SuggestedProduct[] {
  return mockProducts
    .filter((p) => p.occasions.includes(occasion as never))
    .slice(0, count)
    .map(toSuggestedProduct);
}

function getProductsByWeather(weathers: string[], count: number): SuggestedProduct[] {
  return mockProducts
    .filter((p) => p.weatherSuitability.some((w) => weathers.includes(w)))
    .slice(0, count)
    .map(toSuggestedProduct);
}

function toSuggestedProduct(p: (typeof mockProducts)[0]): SuggestedProduct {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    imageUrl: p.imageUrl,
    reason: `Great for ${p.occasions[0]} occasions`,
  };
}

export function buildWelcomeMessage(): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm your personal AI stylist ✨ I can help you find outfits for any occasion, weather, or budget. Try asking me:\n\n• \"What should I wear for a rainy day?\"\n• \"Suggest a party outfit\"\n• \"Show me office looks under $100\"\n• \"What works for a summer beach trip?\"",
    timestamp: new Date().toISOString(),
    products: [],
  };
}
