'use client'

import { useEffect, useState } from 'react'
import { Medal, Team } from '@/types/database.types'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface MedalTallyProps {
  medals: Medal[]
}

export default function MedalTally({ medals }: MedalTallyProps) {
  const [teams, setTeams] = useState<Record<string, Team>>({})

  useEffect(() => {
    async function fetchTeams() {
      const { data } = await supabase.from('teams').select('*')
      if (data) {
        const teamMap = data.reduce((acc, team) => {
          acc[team.id] = team
          return acc
        }, {} as Record<string, Team>)
        setTeams(teamMap)
      }
    }

    fetchTeams()
  }, [])

  interface MedalCounts {
    gold: number
    silver: number
    bronze: number
    total: number
    score: number
  }

  const medalsByTeam = medals.reduce<Record<string, MedalCounts>>((acc, medal) => {
    if (!medal.team_id) return acc
    if (!acc[medal.team_id]) {
      acc[medal.team_id] = { gold: 0, silver: 0, bronze: 0, total: 0, score: 0 }
    }
    acc[medal.team_id].gold += medal.gold || 0
    acc[medal.team_id].silver += medal.silver || 0
    acc[medal.team_id].bronze += medal.bronze || 0
    const team = acc[medal.team_id]
    team.total = team.gold + team.silver + team.bronze
    team.score = team.gold * 3 + team.silver * 2 + team.bronze * 1
    return acc
  }, {})

  const allTeamIds = Object.keys(teams)
  const teamsWithNoMedals = allTeamIds.filter(id => !medalsByTeam[id])
  const noMedalsAtAll = medals.length === 0 || teamsWithNoMedals.length === allTeamIds.length

  const specialOrder = ['K', 'A', 'L', 'V', 'E', 'N', 'T', 'I', 'S']

  function getGroupLetter(teamName: string) {
    const match = teamName.match(/Grup\s([A-Z])/i)
    return match ? match[1].toUpperCase() : ''
  }

  const sortedWithMedals = Object.entries(medalsByTeam).sort(([, a], [, b]) => {
    if (b.score !== a.score) return b.score - a.score
    if (b.gold !== a.gold) return b.gold - a.gold
    if (b.silver !== a.silver) return b.silver - a.silver
    return b.bronze - a.bronze
  })

  const sortedWithoutMedals = teamsWithNoMedals
    .map(id => [id, { gold: 0, silver: 0, bronze: 0, total: 0, score: 0 }] as [string, MedalCounts])
    .sort(([idA], [idB]) => {
      const nameA = teams[idA]?.name || ''
      const nameB = teams[idB]?.name || ''
      return nameA.localeCompare(nameB)
    })

  const finalSorted = noMedalsAtAll
    ? allTeamIds
        .map(id => [id, { gold: 0, silver: 0, bronze: 0, total: 0, score: 0 }] as [string, MedalCounts])
        .sort(([idA], [idB]) => {
          const letterA = getGroupLetter(teams[idA]?.name || '') || 'Z'
          const letterB = getGroupLetter(teams[idB]?.name || '') || 'Z'
          const indexA = specialOrder.indexOf(letterA)
          const indexB = specialOrder.indexOf(letterB)
          return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
        })
    : [...sortedWithMedals, ...sortedWithoutMedals]

  if (finalSorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100">
        <p className="text-gray-400">Belum ada data medali</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-200">
              <th className="py-4 px-4 text-left text-base font-bold" style={{ color: 'rgb(0, 52, 98)' }}>
                Peringkat
              </th>
              <th className="py-4 px-4 text-left text-base font-bold" style={{ color: 'rgb(0, 52, 98)' }}>
                Grup
              </th>
              <th className="py-6 px-4 text-center text-4xl font-black text-yellow-400 drop-shadow-md">🥇</th>
              <th className="py-6 px-4 text-center text-4xl font-black text-gray-400 drop-shadow-md">🥈</th>
              <th className="py-6 px-4 text-center text-4xl font-black text-orange-400 drop-shadow-md">🥉</th>
              <th className="py-4 px-4 text-center text-base font-bold" style={{ color: 'rgb(0, 52, 98)' }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {finalSorted.map(([teamId, counts], index) => (
              <motion.tr
                key={teamId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-t border-gray-100 hover:bg-indigo-50"
              >
                <td className="py-4 px-4 text-gray-700 font-semibold">{index + 1}</td>
                <td className="py-4 px-4 text-gray-900 font-bold">
                  {teams[teamId]?.name || 'Memuat...'}
                </td>
                <td className="py-4 px-4 text-center text-yellow-500 font-bold">{counts.gold}</td>
                <td className="py-4 px-4 text-center text-gray-500 font-bold">{counts.silver}</td>
                <td className="py-4 px-4 text-center text-orange-500 font-bold">{counts.bronze}</td>
                <td className="py-4 px-4 text-center font-extrabold" style={{ color: 'rgb(0, 52, 98)' }}>
                  {counts.total}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-left">
        <em>Disclaimer:</em> Ini adalah perolehan medali <strong>sementara</strong>. Hasil akhir dapat
        berubah setelah proses <strong>verifikasi final</strong>.
      </div>
    </div>
  )
}
