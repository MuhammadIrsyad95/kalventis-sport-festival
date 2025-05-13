import { Database } from '@/types/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy } from 'lucide-react'

type Sport = Database['public']['Tables']['sports']['Row']

interface SportsListProps {
  sports: Sport[]
}

export default function SportsList({ sports }: SportsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sports.map((sport, index) => (
        <motion.div
          key={sport.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/sports/${sport.id}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/15 transition cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-white">{sport.name}</h3>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-400">View Details</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
      {sports.length === 0 && (
        <p className="text-gray-400 col-span-full text-center py-8">
          No sports available
        </p>
      )}
    </div>
  )
} 