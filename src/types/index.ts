export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  gender?: string | null
  stylePreference?: string | null
  bodyType?: string | null
  sizeCategory?: string | null
  favoriteBrands?: string[]
  budgetMin?: number | null
  budgetMax?: number | null
  occasionPreferences?: string[]
}

export interface BodyProfile {
  id: string
  userId: string
  height?: number | null
  weight?: number | null
  chest?: number | null
  waist?: number | null
  hips?: number | null
  shoulders?: number | null
  bodyShape?: string | null
  sizeCategory?: string | null
  fitNotes?: string | null
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number | null
  image: string
  category: string
  tags?: string[]
  bodyShapeCompatibility?: string[]
  weatherSuitability?: string[]
  occasions?: string[]
  sizes?: string[]
  colors?: string[]
  source?: string | null
  rating?: number | null
  reviewCount?: number | null
  isNew: boolean
  isTrending: boolean
}

export interface WardrobeItem {
  id: string
  userId: string
  productId: string
  notes?: string | null
  addedAt: Date
  category: 'wishlist' | 'wardrobe' | 'tryLater'
  product?: Product
}

export interface ChatMessage {
  id: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface RecentSearch {
  id: string
  userId: string
  query: string
  imageUrl?: string | null
  createdAt: Date
}

export type BodyShape = 'hourglass' | 'pear' | 'apple' | 'rectangle' | 'inverted-triangle'

export type StylePreference = 
  | 'casual'
  | 'formal'
  | 'streetwear'
  | 'bohemian'
  | 'minimalist'
  | 'maximalist'
  | 'athleisure'
  | 'vintage'
  | 'preppy'
  | 'romantic'

export type Occasion =
  | 'work'
  | 'casual'
  | 'formal'
  | 'party'
  | 'wedding'
  | 'beach'
  | 'outdoor'
  | 'date'
  | 'sport'

export type SizeCategory = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
