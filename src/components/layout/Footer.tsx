import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-black text-xl">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                TryVerse
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Try Before You Buy. From Every Angle.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Product
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/feed", label: "Shopping Feed" },
                { href: "/body-scan", label: "Body Scan" },
                { href: "/try-on", label: "Virtual Try-On" },
                { href: "/stylist", label: "AI Stylist" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Tools
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/wardrobe", label: "My Wardrobe" },
                { href: "/reverse-search", label: "Reverse Search" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/profile", label: "Profile" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h3>
            <ul className="mt-3 space-y-2">
              {["About", "Blog", "Careers", "Privacy Policy", "Terms"].map(
                (item) => (
                  <li key={item}>
                    <span className="cursor-pointer text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} TryVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
