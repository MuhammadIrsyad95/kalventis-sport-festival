'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MatchCarousel from '@/components/MatchCarousel';
import SportCard from '@/components/SportCard';
import clsx from 'clsx';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import type { Database } from '@/types/supabase';

type Sport = Database['public']['Tables']['sports']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

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
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [matchesBySport, setMatchesBySport] = useState<Record<string, Match[]>>({});
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming' | 'past'>('ongoing');
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);

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

  async function handleOpenModal(sport: Sport) {
    setSelectedSport(sport);
    setActiveTab('ongoing');

    if (!matchesBySport[sport.id]) {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('sport_id', sport.id)
        .order('match_time');
      if (error) {
        console.error('Gagal ambil matches:', error);
      } else {
        setMatchesBySport((prev) => ({ ...prev, [sport.id]: data || [] }));
      }
    }
  }

  function closeModal() {
    setSelectedSport(null);
    setZoomed(false);
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Kategori: {kategori}
      </h1>

      {sports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <div key={sport.id} className="cursor-pointer" onClick={() => handleOpenModal(sport)}>
              <SportCard sport={sport} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Tidak ada cabang olahraga dalam kategori ini.
        </p>
      )}

      {/* Modal Detail */}
      {selectedSport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>

            {/* Gambar Bagan */}
            {selectedSport.bagan_url && (
              <>
                <img
                  src={selectedSport.bagan_url}
                  alt="Bagan Turnamen"
                  className="w-full rounded-lg shadow-md transition-transform hover:scale-105 cursor-zoom-in mb-6"
                  onClick={() => setZoomed(true)}
                />
                {zoomed && (
                  <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setZoomed(false);
                    }}
                  >
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
                      {({ zoomIn, resetTransform }) => {
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
                                src={selectedSport.bagan_url ?? undefined}
                                alt={selectedSport.name}
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

            {/* Tab Filter */}
            <div className="flex space-x-4 mb-6">
              {(['ongoing', 'upcoming', 'past'] as const).map((key) => (
                <button
                  key={key}
                  className={`pb-2 border-b-2 ${
                    activeTab === key
                      ? 'border-[rgb(0,52,98)] text-[rgb(0,52,98)] font-semibold'
                      : 'border-transparent text-gray-600 hover:text-[rgb(0,52,98)]'
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

            {/* Carousel Pertandingan */}
            {matchesBySport[selectedSport.id] ? (
              filterMatchesByTime(matchesBySport[selectedSport.id])[activeTab].length > 0 ? (
                <MatchCarousel
                  matches={filterMatchesByTime(matchesBySport[selectedSport.id])[activeTab]}
                />
              ) : (
                <div className="text-gray-500 text-left py-6">
                  Jadwal pertandingan {activeTab === 'ongoing'
                    ? 'sedang berlangsung'
                    : activeTab === 'upcoming'
                    ? 'yang akan datang'
                    : 'yang telah selesai'} belum tersedia.
                </div>
              )
            ) : (
              <div className="text-center py-6">Loading matches...</div>
            )}

            {/* Peraturan */}
            {selectedSport.rules && (
              <div>
                <h4 className="text-lg font-semibold text-indigo-600 mt-6 mb-2">Peraturan</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedSport.rules.split('\n').map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
