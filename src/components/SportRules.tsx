import { Rule } from '@/types/database.types'

interface SportRulesProps {
  rules: Rule[]
  sportName: string
}

export default function SportRules({ rules, sportName }: SportRulesProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4">Rules for {sportName}</h3>
      {rules.length > 0 ? (
        <ul className="space-y-4">
          {rules.map((rule) => (
            <li key={rule.id} className="text-gray-300">
              <p className="whitespace-pre-wrap">{rule.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No rules have been added for this sport yet.</p>
      )}
    </div>
  )
} 