"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SportsListPage() {
  const [sports, setSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSports() {
      const { data } = await supabase.from("sports").select("*").order("name");
      setSports(data || []);
      setLoading(false);
    }
    fetchSports();
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Daftar Cabang Olahraga</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sports.map((sport) => (
          <div key={sport.id} className="bg-white/10 rounded-lg shadow p-4 flex flex-col items-center">
            {sport.imageurl && (
              <img src={sport.imageurl} alt={sport.name} className="w-32 h-32 object-cover rounded mb-4 border" />
            )}
            <h2 className="text-xl font-semibold text-white mb-2 text-center">{sport.name}</h2>
            <Link
              href={`/sports/${sport.id}`}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Detail
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
} 