import { NextRequest, NextResponse } from "next/server";
import { generateStylistResponse } from "@/lib/mock-ai";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // TODO: Replace generateStylistResponse() with a real OpenAI API call:
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({ ... });
    const response = generateStylistResponse(message);

    return NextResponse.json({
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: response.content,
      products: response.products,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Stylist response failed" },
      { status: 500 }
    );
  }
}
