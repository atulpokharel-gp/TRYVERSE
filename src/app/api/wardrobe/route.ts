import { NextRequest, NextResponse } from "next/server";
import type { WardrobeItem } from "@/types/user";

/**
 * In-memory wardrobe store keyed by user ID.
 * TODO: Replace with a real Prisma/Supabase database.
 */
const wardrobeStore: Record<string, WardrobeItem[]> = {};

function getStore(userId: string): WardrobeItem[] {
  if (!wardrobeStore[userId]) {
    wardrobeStore[userId] = getDefaultWardrobe();
  }
  return wardrobeStore[userId];
}

function getDefaultWardrobe(): WardrobeItem[] {
  return [
    {
      id: "w1",
      productId: "10",
      productName: "Tailored Blazer",
      productBrand: "Zara",
      productImage: "https://picsum.photos/seed/blazer10/400/500",
      productPrice: 149,
      note: "Good for work meetings",
      category: "wardrobe",
      addedAt: new Date().toISOString(),
    },
    {
      id: "w2",
      productId: "1",
      productName: "Elegant Wrap Dress",
      productBrand: "Zara",
      productImage: "https://picsum.photos/seed/dress1/400/500",
      productPrice: 89,
      note: "Perfect for dinner dates",
      category: "wishlist",
      addedAt: new Date().toISOString(),
    },
    {
      id: "w3",
      productId: "9",
      productName: "Oversized Knit Sweater",
      productBrand: "H&M",
      productImage: "https://picsum.photos/seed/knit9/400/500",
      productPrice: 49,
      note: "Winter look",
      category: "try-later",
      addedAt: new Date().toISOString(),
    },
  ];
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id") ?? "demo-user-1";
  const items = getStore(userId);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") ?? "demo-user-1";
    const body = await req.json();

    const newItem: WardrobeItem = {
      id: `w-${Date.now()}`,
      productId: body.productId,
      productName: body.productName,
      productBrand: body.productBrand,
      productImage: body.productImage,
      productPrice: body.productPrice,
      note: body.note ?? "",
      category: body.category ?? "wishlist",
      addedAt: new Date().toISOString(),
    };

    const items = getStore(userId);
    items.push(newItem);

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") ?? "demo-user-1";
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const items = getStore(userId);
    const index = items.findIndex((i) => i.id === itemId);

    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    items.splice(index, 1);
    return NextResponse.json({ message: "Item removed" });
  } catch {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
