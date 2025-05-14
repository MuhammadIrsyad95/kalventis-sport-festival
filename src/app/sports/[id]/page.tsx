import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = params

  const { data: sport, error } = await supabase
    .from('sports')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !sport) {
    return notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{sport.name}</h1>
    </div>
  )
}
