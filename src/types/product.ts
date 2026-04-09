export type Category =
  | "dresses"
  | "tops"
  | "pants"
  | "jackets"
  | "shoes"
  | "accessories";

export type BodyShape =
  | "hourglass"
  | "pear"
  | "apple"
  | "rectangle"
  | "inverted-triangle";

export type Weather = "summer" | "spring" | "fall" | "winter" | "rainy";

export type Occasion =
  | "casual"
  | "work"
  | "party"
  | "date"
  | "formal"
  | "sport"
  | "beach";

export type Source =
  | "Zara"
  | "Amazon"
  | "Gucci"
  | "H&M"
  | "Temu"
  | "ASOS"
  | "Mango"
  | "Ralph Lauren";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: Category;
  imageUrl: string;
  sizes: string[];
  bodyShapes: BodyShape[];
  weatherSuitability: Weather[];
  occasions: Occasion[];
  colors: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  source: Source;
  description: string;
  fitEstimate: string;
  tags?: string[];
}

export interface FilterOptions {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  occasion?: Occasion;
  weather?: Weather;
  bodyShape?: BodyShape;
  size?: string;
  source?: Source;
}
