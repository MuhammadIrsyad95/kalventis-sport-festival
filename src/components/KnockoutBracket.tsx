import React, { useMemo } from 'react';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

interface Team {
  id: string;
  name: string;
}

interface MatchData {
  id: string;
  round: string;
  next_match_id: string | null;
  match_time: string | null;
  team1_id: string;
  team2_id: string;
  team1_score: number | null;
  team2_score: number | null;
  winner_id: string | null;
}

interface KnockoutBracketProps {
  matches: MatchData[];
  teams: Team[];
}

type BracketMatch = {
  id: string;
  name: string;
  nextMatchId: string | null;
  tournamentRoundText: string;
  startTime: string | null;
  state: 'DONE' | 'SCHEDULED';
  participants: {
    id: string;
    name: string;
    resultText?: string;
    isWinner?: boolean;
    status?: 'PLAYED' | null;
  }[];
};

function toBracketMatches(matches: MatchData[], teams: Team[]): BracketMatch[] {
  const getTeam = (id: string) => teams.find(t => t.id === id) || { id, name: 'Unknown' };

  return matches.map(m => {
    const team1 = getTeam(m.team1_id);
    const team2 = getTeam(m.team2_id);

    return {
      id: m.id,
      name: m.round || 'Match',
      nextMatchId: m.next_match_id || null,
      tournamentRoundText: m.round || '',
      startTime: m.match_time || null,
      state: (m.team1_score !== null && m.team2_score !== null) ? 'DONE' : 'SCHEDULED',
      participants: [
        {
          id: team1.id,
          name: team1.name,
          resultText: m.team1_score !== null ? String(m.team1_score) : undefined,
          isWinner: m.winner_id === team1.id,
          status: m.team1_score !== null ? 'PLAYED' : null,
        },
        {
          id: team2.id,
          name: team2.name,
          resultText: m.team2_score !== null ? String(m.team2_score) : undefined,
          isWinner: m.winner_id === team2.id,
          status: m.team2_score !== null ? 'PLAYED' : null,
        },
      ],
    };
  });
}

const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ matches, teams }) => {
  if (!matches || matches.length === 0) {
    return <div className="text-center text-gray-500 py-8">Belum ada data pertandingan knockout.</div>;
  }
  if (!teams || teams.length === 0) {
    return <div className="text-center text-gray-500 py-8">Belum ada data tim.</div>;
  }

  const bracketMatches = useMemo(() => toBracketMatches(matches, teams), [matches, teams]);

  const width = typeof window !== 'undefined' ? Math.max(window.innerWidth - 50, 500) : 600;
  const height = 600;

  return (
    <div className="overflow-x-auto w-full py-4">
      <SingleEliminationBracket
        matches={bracketMatches}
        matchComponent={Match}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer width={width} height={height} {...props}>
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
};

export default KnockoutBracket;
