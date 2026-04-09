'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Shirt, Heart, Clock, Plus, Trash2, StickyNote } from 'lucide-react'
import { products } from '@/data/products'
import { WardrobeItem } from '@/types'

type Tab = 'wardrobe' | 'wishlist' | 'tryLater'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'wardrobe', label: 'My Wardrobe', icon: Shirt },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'tryLater', label: 'Try Later', icon: Clock },
]

// Seed some demo items from catalog
const seedItems: WardrobeItem[] = [
  { id: 'w1', userId: 'demo', productId: 'dress-001', addedAt: new Date(), category: 'wardrobe', notes: 'Wear to cocktail evening' },
  { id: 'w2', userId: 'demo', productId: 'top-003', addedAt: new Date(), category: 'wardrobe' },
  { id: 'w3', userId: 'demo', productId: 'jacket-004', addedAt: new Date(), category: 'wishlist', notes: 'Save for winter' },
  { id: 'w4', userId: 'demo', productId: 'shoes-002', addedAt: new Date(), category: 'wishlist' },
  { id: 'w5', userId: 'demo', productId: 'dress-003', addedAt: new Date(), category: 'tryLater' },
  { id: 'w6', userId: 'demo', productId: 'acc-001', addedAt: new Date(), category: 'tryLater' },
]

export default function WardrobePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('wardrobe')
  const [items, setItems] = useState<WardrobeItem[]>(seedItems)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteValue, setNoteValue] = useState('')

  const tabItems = items.filter(item => item.category === activeTab)

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const saveNote = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, notes: noteValue } : i))
    setEditingNote(null)
  }

  const startEditNote = (item: WardrobeItem) => {
    setEditingNote(item.id)
    setNoteValue(item.notes ?? '')
  }

  const getProduct = (productId: string) => products.find(p => p.id === productId)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-2">Your Collection</p>
          <h1 className="font-serif text-4xl text-[#F5F0E8]">Wardrobe</h1>
          <p className="text-white/40 mt-1">{items.length} total items saved</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => {
            const count = items.filter(i => i.category === id).length
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-[#C9A84C] text-black'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === id ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tabItems.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  {activeTab === 'wardrobe' && <Shirt className="w-8 h-8 text-white/20" />}
                  {activeTab === 'wishlist' && <Heart className="w-8 h-8 text-white/20" />}
                  {activeTab === 'tryLater' && <Clock className="w-8 h-8 text-white/20" />}
                </div>
                <h3 className="text-lg font-semibold text-[#F5F0E8] mb-2">
                  {activeTab === 'wardrobe' && 'Your wardrobe is empty'}
                  {activeTab === 'wishlist' && 'Your wishlist is empty'}
                  {activeTab === 'tryLater' && 'Nothing saved for later'}
                </h3>
                <p className="text-white/30 text-sm mb-6 max-w-xs mx-auto">
                  Browse the shop and save items you love — they&apos;ll appear here.
                </p>
                <button
                  onClick={() => router.push('/shop')}
                  className="inline-flex items-center gap-2 bg-[#C9A84C] text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#e0bb5a] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Browse Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {tabItems.map(item => {
                  const product = getProduct(item.productId)
                  if (!product) return null
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
                        <p className="text-sm text-[#F5F0E8] font-medium line-clamp-1 mb-1">{product.name}</p>
                        <p className="text-sm text-white/60 font-bold">${product.price.toFixed(2)}</p>

                        {/* Note */}
                        {editingNote === item.id ? (
                          <div className="mt-3">
                            <textarea
                              value={noteValue}
                              onChange={e => setNoteValue(e.target.value)}
                              placeholder="Add a note..."
                              rows={2}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F0E8] placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/50 resize-none"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => saveNote(item.id)}
                                className="text-xs bg-[#C9A84C] text-black px-3 py-1 rounded-lg font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingNote(null)}
                                className="text-xs text-white/40 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditNote(item)}
                            className="mt-3 flex items-center gap-1.5 text-xs text-white/30 hover:text-[#C9A84C] transition-colors"
                          >
                            <StickyNote className="w-3 h-3" />
                            {item.notes ? <span className="line-clamp-1 text-white/50">{item.notes}</span> : 'Add note'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
