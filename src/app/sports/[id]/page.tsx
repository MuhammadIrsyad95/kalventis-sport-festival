"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MatchCard from "@/components/MatchCard";

export default function SportDetailPage() {
  const params = useParams();
  const sportId = params?.id as string;
  const [sport, setSport] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [{ data: sportData }, { data: matchesData }, { data: rulesData }] = await Promise.all([
        supabase.from("sports").select("*").eq("id", sportId).single(),
        supabase.from("matches").select("*").eq("sport_id", sportId),
        supabase.from("rules").select("*").eq("sport_id", sportId),
      ]);
      setSport(sportData || null);
      setMatches(matchesData || []);
      setRules(rulesData || []);
      setLoading(false);
    }
    if (sportId) fetchAll();
  }, [sportId]);

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }
  if (!sport) {
    return <div className="p-8 text-white">Olahraga tidak ditemukan.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">{sport.name}</h1>
      {sport.imageurl && (
        <img src={sport.imageurl} alt={sport.name} className="w-full max-w-lg mx-auto h-64 object-cover rounded mb-8 border" />
      )}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Jadwal Pertandingan</h2>
        {matches.length === 0 ? (
          <div className="text-gray-400">Belum ada jadwal pertandingan untuk olahraga ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Peraturan</h2>
        {rules.length === 0 ? (
          <div className="text-gray-400">Belum ada peraturan untuk olahraga ini.</div>
        ) : (
          <ul className="list-disc pl-6 text-gray-200 space-y-2">
            {rules.map((rule) => (
              <li key={rule.id}>{rule.description || rule.content}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
} 