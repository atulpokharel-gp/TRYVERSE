import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const seedProducts = [
  {
    id: 'dress-001',
    name: 'Midnight Cocktail Dress',
    brand: 'Zara',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://picsum.photos/seed/dress001/600/800',
    category: 'dresses',
    tags: JSON.stringify(['cocktail', 'evening', 'bodycon']),
    bodyShapeCompatibility: JSON.stringify(['hourglass', 'rectangle', 'inverted-triangle']),
    weatherSuitability: JSON.stringify(['mild', 'indoor']),
    occasions: JSON.stringify(['party', 'date', 'formal']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['black', 'navy', 'burgundy']),
    source: 'Zara',
    rating: 4.6,
    reviewCount: 312,
    isNew: false,
    isTrending: true,
  },
  {
    id: 'dress-002',
    name: 'Floral Wrap Casual Dress',
    brand: 'H&M',
    price: 49.99,
    originalPrice: 59.99,
    image: 'https://picsum.photos/seed/dress002/600/800',
    category: 'dresses',
    tags: JSON.stringify(['casual', 'wrap', 'floral']),
    bodyShapeCompatibility: JSON.stringify(['hourglass', 'pear', 'apple', 'rectangle']),
    weatherSuitability: JSON.stringify(['warm', 'mild']),
    occasions: JSON.stringify(['casual', 'date', 'outdoor']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['floral-pink', 'floral-blue', 'floral-green']),
    source: 'H&M',
    rating: 4.3,
    reviewCount: 548,
    isNew: true,
    isTrending: false,
  },
  {
    id: 'dress-003',
    name: 'Linen Slip Summer Dress',
    brand: 'ASOS',
    price: 62.0,
    originalPrice: null,
    image: 'https://picsum.photos/seed/dress003/600/800',
    category: 'dresses',
    tags: JSON.stringify(['summer', 'slip', 'linen', 'minimalist']),
    bodyShapeCompatibility: JSON.stringify(['rectangle', 'inverted-triangle', 'hourglass']),
    weatherSuitability: JSON.stringify(['hot', 'warm']),
    occasions: JSON.stringify(['casual', 'beach', 'outdoor']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
    colors: JSON.stringify(['ivory', 'sand', 'sage']),
    source: 'ASOS',
    rating: 4.5,
    reviewCount: 204,
    isNew: true,
    isTrending: true,
  },
  {
    id: 'top-001',
    name: 'Silk Button Blouse',
    brand: 'Massimo Dutti',
    price: 95.0,
    originalPrice: null,
    image: 'https://picsum.photos/seed/top001/600/800',
    category: 'tops',
    tags: JSON.stringify(['blouse', 'silk', 'elegant']),
    bodyShapeCompatibility: JSON.stringify(['hourglass', 'pear', 'rectangle', 'inverted-triangle']),
    weatherSuitability: JSON.stringify(['mild', 'indoor']),
    occasions: JSON.stringify(['work', 'formal', 'date']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['white', 'champagne', 'blush']),
    source: 'Massimo Dutti',
    rating: 4.8,
    reviewCount: 176,
    isNew: false,
    isTrending: false,
  },
  {
    id: 'top-002',
    name: 'Ribbed Crop Top',
    brand: 'Nike',
    price: 35.0,
    originalPrice: 45.0,
    image: 'https://picsum.photos/seed/top002/600/800',
    category: 'tops',
    tags: JSON.stringify(['crop top', 'ribbed', 'athleisure']),
    bodyShapeCompatibility: JSON.stringify(['hourglass', 'inverted-triangle', 'rectangle']),
    weatherSuitability: JSON.stringify(['warm', 'indoor']),
    occasions: JSON.stringify(['casual', 'sport']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['black', 'white', 'coral', 'sage']),
    source: 'Nike',
    rating: 4.4,
    reviewCount: 621,
    isNew: true,
    isTrending: true,
  },
  {
    id: 'top-003',
    name: 'Cashmere Turtleneck',
    brand: 'COS',
    price: 119.0,
    originalPrice: null,
    image: 'https://picsum.photos/seed/top003/600/800',
    category: 'tops',
    tags: JSON.stringify(['turtleneck', 'cashmere', 'minimalist']),
    bodyShapeCompatibility: JSON.stringify(['rectangle', 'inverted-triangle', 'hourglass', 'pear']),
    weatherSuitability: JSON.stringify(['cold', 'mild']),
    occasions: JSON.stringify(['work', 'casual', 'formal']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['camel', 'ivory', 'charcoal', 'black']),
    source: 'COS',
    rating: 4.9,
    reviewCount: 243,
    isNew: false,
    isTrending: false,
  },
  {
    id: 'pants-001',
    name: 'High-Rise Skinny Jeans',
    brand: "Levi's",
    price: 98.0,
    originalPrice: null,
    image: 'https://picsum.photos/seed/pants001/600/800',
    category: 'pants',
    tags: JSON.stringify(['jeans', 'skinny', 'high-rise', 'denim']),
    bodyShapeCompatibility: JSON.stringify(['hourglass', 'pear', 'rectangle']),
    weatherSuitability: JSON.stringify(['mild', 'cold', 'warm']),
    occasions: JSON.stringify(['casual', 'work', 'date']),
    sizes: JSON.stringify(['24', '25', '26', '27', '28', '29', '30', '31', '32']),
    colors: JSON.stringify(['mid-blue', 'dark-blue', 'black']),
    source: "Levi's",
    rating: 4.6,
    reviewCount: 1243,
    isNew: false,
    isTrending: false,
  },
  {
    id: 'pants-002',
    name: 'Tailored Wide-Leg Trousers',
    brand: 'Zara',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://picsum.photos/seed/pants002/600/800',
    category: 'pants',
    tags: JSON.stringify(['trousers', 'wide-leg', 'tailored', 'formal']),
    bodyShapeCompatibility: JSON.stringify(['pear', 'hourglass', 'apple']),
    weatherSuitability: JSON.stringify(['mild', 'cold', 'indoor']),
    occasions: JSON.stringify(['work', 'formal', 'date']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['camel', 'black', 'cream']),
    source: 'Zara',
    rating: 4.5,
    reviewCount: 387,
    isNew: false,
    isTrending: true,
  },
  {
    id: 'jacket-001',
    name: 'Leather Biker Jacket',
    brand: 'AllSaints',
    price: 295.0,
    originalPrice: 350.0,
    image: 'https://picsum.photos/seed/jacket001/600/800',
    category: 'jackets',
    tags: JSON.stringify(['leather', 'biker', 'edgy', 'streetwear']),
    bodyShapeCompatibility: JSON.stringify(['hourglass', 'rectangle', 'inverted-triangle', 'pear']),
    weatherSuitability: JSON.stringify(['mild', 'cold']),
    occasions: JSON.stringify(['casual', 'date', 'party']),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['black', 'tan', 'burgundy']),
    source: 'AllSaints',
    rating: 4.7,
    reviewCount: 512,
    isNew: false,
    isTrending: true,
  },
  {
    id: 'shoes-001',
    name: 'Classic White Sneakers',
    brand: 'Adidas',
    price: 85.0,
    originalPrice: null,
    image: 'https://picsum.photos/seed/shoes001/600/800',
    category: 'shoes',
    tags: JSON.stringify(['sneakers', 'casual', 'classic', 'white']),
    bodyShapeCompatibility: JSON.stringify(['hourglass', 'pear', 'apple', 'rectangle', 'inverted-triangle']),
    weatherSuitability: JSON.stringify(['mild', 'warm']),
    occasions: JSON.stringify(['casual', 'sport', 'work']),
    sizes: JSON.stringify(['36', '37', '38', '39', '40', '41', '42', '43']),
    colors: JSON.stringify(['white', 'white-gold', 'triple-white']),
    source: 'Adidas',
    rating: 4.8,
    reviewCount: 2341,
    isNew: false,
    isTrending: true,
  },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.wardrobeItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.bodyProfile.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.recentSearch.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  const passwordHash = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.create({
    data: {
      email: 'alex@tryverse.com',
      name: 'Alex Chen',
      password: passwordHash,
      gender: 'female',
      stylePreference: 'minimalist',
      bodyType: 'hourglass',
      sizeCategory: 'S',
      favoriteBrands: JSON.stringify(['Zara', 'COS', 'ASOS']),
      budgetMin: 30,
      budgetMax: 200,
      occasionPreferences: JSON.stringify(['casual', 'work', 'date']),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jordan@tryverse.com',
      name: 'Jordan Lee',
      password: passwordHash,
      gender: 'male',
      stylePreference: 'streetwear',
      bodyType: 'rectangle',
      sizeCategory: 'M',
      favoriteBrands: JSON.stringify(['Nike', 'Adidas', 'Urban Outfitters']),
      budgetMin: 50,
      budgetMax: 300,
      occasionPreferences: JSON.stringify(['casual', 'sport']),
    },
  })

  console.log('✅ Created users:', user1.email, user2.email)

  // Create body profiles
  await prisma.bodyProfile.create({
    data: {
      userId: user1.id,
      height: 165,
      weight: 58,
      chest: 88,
      waist: 68,
      hips: 92,
      shoulders: 38,
      bodyShape: 'hourglass',
      sizeCategory: 'S',
      fitNotes: 'Prefer fitted waist, slightly flared hips',
    },
  })

  await prisma.bodyProfile.create({
    data: {
      userId: user2.id,
      height: 180,
      weight: 78,
      chest: 100,
      waist: 84,
      hips: 98,
      shoulders: 46,
      bodyShape: 'rectangle',
      sizeCategory: 'M',
      fitNotes: 'Athletic build, slightly loose fit preferred',
    },
  })

  console.log('✅ Created body profiles')

  // Seed products
  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    })
  }

  console.log(`✅ Seeded ${seedProducts.length} products`)

  // Create wardrobe items
  await prisma.wardrobeItem.createMany({
    data: [
      { userId: user1.id, productId: 'dress-001', category: 'wardrobe', notes: 'Love this for date nights' },
      { userId: user1.id, productId: 'dress-003', category: 'wardrobe', notes: 'Perfect for summer' },
      { userId: user1.id, productId: 'top-001', category: 'wardrobe' },
      { userId: user1.id, productId: 'pants-002', category: 'wishlist', notes: 'Next payday purchase' },
      { userId: user1.id, productId: 'shoes-001', category: 'wishlist' },
      { userId: user2.id, productId: 'top-002', category: 'wardrobe' },
      { userId: user2.id, productId: 'pants-001', category: 'wardrobe' },
      { userId: user2.id, productId: 'jacket-001', category: 'wishlist', notes: 'Birthday gift idea' },
      { userId: user2.id, productId: 'shoes-001', category: 'wardrobe' },
    ],
  })

  console.log('✅ Created wardrobe items')
  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
