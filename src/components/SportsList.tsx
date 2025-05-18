import { Database } from '@/types/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import SportCard from './SportCard'

type Sport = Database['public']['Tables']['sports']['Row']

interface SportsListProps {
  sports: Sport[]
}

export default function SportsList({ sports }: SportsListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {sports.map((sport) => (
        <Link key={sport.id} href={`/sports/${sport.id}`} className="block group">
          <SportCard sport={sport} />
        </Link>
      ))}
      {sports.length === 0 && (
        <p className="text-gray-400 col-span-full text-center py-8">
          No sports available
        </p>
      )}
    </div>
  )
} 