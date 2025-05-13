'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Tag } from 'lucide-react'
import { supabase, type News } from '@/lib/supabase'

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  async function fetchNews() {
    try {
      setLoading(true)
      let query = supabase.from('news').select('*')
      
      if (selectedCategory !== 'ALL') {
        query = query.eq('category', selectedCategory)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Latest News
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
              <Tag className="w-5 h-5 text-gray-400" />
              <select 
                className="bg-transparent text-gray-300 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="FOOTBALL">Football</option>
                <option value="BASKETBALL">Basketball</option>
                <option value="TENNIS">Tennis</option>
              </select>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-white/5 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : news.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No news found</p>
            </div>
          ) : (
            news.map((item) => (
              <motion.div
                key={item.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image_url})` }}
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 line-clamp-3">
                    {item.content}
                  </p>
                  <button className="mt-4 text-blue-400 hover:text-blue-300 transition-colors">
                    Read more
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 