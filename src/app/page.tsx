// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import MatchCard from '@/components/MatchCard'
import MedalTally from '@/components/MedalTally'
import SportsList from '@/components/SportsList'
import type { Database } from '@/types/supabase'
import type { Medal } from '@/types/database.types'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import SportCard from '@/components/SportCard';
import Link from 'next/link';

type Match = Database['public']['Tables']['matches']['Row']
type Sport = Database['public']['Tables']['sports']['Row']
type Team = Database['public']['Tables']['teams']['Row']

// Custom Arrow
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

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [medalTally, setMedalTally] = useState<Medal[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchesRes, medalsRes, sportsRes, teamsRes] = await Promise.all([
          supabase
            .from('matches')
            .select('*')
            .order('round', { ascending: true }),
          supabase
            .from('medals')
            .select('*'),
          supabase
            .from('sports')
            .select('*'),
          supabase
            .from('teams')
            .select('*')
        ])

        if (matchesRes.error) throw new Error(matchesRes.error.message)
        if (medalsRes.error) throw new Error(medalsRes.error.message)
        if (sportsRes.error) throw new Error(sportsRes.error.message)
        if (teamsRes.error) throw new Error(teamsRes.error.message)

        setMatches(matchesRes.data || [])
        setMedalTally(medalsRes.data || [])
        setSports(sportsRes.data || [])
        setTeams(teamsRes.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  // Kategorisasi match berdasarkan waktu
  const now = new Date()
  const matchesLalu = matches.filter(m => m.match_time && new Date(m.match_time) < new Date(now.getTime() - 2 * 60 * 60 * 1000))
  const matchesSekarang = matches.filter(m => m.match_time && Math.abs(new Date(m.match_time).getTime() - now.getTime()) <= 2 * 60 * 60 * 1000)
  const matchesAkanDatang = matches.filter(m => m.match_time && new Date(m.match_time) > new Date(now.getTime() + 2 * 60 * 60 * 1000))

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16"
        >
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 mb-6 leading-tight">
              Kalventis Sport Festival
            </h1>
            <p className="text-gray-700 text-lg mb-8 max-w-xl">
              Skor real-time, pertandingan langsung, dan rekap medali untuk turnamen olahraga paling menarik tahun ini. Tetap terupdate dan dukung tim favorit Anda!
            </p>
            <Link href="/sports">
              <button className="btn btn-primary text-lg px-8 py-4 rounded-2xl shadow-xl">Lihat Daftar Olahraga</button>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/images/3.svg" alt="Athlete Illustration" className="w-full max-w-md h-auto object-contain drop-shadow-xl" />
          </div>
        </motion.section>

        {/* Highlight Statistics */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sports Count Card */}
            <Link href="#sports-section" className="block">
              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-100 hover:shadow-2xl transition cursor-pointer">
                <span className="text-4xl font-extrabold text-indigo-700 mb-2">{sports.length}</span>
                <span className="text-lg font-semibold text-gray-700">Olahraga</span>
              </div>
            </Link>
            {/* Medal Data Entries Card */}
            <Link href="#medals-section" className="block">
              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-100 hover:shadow-2xl transition cursor-pointer">
                <span className="text-4xl font-extrabold text-indigo-700 mb-2">{teams.length}</span>
                <span className="text-lg font-semibold text-gray-700">Total Tim</span>
              </div>
            </Link>
            {/* Total Matches Card */}
            <Link href="#matches-section" className="block">
              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-100 hover:shadow-2xl transition cursor-pointer">
                <span className="text-4xl font-extrabold text-indigo-700 mb-2">{matches.length}</span>
                <span className="text-lg font-semibold text-gray-700">Total Pertandingan</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Matches Section */}
        <section id="matches-section" className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Pertandingan</h2>

          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-8 overflow-x-auto">
            <button
              className={`pb-2 border-b-2 whitespace-nowrap ${filter === 'all' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-600 hover:text-indigo-600 transition'}`}
              onClick={() => setFilter('all')}
            >
              Semua Pertandingan
            </button>
            <button
              className={`pb-2 border-b-2 whitespace-nowrap ${filter === 'ongoing' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-600 hover:text-indigo-600 transition'}`}
              onClick={() => setFilter('ongoing')}
            >
              Sedang Berlangsung
            </button>
            <button
              className={`pb-2 border-b-2 whitespace-nowrap ${filter === 'upcoming' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-600 hover:text-indigo-600 transition'}`}
              onClick={() => setFilter('upcoming')}
            >
              Akan Datang
            </button>
            <button
              className={`pb-2 border-b-2 whitespace-nowrap ${filter === 'past' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-600 hover:text-indigo-600 transition'}`}
              onClick={() => setFilter('past')}
            >
              Selesai
            </button>
          </div>

          <div className="space-y-8">
            {/* Render sections based on filter */}
            {/* Ongoing Matches */}
            {(filter === 'all' || filter === 'ongoing') && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sedang Berlangsung</h3>
                {matchesSekarang.length > 0 ? (
                  <div className="relative">
                    <Slider {...getSliderSettings(matchesSekarang.length)}>
                      {matchesSekarang.map(match => (
                        <div key={match.id} className="px-2">
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  filter === 'all' ? (
                    <div className="text-gray-500 px-4 py-8 text-center">Tidak ada pertandingan yang sedang berlangsung saat ini.</div>
                  ) : (
                    <div className="text-gray-500 px-4 py-8 text-center">Tidak ada pertandingan Sedang Berlangsung yang tersedia.</div>
                  )
                )}
              </div>
            )}

            {/* Upcoming Matches */}
            {(filter === 'all' || filter === 'upcoming') && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Akan Datang</h3>
                {matchesAkanDatang.length > 0 ? (
                  <div className="relative">
                    <Slider {...getSliderSettings(matchesAkanDatang.length)}>
                      {matchesAkanDatang.map(match => (
                        <div key={match.id} className="px-2">
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  filter === 'all' ? (
                    <div className="text-gray-500 px-4 py-8 text-center">Tidak ada pertandingan akan datang.</div>
                  ) : (
                    <div className="text-gray-500 px-4 py-8 text-center">Tidak ada pertandingan Akan Datang yang tersedia.</div>
                  )
                )}
              </div>
            )}

            {/* Past Matches */}
            {(filter === 'all' || filter === 'past') && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selesai</h3>
                {matchesLalu.length > 0 ? (
                  <div className="relative">
                    <Slider {...getSliderSettings(matchesLalu.length)}>
                      {matchesLalu.map(match => (
                        <div key={match.id} className="px-2">
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  filter === 'all' ? (
                    <div className="text-gray-500 px-4 py-8 text-center">Tidak ada pertandingan selesai ditemukan.</div>
                  ) : (
                    <div className="text-gray-500 px-4 py-8 text-center">Tidak ada pertandingan Selesai yang tersedia.</div>
                  )
                )}
              </div>
            )}

            {/* Message when no matches available for the selected filter */}
            {filter !== 'all' && 
             ((filter === 'ongoing' && matchesSekarang.length === 0) ||
              (filter === 'upcoming' && matchesAkanDatang.length === 0) ||
              (filter === 'past' && matchesLalu.length === 0)) && (
               <div className="text-gray-500 px-4 py-8 text-center text-lg">Tidak ada pertandingan tersedia untuk kategori ini.</div>
            )}

             {/* Pesan jika tidak ada pertandingan sama sekali dan filter 'all' aktif */}
            {filter === 'all' && matchesLalu.length === 0 && matchesSekarang.length === 0 && matchesAkanDatang.length === 0 && (
               <div className="text-gray-500 px-4 py-8 text-center text-lg">Tidak ada pertandingan tersedia.</div>
            )}
          </div>
        </section>

        {/* Medal Tally Section */}
        <section id="medals-section" className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Rekap Medali</h2>
          <MedalTally medals={medalTally} />
        </section>

        {/* Sports Section */}
        <section id="sports-section">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Olahraga</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sports.map((sport) => (
              <Link key={sport.id} href={`/sports/${sport.id}`} className="block group">
                <SportCard sport={sport} />
              </Link>
            ))}
            {sports.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">
                Tidak ada olahraga tersedia
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Info Section at the bottom */}
      <section id="contact-section" className="w-full bg-indigo-50 border-t border-gray-200 py-12 mt-8">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700 text-sm">

          {/* Alamat */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-indigo-700 mb-2">Hubungi Kami</h3>
            <p className="mb-4 text-gray-700">Hubungi kami untuk pertanyaan atau informasi mengenai festival.</p>
            <h4 className="font-semibold text-gray-900 mb-2">Alamat</h4>
            <p>
              PT Kalventis Sinergi Farma<br/>
              Jl. Jend. Ahmad Yani No. 2<br/>
              Kayu Putih, Pulogadung<br/>
              Jakarta Timur 13210 - Indonesia
            </p>
         
          </div>

          {/* Kontak & Peta */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-indigo-700 mb-4">Kontak Kami</h3>
            <p className="mb-4 text-gray-900 font-semibold">(021) 5089 5000</p>
            <a href="https://kalve.id/kalventismap" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-700 transition flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              View on map
            </a>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-indigo-700 mb-4">Ikuti Kami</h3>
            <div className="flex flex-col space-y-2">
              <a href="https://instagram.com/kalventis" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700 transition flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Instagram
              </a>
              <a href="https://www.youtube.com/@kalventis" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700 transition flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a2.49 2.49 0 0 1-2-2.49V9a2.49 2.49 0 0 1 2-2.49C4.64 6 10 6 12 6s7.36 0 9.5 2.02A2.5 2.5 0 0 1 24 9v5.51a2.5 2.5 0 0 1-2.5 2.49C19.36 17 14 17 12 17s-7.36 0-9.5-2.02Z"/><path d="m10 15 5-3-5-3v6Z"/></svg>
                Youtube
              </a>
              <a href="https://www.linkedin.com/company/kalventis/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700 transition flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2c-1 0-2 1-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
