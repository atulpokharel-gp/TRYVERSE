import {
  Scan,
  Shirt,
  MessageSquare,
  Cloud,
  Search,
  Archive,
} from "lucide-react";

export const features = [
  {
    icon: Scan,
    title: "AI Body Scan",
    description:
      "Upload photos or enter measurements to generate your personal body profile and get size-perfect recommendations.",
    href: "/body-scan",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Shirt,
    title: "Virtual Try-On",
    description:
      "See how clothes look on you before you buy with our AR-powered virtual mirror technology.",
    href: "/try-on",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: MessageSquare,
    title: "Smart Stylist",
    description:
      "Chat with your AI personal stylist for outfit ideas tailored to your body shape, style, and occasions.",
    href: "/stylist",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Cloud,
    title: "Weather Styling",
    description:
      "Never dress wrong for the weather again. Get outfit suggestions that match today's forecast.",
    href: "/feed",
    color: "from-cyan-500 to-teal-600",
  },
  {
    icon: Search,
    title: "Reverse Search",
    description:
      "Upload any fashion photo and instantly find similar items across Zara, Amazon, Gucci, and more.",
    href: "/reverse-search",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Archive,
    title: "Smart Wardrobe",
    description:
      "Save your favourite looks, build outfits, and plan what to wear for every occasion.",
    href: "/wardrobe",
    color: "from-emerald-500 to-green-600",
  },
];
