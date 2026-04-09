import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/stylist";
import { formatPrice } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gradient-to-br from-pink-500 to-indigo-600 text-white"
        )}
      >
        {isUser ? "U" : "✨"}
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[80%]", isUser && "items-end flex flex-col")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
            isUser
              ? "rounded-tr-sm bg-indigo-600 text-white"
              : "rounded-tl-sm bg-gray-100 text-gray-800"
          )}
        >
          {message.content}
        </div>

        {/* Suggested products */}
        {message.products && message.products.length > 0 && (
          <div className="mt-3 flex gap-3 flex-wrap">
            {message.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm w-48"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <p className="text-xs font-bold text-indigo-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-1 text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
