"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MatchCard from "@/components/MatchCard";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

// Custom Arrow dan getSliderSettings dari home
function Arrow(props: any) {
  const { style, onClick, direction } = props;
  return (
    <div
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [direction === "left" ? "left" : "right"]: 0,
        display: "flex",
        background: "rgba(30,30,30,0.5)",
        borderRadius: "50%",
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        fontSize: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: 32, color: "#fff", opacity: 0.8, lineHeight: 1 }}>
        {direction === "left" ? "‹" : "›"}
      </span>
    </div>
  );
}

function getSliderSettings(length: number) {
  return {
    dots: false,
    infinite: length > 3,
    speed: 500,
    slidesToShow: length >= 3 ? 3 : length,
    slidesToScroll: 1,
    arrows: true,
    autoplay: length > 1,
    autoplaySpeed: 3000,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: length >= 2 ? 2 : length } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };
}

export default function SportDetailPage() {
  const params = useParams();
  const sportId = params?.id as string;
  const [sport, setSport] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);

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

  // Kategorisasi match berdasarkan waktu (seperti di home)
  const now = new Date();
  const matchesLalu = matches.filter(m => m.match_time && new Date(m.match_time) < new Date(now.getTime() - 2 * 60 * 60 * 1000));
  const matchesSekarang = matches.filter(m => m.match_time && Math.abs(new Date(m.match_time).getTime() - now.getTime()) <= 2 * 60 * 60 * 1000);
  const matchesAkanDatang = matches.filter(m => m.match_time && new Date(m.match_time) > new Date(now.getTime() + 2 * 60 * 60 * 1000));

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">{sport.name}</h1>
      {sport.imageurl && (
        <>
          <img
            src={sport.imageurl}
            alt={sport.name}
            className="w-full max-w-2xl mx-auto h-64 md:h-96 object-cover rounded mb-8 border cursor-zoom-in"
            onClick={() => setZoomed(true)}
          />
          {zoomed && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
              onClick={() => setZoomed(false)}
            >
              <img
                src={sport.imageurl}
                alt={sport.name}
                className="max-w-2xl max-h-[80vh] rounded shadow-lg cursor-zoom-out"
                onClick={e => { e.stopPropagation(); setZoomed(false); }}
              />
            </div>
          )}
        </>
      )}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Jadwal Pertandingan</h2>
        {matchesLalu.length === 0 && matchesSekarang.length === 0 && matchesAkanDatang.length === 0 ? (
          <div className="text-gray-400">Belum ada jadwal pertandingan untuk olahraga ini.</div>
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Yang Lalu</h3>
              {matchesLalu.length > 0 ? (
                <div className="relative">
                  <Slider {...getSliderSettings(matchesLalu.length)}>
                    {matchesLalu.map((match) => (
                      <div key={match.id} className="px-2">
                        <MatchCard match={match} />
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="text-gray-400 px-4 py-8 text-center">Tidak ada pertandingan lalu</div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-2">Sedang Berlangsung</h3>
              {matchesSekarang.length > 0 ? (
                <div className="relative">
                  <Slider {...getSliderSettings(matchesSekarang.length)}>
                    {matchesSekarang.map((match) => (
                      <div key={match.id} className="px-2">
                        <MatchCard match={match} />
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="text-gray-400 px-4 py-8 text-center">Tidak ada pertandingan sekarang</div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Akan Datang</h3>
              {matchesAkanDatang.length > 0 ? (
                <div className="relative">
                  <Slider {...getSliderSettings(matchesAkanDatang.length)}>
                    {matchesAkanDatang.map((match) => (
                      <div key={match.id} className="px-2">
                        <MatchCard match={match} />
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="text-gray-400 px-4 py-8 text-center">Tidak ada pertandingan akan datang</div>
              )}
            </div>
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