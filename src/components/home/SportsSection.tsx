import Link from 'next/link'
import SportCard from '@/components/SportCard'
import type { Database } from '@/types/supabase'

type Sport = Database['public']['Tables']['sports']['Row']

export default function SportsSection({ sports }: { sports: Sport[] }) {
  const mainKategori = 'sport'

  // Mapping nama kategori khusus
  const kategoriLabels: Record<string, string> = {
    esport: 'E-Sport',
    fungames: 'Fun Games',
    // tambahkan lainnya sesuai kebutuhan
  }

  // Olahraga dengan kategori "sport"
  const sportsMain = sports.filter((s) => s.kategori === mainKategori)

  // Kategori lain, dikelompokkan per kategori
  const kategoriLainnya = sports
    .filter((s) => s.kategori && s.kategori !== mainKategori)
    .reduce<Record<string, Sport[]>>((acc, sport) => {
      const kategori = sport.kategori || 'Lainnya'
      if (!acc[kategori]) acc[kategori] = []
      acc[kategori].push(sport)
      return acc
    }, {})

  return (
      <section id="sports-section" className="mb-12 space-y-12 scroll-mt-24">
      {/* Bagian: Olahraga (kategori sport) */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgb(0, 52, 98)' }}>
          Olahraga
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sportsMain.length > 0 ? (
            sportsMain.map((sport) => (
              <Link key={sport.id} href={`/sports/${sport.id}`} className="block group">
                <SportCard sport={sport} />
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-8">
              Tidak ada olahraga dalam kategori "sport"
            </p>
          )}
        </div>
      </div>

      {/* Bagian: Olahraga Lainnya */}
    {Object.keys(kategoriLainnya).length > 0 && (
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgb(0, 52, 98)' }}>
          Olahraga Lainnya
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(kategoriLainnya).map(([kategori, list]) => {
            const sportContoh = list[0] // Ambil satu sport dari kategori tsb
            const label = kategoriLabels[kategori] || kategori.toUpperCase() // Gunakan label khusus atau fallback uppercase

            return (
              <Link key={kategori} href={`/kategori/${kategori}`} className="block group">
                <div className="bg-white rounded-2xl shadow-xl p-6 h-full flex flex-col items-center border border-gray-100 group hover:shadow-2xl transition">
                  <img
                    src={sportContoh.imageurl || '/default-image.png'}
                    alt={label}
                    className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition"
                  />
                  <h3
                    className="text-lg font-bold transition text-center truncate w-full"
                    style={{ color: 'rgb(0, 52, 98)' }}
                  >
                    {label}
                  </h3>
                </div>
              </Link>
            )
          })}
    </div>
  </div>
)}

    </section>
  )
}
