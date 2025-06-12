"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MatchCard from "@/components/MatchCard";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import type { Database } from '@/types/supabase';

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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filter, setFilter] = useState<'ongoing' | 'upcoming' | 'past'>('ongoing');
  const [error, setError] = useState<string | null>(null);

  const zoomRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: sportData, error: sportError } = await supabase.from('sports').select('*').eq('id', sportId).single();
        if (sportError) throw new Error(sportError.message);
        setSport(sportData);

        const { data: matchesData, error: matchesError } = await supabase.from('matches').select('*').eq('sport_id', sportId).order('round', { ascending: true });
        if (matchesError) throw new Error(matchesError.message);
        setMatches(matchesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    if (sportId) fetchData();
  }, [sportId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startPos.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    posRef.current = {
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y
    };
    if (zoomRef.current) {
      zoomRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${zoomLevel})`;
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleDoubleClick = () => {
    const newZoom = zoomLevel === 1 ? 2 : 1;
    setZoomLevel(newZoom);
    posRef.current = { x: 0, y: 0 };
    if (zoomRef.current) {
      zoomRef.current.style.transform = `translate(0px, 0px) scale(${newZoom})`;
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (error || !sport) return <div className="min-h-screen flex justify-center items-center">{error || 'Sport not found'}</div>;

  const now = new Date();
  const matchesSekarang = matches.filter(m => m.match_time && Math.abs(new Date(m.match_time).getTime() - now.getTime()) <= 2 * 60 * 60 * 1000);
  const matchesAkanDatang = matches.filter(m => m.match_time && new Date(m.match_time) > new Date(now.getTime() + 2 * 60 * 60 * 1000));
  const matchesLalu = matches.filter(m => m.match_time && new Date(m.match_time) < new Date(now.getTime() - 2 * 60 * 60 * 1000));

  return (
    <main className="min-h-screen px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">{sport.name}</h1>

      {sport.bagan_url && (
        <>
          <img
            src={sport.bagan_url}
            alt="Bagan"
            className="max-w-full mx-auto cursor-zoom-in"
            onClick={() => {
              setZoomed(true);
              setZoomLevel(1);
              posRef.current = { x: 0, y: 0 };
            }}
          />

          {zoomed && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
              <div className="absolute top-4 right-4 text-white text-3xl cursor-pointer" onClick={() => setZoomed(false)}>✕</div>
              <div
                ref={zoomRef}
                className="touch-none cursor-grab"
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ transform: `scale(${zoomLevel})`, maxHeight: '90vh' }}
              >
                <img
                  src={sport.bagan_url}
                  alt="Zoomed"
                  className="max-w-full max-h-[90vh] object-contain"
                />
              </div>
            </div>
          )}
        </>
      )}

      <section className="mt-10">
        <div className="flex gap-4 overflow-x-auto mb-4">
          {(['ongoing', 'upcoming', 'past'] as const).map(k => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`pb-2 border-b-2 ${filter === k ? 'border-blue-800 text-blue-900 font-semibold' : 'border-transparent text-gray-600'}`}
            >
              {k === 'ongoing' ? 'Sedang Berlangsung' : k === 'upcoming' ? 'Akan Datang' : 'Selesai'}
            </button>
          ))}
        </div>

        <div>
          {filter === 'ongoing' && (
            matchesSekarang.length > 0 ? (
              <Slider {...getSliderSettings(matchesSekarang.length)}>
                {matchesSekarang.map(match => <div key={match.id} className="px-2"><MatchCard match={match} /></div>)}
              </Slider>
            ) : <p className="text-center text-gray-600">Tidak ada pertandingan sedang berlangsung.</p>
          )}
          {filter === 'upcoming' && (
            matchesAkanDatang.length > 0 ? (
              <Slider {...getSliderSettings(matchesAkanDatang.length)}>
                {matchesAkanDatang.map(match => <div key={match.id} className="px-2"><MatchCard match={match} /></div>)}
              </Slider>
            ) : <p className="text-center text-gray-600">Tidak ada pertandingan akan datang.</p>
          )}
          {filter === 'past' && (
            matchesLalu.length > 0 ? (
              <Slider {...getSliderSettings(matchesLalu.length)}>
                {matchesLalu.map(match => <div key={match.id} className="px-2"><MatchCard match={match} /></div>)}
              </Slider>
            ) : <p className="text-center text-gray-600">Tidak ada pertandingan yang telah selesai.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">Peraturan</h2>
        {sport.rules ? (
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            {sport.rules.split('\n').map((rule, i) => <li key={i}>{rule}</li>)}
          </ul>
        ) : <p className="text-gray-600">Belum ada peraturan yang tersedia.</p>}
      </section>
    </main>
  );
}
