import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')?.toLowerCase()
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const occasion = searchParams.get('occasion')
    const bodyShape = searchParams.get('bodyShape')
    const trending = searchParams.get('trending')
    const isNew = searchParams.get('new')

    let result = [...products]

    if (category && category !== 'all') {
      result = result.filter(p => p.category === category)
    }
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      )
    }
    if (minPrice) {
      result = result.filter(p => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= parseFloat(maxPrice))
    }
    if (occasion) {
      result = result.filter(p => p.occasions?.includes(occasion))
    }
    if (bodyShape) {
      result = result.filter(p => p.bodyShapeCompatibility?.includes(bodyShape))
    }
    if (trending === 'true') {
      result = result.filter(p => p.isTrending)
    }
    if (isNew === 'true') {
      result = result.filter(p => p.isNew)
    }

    return NextResponse.json({ data: result, total: result.length })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
