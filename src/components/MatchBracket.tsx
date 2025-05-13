'use client';
import { useState } from 'react';

const dummyMatches = [
  {
    id: 1,
    team1: { name: 'Argentina', country: 'ARG' },
    team2: { name: 'France', country: 'FRA' },
    match_date: new Date(),
    status: 'ongoing',
    score_team1: 2,
    score_team2: 2,
    sport: { name: 'Football' },
  },
  {
    id: 2,
    team1: { name: 'Japan', country: 'JPN' },
    team2: { name: 'USA', country: 'USA' },
    match_date: new Date(),
    status: 'scheduled',
    sport: { name: 'Baseball' },
  },
];

export default function MatchBracket() {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'ongoing'>('all');

  const filteredMatches = dummyMatches.filter((match) => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">🎮 Match Schedule</h2>
        <div className="flex gap-2">
          {['all', 'scheduled', 'ongoing'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                filter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y">
        {filteredMatches.map((match) => (
          <div key={match.id} className="p-5 hover:bg-gray-50 transition">
            <div className="flex justify-between text-sm mb-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  match.status === 'ongoing'
                    ? 'bg-red-100 text-red-700 animate-pulse'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {match.status.toUpperCase()}
              </span>
              <span className="text-gray-500">{match.sport.name}</span>
            </div>

            <div className="grid grid-cols-3 text-center items-center">
              <div>
                <p className="font-bold text-gray-800">{match.team1.name}</p>
                <p className="text-xs text-gray-500">{match.team1.country}</p>
                {match.status === 'ongoing' && (
                  <p className="text-2xl font-bold mt-2">{match.score_team1}</p>
                )}
              </div>
              <div className="text-gray-500">
                <div className="text-xs">VS</div>
                <div className="mt-1 text-xs">
                  {match.match_date.toLocaleDateString()} <br />
                  {match.match_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-800">{match.team2.name}</p>
                <p className="text-xs text-gray-500">{match.team2.country}</p>
                {match.status === 'ongoing' && (
                  <p className="text-2xl font-bold mt-2">{match.score_team2}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
