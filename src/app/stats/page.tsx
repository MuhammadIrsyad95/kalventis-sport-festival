import MedalTally from '@/components/MedalTally'

export default function StatsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Medal Statistics</h1>
      <div className="card p-6">
        <MedalTally />
      </div>
    </main>
  )
} 