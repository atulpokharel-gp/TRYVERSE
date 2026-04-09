/**
 * Mock weather service.
 *
 * TODO: Replace with a real weather API (e.g., OpenWeatherMap).
 * Integration point:
 *   const res = await fetch(
 *     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
 *   );
 */

export interface WeatherData {
  city: string;
  temperature: number;
  unit: "F" | "C";
  condition: string;
  icon: string;
  season: string;
  fashionSeason: "summer" | "spring" | "fall" | "winter" | "rainy";
}

const mockWeatherData: WeatherData[] = [
  {
    city: "New York",
    temperature: 68,
    unit: "F",
    condition: "Partly Cloudy",
    icon: "⛅",
    season: "Spring",
    fashionSeason: "spring",
  },
  {
    city: "Los Angeles",
    temperature: 82,
    unit: "F",
    condition: "Sunny",
    icon: "☀️",
    season: "Summer",
    fashionSeason: "summer",
  },
  {
    city: "London",
    temperature: 55,
    unit: "F",
    condition: "Rainy",
    icon: "🌧️",
    season: "Fall",
    fashionSeason: "rainy",
  },
  {
    city: "Chicago",
    temperature: 30,
    unit: "F",
    condition: "Snowy",
    icon: "❄️",
    season: "Winter",
    fashionSeason: "winter",
  },
  {
    city: "Miami",
    temperature: 88,
    unit: "F",
    condition: "Sunny",
    icon: "🌞",
    season: "Summer",
    fashionSeason: "summer",
  },
];

export function getMockWeather(city?: string): WeatherData {
  if (city) {
    const match = mockWeatherData.find(
      (w) => w.city.toLowerCase() === city.toLowerCase()
    );
    if (match) return match;
  }
  // Default to New York
  return mockWeatherData[0];
}

export function getWeatherBasedSuggestion(weather: WeatherData): string {
  switch (weather.fashionSeason) {
    case "summer":
      return "Linen, cotton, and light fabrics are your best friends. Opt for light colours and breathable cuts.";
    case "winter":
      return "Layer up with knitwear, wool, and insulated jackets. Dark tones and rich textures are perfect.";
    case "rainy":
      return "Go waterproof with a rain jacket and ankle boots. Dark jeans and layered tops work great.";
    case "spring":
      return "Florals, pastels, and light layers. A trench coat is the perfect transitional piece.";
    case "fall":
      return "Rich autumn tones — mustard, burgundy, olive. A blazer or chunky cardigan completes any look.";
    default:
      return "Check the forecast and layer accordingly!";
  }
}
