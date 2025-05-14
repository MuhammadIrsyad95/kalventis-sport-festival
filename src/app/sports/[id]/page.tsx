// src/app/sports/[id]/page.tsx

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const id = params.id

  const { data: sport, error } = await supabase
    .from('sports')
    .select('*')
    .eq('id', id)
    .single()

  if (!sport) return notFound()

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">{sport.name}</h1>
      <p className="text-gray-400 mt-2">Sport ID: {id}</p>
    </div>
  )
}
