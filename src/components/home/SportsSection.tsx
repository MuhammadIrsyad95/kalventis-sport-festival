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
    <section id="sports-section" className="mb-12 space-y-12">
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
              const sportContoh = list[0] // Ambil satu olahraga dari kategori tsb
              return (
                <Link key={kategori} href={`/kategori/${kategori}`} className="group block">
                  <div className="rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white">
                    {sportContoh.imageurl ? (
                      <img
                        src={sportContoh.imageurl}
                        alt={sportContoh.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                        Tidak ada gambar
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
                        {kategoriLabels[kategori] || kategori}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {list.length} cabang dalam kategori ini
                      </p>
                    </div>
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
