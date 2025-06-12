"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MatchCard from "@/components/MatchCard";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import type { Database } from '@/types/supabase';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

type Sport = Database['public']['Tables']['sports']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

export default function SportDetailPage() {
  const params = useParams();
  const sportId = params?.id as string;
  const [sport, setSport] = useState<Sport | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [filter, setFilter] = useState<'ongoing' | 'upcoming' | 'past'>('ongoing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const sportRes = await supabase
          .from('sports')
          .select('*')
          .eq('id', sportId)
          .single();
        if (sportRes.error) throw new Error(sportRes.error.message);
        setSport(sportRes.data);

        const matchesRes = await supabase
          .from('matches')
          .select('*')
          .eq('sport_id', sportId)
          .order('round', { ascending: true });
        if (matchesRes.error) throw new Error(matchesRes.error.message);
        setMatches(matchesRes.data || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (sportId) fetchData();
  }, [sportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center text-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(0, 52, 98)' }}>Olahraga tidak ditemukan</h2>
          <p className="text-gray-700">Olahraga yang diminta tidak dapat ditemukan.</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const matchesLalu = matches.filter(m => m.match_time && new Date(m.match_time) < new Date(now.getTime() - 2 * 60 * 60 * 1000));
  const matchesSekarang = matches.filter(m => m.match_time && Math.abs(new Date(m.match_time).getTime() - now.getTime()) <= 2 * 60 * 60 * 1000);
  const matchesAkanDatang = matches.filter(m => m.match_time && new Date(m.match_time) > new Date(now.getTime() + 2 * 60 * 60 * 1000));

  return (
    <main className="min-h-screen bg-transparent">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-8" style={{ color: 'rgb(0, 52, 98)' }}>{sport.name}</h1>

        {/* Bagan */}
        {sport.bagan_url && (
          <>
            <img
              src={sport.bagan_url}
              alt={sport.name}
              className="w-full max-w-2xl mx-auto h-64 md:h-96 object-cover rounded mb-8 border cursor-zoom-in"
              onClick={() => setZoomed(true)}
            />
            {zoomed && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setZoomed(false);
                }}
              >
                {/* Tombol X */}
                <button
                  className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-100 rounded-full w-10 h-10 flex items-center justify-center text-2xl z-50"
                  onClick={() => setZoomed(false)}
                >
                  &times;
                </button>

                <TransformWrapper
                  wheel={{ step: 0.2 }}
                  pinch={{ step: 5 }}
                  panning={{ velocityDisabled: true }}
                  initialScale={1}
                >
                  {({ zoomIn, resetTransform, instance }) => {
                    let isZoomed = false;

                    return (
                      <div
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (isZoomed) {
                            resetTransform();
                          } else {
                            zoomIn();
                          }
                          isZoomed = !isZoomed;
                        }}
                      >
                       <TransformComponent>
                        <img
                          src={sport.bagan_url ?? undefined}
                          alt={sport.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </TransformComponent>

                      </div>
                    );
                  }}
                </TransformWrapper>
              </div>
            )}
          </>
        )}

        {/* Filter Pertandingan */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(0, 52, 98)' }}>Pertandingan</h2>

          <div className="flex space-x-4 mb-8 overflow-x-auto">
            {(['ongoing', 'upcoming', 'past'] as const).map((type) => (
              <button
                key={type}
                className={`pb-2 border-b-2 whitespace-nowrap ${
                  filter === type
                    ? 'border-indigo-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-indigo-600 transition'
                }`}
                style={filter === type ? { color: 'rgb(0, 52, 98)' } : undefined}
                onClick={() => setFilter(type)}
              >
                {{
                  ongoing: 'Sedang Berlangsung',
                  upcoming: 'Akan Datang',
                  past: 'Selesai',
                }[type]}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {filter === 'ongoing' && (
              matchesSekarang.length > 0 ? (
                <Slider {...getSliderSettings(matchesSekarang.length)}>
                  {matchesSekarang.map((match) => (
                    <div key={match.id} className="px-2">
                      <MatchCard match={match} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="text-gray-700 px-4 py-8 text-left text-lg">Jadwal pertandingan yang sedang berlangsung belum tersedia..</div>
              )
            )}

            {filter === 'upcoming' && (
              matchesAkanDatang.length > 0 ? (
                <Slider {...getSliderSettings(matchesAkanDatang.length)}>
                  {matchesAkanDatang.map((match) => (
                    <div key={match.id} className="px-2">
                      <MatchCard match={match} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="text-gray-700 px-4 py-8 text-left text-lg">Jadwal pertandingan yang akan datang belum tersedia.</div>
              )
            )}

            {filter === 'past' && (
              matchesLalu.length > 0 ? (
                <Slider {...getSliderSettings(matchesLalu.length)}>
                  {matchesLalu.map((match) => (
                    <div key={match.id} className="px-2">
                      <MatchCard match={match} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="text-gray-700 px-4 py-8 text-left text-lg">Jadwal pertandingan selesai belum tersedia.</div>
              )
            )}
          </div>
        </section>

        {/* Peraturan */}
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(0, 52, 98)' }}>Peraturan</h2>
          {sport.rules ? (
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {sport.rules.split('\n').map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-700">Tidak ada peraturan tersedia untuk olahraga ini.</div>
          )}
        </section>
      </div>
    </main>
  );
}
