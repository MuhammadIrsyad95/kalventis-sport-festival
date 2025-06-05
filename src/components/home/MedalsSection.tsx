import MedalTally from '@/components/MedalTally'
import type { Medal } from '@/types/database.types'

export default function MedalsSection({ medals }: { medals: Medal[] }) {
  return (
    <section id="medals-section" className="mb-12">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: 'rgb(0, 52, 98)' }}
      >
        Perolehan Medali Sementara
      </h2>
      <MedalTally medals={medals} />
    </section>
  )
}
