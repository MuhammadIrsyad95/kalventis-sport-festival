import Link from 'next/link'
import SportCard from '@/components/SportCard'
import type { Database } from '@/types/supabase'

type Sport = Database['public']['Tables']['sports']['Row']

export default function SportsSection({ sports }: { sports: Sport[] }) {
  return (
    <section id="sports-section">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Olahraga</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sports.map((sport) => (
          <Link key={sport.id} href={`/sports/${sport.id}`} className="block group">
            <SportCard sport={sport} />
          </Link>
        ))}
        {sports.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-8">
            Tidak ada olahraga tersedia
          </p>
        )}
      </div>
    </section>
  )
}
