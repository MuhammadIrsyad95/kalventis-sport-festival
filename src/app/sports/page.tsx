"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import SportCard from '@/components/SportCard';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sports.map((sport) => (
          <Link key={sport.id} href={`/sports/${sport.id}`} className="block group">
            <SportCard sport={sport} />
          </Link>
        ))}
        {sports.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-8">
            No sports available
          </p>
        )}
      </div>
    </main>
  );
} 