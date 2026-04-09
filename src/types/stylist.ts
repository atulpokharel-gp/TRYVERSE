export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  products?: SuggestedProduct[];
}

export interface SuggestedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  reason: string;
}

export interface StyleRecommendation {
  outfitName: string;
  description: string;
  items: SuggestedProduct[];
  occasion: string;
  weather?: string;
}
