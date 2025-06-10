'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MatchCard from '@/components/MatchCard';
import SportCard from '@/components/SportCard';
import Slider from 'react-slick';
import clsx from 'clsx';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import type { Database } from '@/types/supabase';

type Sport = Database['public']['Tables']['sports']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

function Arrow(props: any) {
  const { style, onClick, direction } = props;
  return (
    <div
      style={{
        ...style,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction === 'left' ? 'left' : 'right']: 0,
        display: 'flex',
        background: 'rgba(30,30,30,0.5)',
        borderRadius: '50%',
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        fontSize: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: 32, color: '#fff', opacity: 0.8, lineHeight: 1 }}>
        {direction === 'left' ? '‹' : '›'}
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
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };
}

function filterMatchesByTime(matches: Match[]) {
  const now = Date.now();
  return {
    ongoing: matches.filter((m) =>
      m.match_time ? Math.abs(new Date(m.match_time).getTime() - now) <= 2 * 60 * 60 * 1000 : false
    ),
    upcoming: matches.filter((m) =>
      m.match_time ? new Date(m.match_time).getTime() > now + 2 * 60 * 60 * 1000 : false
    ),
    past: matches.filter((m) =>
      m.match_time ? new Date(m.match_time).getTime() < now - 2 * 60 * 60 * 1000 : false
    ),
  };
}

export default function SportsByKategoriPage() {
  const { kategori } = useParams();
  const [sports, setSports] = useState<Sport[]>([]);
  const [expandedSportId, setExpandedSportId] = useState<string | null>(null);
  const [matchesBySport, setMatchesBySport] = useState<Record<string, Match[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming' | 'past'>('ongoing');

  useEffect(() => {
    async function fetchSports() {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .eq('kategori', kategori)
        .order('name');
      if (error) console.error('Gagal mengambil sports:', error);
      setSports(data || []);
      setLoading(false);
    }
    if (kategori) fetchSports();
  }, [kategori]);

  async function handleExpand(sportId: string) {
    if (expandedSportId === sportId) {
      setExpandedSportId(null);
      return;
    }
    if (!matchesBySport[sportId]) {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('sport_id', sportId)
        .order('match_time');
      if (error) {
        console.error('Gagal ambil matches:', error);
      } else {
        setMatchesBySport((prev) => ({ ...prev, [sportId]: data || [] }));
      }
    }
    setExpandedSportId(sportId);
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Kategori: {kategori}
      </h1>

      {sports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => {
            const isExpanded = expandedSportId === sport.id;
            const allMatches = matchesBySport[sport.id] || [];
            const filteredMatches = filterMatchesByTime(allMatches);

            return (
              <div
                key={sport.id}
                className={clsx(
                  'transition-all duration-300 ease-in-out',
                  isExpanded ? 'col-span-full' : ''
                )}
              >
                {/* Sport Card */}
                <div
                  onClick={() => handleExpand(sport.id)}
                  className="cursor-pointer transition group"
                >
                  <div className="bg-white rounded-lg shadow-md hover:ring-2 hover:ring-indigo-200 transition overflow-hidden">
                    <SportCard sport={sport} />
                  </div>
                </div>

                {/* Expand Detail */}
                <div
                  className={clsx(
                    'transition-all duration-500 ease-in-out overflow-hidden',
                    isExpanded
                      ? 'max-h-[2000px] opacity-100 scale-100 mt-4'
                      : 'max-h-0 opacity-0 scale-95'
                  )}
                >
                  <div className="bg-white rounded-lg shadow-md p-4">
                    {/* Bagan */}
                    {sport.bagan_url && (
                      <div className="mb-6">
                        <img
                          src={sport.bagan_url}
                          alt="Bagan Turnamen"
                          className="w-full max-w-4xl mx-auto rounded shadow-md transition-transform hover:scale-105 cursor-zoom-in"
                        />
                      </div>
                    )}

                    {/* Filter Tab */}
                    <div className="flex space-x-4 mb-6 overflow-x-auto">
                      {(['ongoing', 'upcoming', 'past'] as const).map((key) => (
                        <button
                          key={key}
                          className={`pb-2 border-b-2 whitespace-nowrap ${
                            activeTab === key
                              ? 'border-[rgb(0,52,98)] text-[rgb(0,52,98)] font-semibold'
                              : 'border-transparent text-gray-600 hover:text-[rgb(0,52,98)] transition'
                          }`}
                          onClick={() => setActiveTab(key)}
                        >
                          {key === 'ongoing'
                            ? 'Sedang Berlangsung'
                            : key === 'upcoming'
                            ? 'Akan Datang'
                            : 'Selesai'}
                        </button>
                      ))}
                    </div>

                    {/* Carousel */}
                    {filteredMatches[activeTab].length > 0 ? (
                      <Slider {...getSliderSettings(filteredMatches[activeTab].length)}>
                        {filteredMatches[activeTab].map((match) => (
                          <div key={match.id} className="px-2">
                            <MatchCard match={match} />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="text-gray-500 px-4 py-8 text-center">
                        Tidak ada pertandingan{' '}
                        {activeTab === 'ongoing'
                          ? 'Sedang Berlangsung'
                          : activeTab === 'upcoming'
                          ? 'Akan Datang'
                          : 'Selesai'}.
                      </div>
                    )}

                    {/* Rules */}
                    {sport.rules && (
                      <div>
                        <h4 className="text-lg font-semibold text-indigo-600 mt-6 mb-2">
                          Peraturan
                        </h4>
                        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                          {sport.rules.split('\n').map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Tidak ada cabang olahraga dalam kategori ini.
        </p>
      )}
    </main>
  );
}
