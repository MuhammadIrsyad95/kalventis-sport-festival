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

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchesRes, medalsRes, sportsRes] = await Promise.all([
          supabase
            .from('matches')
            .select('*')
            .order('round', { ascending: true }),
          supabase
            .from('medals')
            .select('*'),
          supabase
            .from('sports')
            .select('*')
        ])

        if (matchesRes.error) throw new Error(matchesRes.error.message)
        if (medalsRes.error) throw new Error(medalsRes.error.message)
        if (sportsRes.error) throw new Error(sportsRes.error.message)

        setMatches(matchesRes.data || [])
        setMedalTally(medalsRes.data || [])
        setSports(sportsRes.data || [])
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Kalventis Sport Festival
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time scores and match details for the Kalventis Sport Festival
          </p>
        </motion.section>

        {/* Matches Section */}
        <section id="matches-section" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Matches</h2>
          <div className="space-y-8">
            {matchesLalu.length === 0 && matchesSekarang.length === 0 && matchesAkanDatang.length === 0 ? (
              <div className="text-gray-400 px-4 py-8 text-center text-lg">Tidak ada pertandingan</div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Past</h3>
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
                    <div className="text-gray-400 px-4 py-8 text-center">Tidak ada pertandingan lalu</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Ongoing</h3>
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
                    <div className="text-gray-400 px-4 py-8 text-center">Tidak ada pertandingan sekarang</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Upcoming</h3>
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
                    <div className="text-gray-400 px-4 py-8 text-center">Tidak ada pertandingan akan datang</div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Medal Tally Section */}
        <section id="medals-section" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Medal Tally</h2>
          <MedalTally medals={medalTally} />
        </section>

        {/* Sports Section */}
        <section id="sports-section">
          <h2 className="text-2xl font-bold text-white mb-6">Sports</h2>
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
        </section>
      </div>

      {/* Info Section at the bottom */}
      <section id="about-section" className="w-full bg-gray-900 border-t border-gray-800 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 text-left md:pr-8">
            <h2 className="text-base md:text-lg font-semibold text-white mb-2">About Kalventis Sport Festival</h2>
            <p className="text-gray-300 text-sm md:text-base mb-0 leading-relaxed">
              Kalventis Sport Festival is an annual sports event organized by Kalventis, bringing together teams and companies to compete in a spirit of sportsmanship, unity, and excellence.
            </p>
          </div>
          <div className="flex-1 flex flex-row gap-2 md:flex-col md:items-end items-start">
            <a href="/sports" className="underline hover:text-white text-sm transition">Sport</a>
            <a href="/rules" className="underline hover:text-white text-sm transition">Rules</a>
            <a href="/about" className="underline hover:text-white text-sm transition">About</a>
          </div>
        </div>
      </section>
    </main>
  )
}
