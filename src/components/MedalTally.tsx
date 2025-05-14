'use client';

import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

// type Medal = Database['public']['Tables']['medals']['Row']
type Team = Database['public']['Tables']['teams']['Row']

interface MedalTallyProps {
  // medals: Medal[]
}

// export default function MedalTally({ medals }: MedalTallyProps) {
//   const [teams, setTeams] = useState<Record<string, Team>>({})

//   useEffect(() => {
//     async function fetchTeams() {
//       const teamIds = Array.from(new Set(medals.map(m => m.team_id).filter(Boolean)))
//       if (teamIds.length === 0) return

//       const { data } = await supabase
//         .from('teams')
//         .select('*')
//         .in('id', teamIds as string[])

//       if (data) {
//         const teamMap = data.reduce((acc, team) => {
//           acc[team.id] = team
//           return acc
//         }, {} as Record<string, Team>)
//         setTeams(teamMap)
//       }
//     }

//     fetchTeams()
//   }, [medals])

//   const medalsByTeam = medals.reduce((acc, medal) => {
//     if (!medal.team_id) return acc
    
//     if (!acc[medal.team_id]) {
//       acc[medal.team_id] = {
//         gold: 0,
//         silver: 0,
//         bronze: 0,
//         total: 0
//       }
//     }
    
//     acc[medal.team_id].gold += medal.gold
//     acc[medal.team_id].silver += medal.silver
//     acc[medal.team_id].bronze += medal.bronze
//     acc[medal.team_id].total = acc[medal.team_id].gold + acc[medal.team_id].silver + acc[medal.team_id].bronze
    
//     return acc
//   }, {} as Record<string, { gold: number, silver: number, bronze: number, total: number }>)

//   const sortedTeams = Object.entries(medalsByTeam)
//     .sort(([, a], [, b]) => b.total - a.total)

//   return (
//     <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-white/5">
//               <th className="py-3 px-4 text-left text-sm font-semibold text-white">Rank</th>
//               <th className="py-3 px-4 text-left text-sm font-semibold text-white">Team Name</th>
//               <th className="py-3 px-4 text-left text-sm font-semibold text-white">Company</th>
//               <th className="py-3 px-4 text-center text-sm font-semibold text-white">🥇</th>
//               <th className="py-3 px-4 text-center text-sm font-semibold text-white">🥈</th>
//               <th className="py-3 px-4 text-center text-sm font-semibold text-white">🥉</th>
//               <th className="py-3 px-4 text-center text-sm font-semibold text-white">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedTeams.map(([teamId, counts], index) => (
//               <motion.tr
//                 key={teamId}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="border-t border-white/5 hover:bg-white/5"
//               >
//                 <td className="py-3 px-4 text-gray-400">{index + 1}</td>
//                 <td className="py-3 px-4 text-white font-medium">
//                   {teams[teamId]?.name || 'Loading...'}
//                 </td>
//                 <td className="py-3 px-4 text-white font-medium">
//                   {teams[teamId]?.company || 'Loading...'}
//                 </td>
//                 <td className="py-3 px-4 text-center text-white">{counts.gold}</td>
//                 <td className="py-3 px-4 text-center text-white">{counts.silver}</td>
//                 <td className="py-3 px-4 text-center text-white">{counts.bronze}</td>
//                 <td className="py-3 px-4 text-center text-white font-semibold">
//                   {counts.total}
//                 </td>
//               </motion.tr>
//             ))}
//             {sortedTeams.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="py-8 text-center text-gray-400">
//                   No medal data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
