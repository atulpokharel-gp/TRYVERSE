import { NextRequest, NextResponse } from "next/server";
import { getMockWeather, getWeatherBasedSuggestion } from "@/lib/weather";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? undefined;

  const weather = getMockWeather(city);
  const suggestion = getWeatherBasedSuggestion(weather);

  return NextResponse.json({ ...weather, suggestion });
}
