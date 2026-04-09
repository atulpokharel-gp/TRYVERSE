export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  gender?: "female" | "male" | "non-binary" | "prefer-not-to-say";
  stylePreferences: string[];
  bodyType?: string;
  sizeProfile: SizeProfile;
  favoriteBrands: string[];
  budgetRange: { min: number; max: number };
  occasionPreferences: string[];
  createdAt: string;
}

export interface SizeProfile {
  height?: number; // cm
  weight?: number; // kg
  chest?: number;  // cm
  waist?: number;  // cm
  hips?: number;   // cm
  inseam?: number; // cm
  topSize?: string;
  bottomSize?: string;
  shoeSize?: string;
}

export interface BodyProfile {
  shape: string;
  sizeCategory: string;
  fitSuggestions: string[];
  measurements: SizeProfile;
  avatarType: string;
  generatedAt: string;
}

export interface WardrobeItem {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  productPrice: number;
  note?: string;
  category: "wishlist" | "wardrobe" | "try-later";
  addedAt: string;
}
