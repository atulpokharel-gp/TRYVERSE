'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Wand2, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const suggestedPrompts = [
  'What to wear in the rain?',
  'Best summer outfits',
  'Outfit for a party',
  'Office look for Monday',
  'Casual weekend style',
  'Winter layering tips',
]

const mockResponses: Record<string, string> = {
  rain: "For rainy days, I'd suggest layering with a classic trench coat (like Burberry's timeless style) over a cosy turtleneck. Pair with ankle boots in a water-resistant leather and carry a structured tote. Earth tones — camel, dark brown, navy — are perfect for gloomy weather while still looking polished. 🌧️",
  summer: "Summer dressing is all about breathable fabrics and easy silhouettes! Try a linen slip dress in ivory or sage with flat raffia sandals. Add a minimal gold belt to define your waist. For evenings, layer a lightweight denim jacket. Keep accessories minimal — a simple chain necklace and sunglasses complete the look effortlessly. ☀️",
  party: "For a party, you want to stand out! Consider a sleek bodycon midi dress in a rich colour — midnight navy or champagne. Pair with strappy block heels for elegance without sacrificing comfort on the dance floor. Add a mini quilted bag and bold earrings to elevate. Remember: confidence is your best accessory! ✨",
  office: "A polished office look starts with well-tailored trousers in beige or black. Tuck in a silk blouse and add a structured blazer for authority. Loafers or low block heels keep it comfortable for long days. Keep jewellery minimal — a gold watch or simple stud earrings work beautifully. 💼",
  casual: "Casual doesn't mean careless! An oversized graphic tee tucked into high-rise jeans creates an effortless '90s-inspired look. Add white sneakers and a crossbody bag. For an elevated casual vibe, swap the tee for a ribbed crop top and add a denim jacket. Layer fine gold necklaces for that 'I woke up like this' polish. 🌿",
  winter: "Winter layering is an art! Start with a cashmere turtleneck as your base, add wide-leg tailored trousers, and top with a quilted puffer or a classic wool coat. Knee-high leather boots not only look stunning but keep your legs warm. A plaid cashmere scarf is both functional and chic. Rich tones — burgundy, forest green, camel — are your winter palette. ❄️",
}

const getResponse = (message: string): string => {
  const lower = message.toLowerCase()
  for (const [keyword, response] of Object.entries(mockResponses)) {
    if (lower.includes(keyword)) return response
  }
  return "Great question! Fashion is all about expressing your unique self. I'd recommend starting with well-fitting basics — a crisp white blouse, tailored trousers, and quality shoes. From there, let colour and accessories tell your story. Would you like specific advice on a particular occasion, season, or body shape? I'm here to help you style with confidence! ✨"
}

export default function StylistPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello, darling! I'm your personal AI stylist. Ask me anything about fashion, outfits, body styling, or what to wear for any occasion. I'm here to make you look and feel incredible! ✨",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    // eslint-disable-next-line react-hooks/purity
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    await new Promise(res => setTimeout(res, 1200 + Math.random() * 800))

    const aiMsg: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(text),
    }
    setTyping(false)
    setMessages(prev => [...prev, aiMsg])
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8] flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-5 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-purple-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-[#F5F0E8]">AI Stylist</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/40">Online & ready to style you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-purple-500 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#C9A84C] text-black font-medium rounded-br-sm'
                    : 'bg-white/5 border border-white/10 text-[#F5F0E8]/90 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Typing animation */}
          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-purple-500 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#C9A84C] rounded-full"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 bg-[#0a0a0a] px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Suggested prompts */}
          <div className="flex gap-2 flex-wrap mb-3">
            {suggestedPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/50 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask your stylist anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="w-11 h-11 bg-[#C9A84C] text-black rounded-xl flex items-center justify-center hover:bg-[#e0bb5a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
