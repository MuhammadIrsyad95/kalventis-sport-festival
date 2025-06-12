'use client'

import { useState } from 'react'
import Slider from 'react-slick'
import MatchCard from '@/components/MatchCard'
import { Database } from '@/types/supabase'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

type Match = Database['public']['Tables']['matches']['Row']

function Arrow(props: any) {
  const { style, onClick, direction } = props
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
  )
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
  }
}

export default function MatchesSection({ matches }: { matches: Match[] }) {
  const [filter, setFilter] = useState<'ongoing' | 'upcoming' | 'past'>('ongoing')

  const now = new Date()
  const matchesLalu = matches.filter(m => m.match_time && new Date(m.match_time) < new Date(now.getTime() - 2 * 60 * 60 * 1000))
  const matchesSekarang = matches.filter(m => m.match_time && Math.abs(new Date(m.match_time).getTime() - now.getTime()) <= 2 * 60 * 60 * 1000)
  const matchesAkanDatang = matches.filter(m => m.match_time && new Date(m.match_time) > new Date(now.getTime() + 2 * 60 * 60 * 1000))

  const matchList = {
    ongoing: matchesSekarang,
    upcoming: matchesAkanDatang,
    past: matchesLalu,
  }

  return (
<section id="matches-section" className="mb-12 scroll-mt-24">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: 'rgb(0, 52, 98)' }}
      >
        Pertandingan
      </h2>

      <div className="flex space-x-4 mb-8 overflow-x-auto">
        {(['ongoing', 'upcoming', 'past'] as const).map(key => (
          <button
            key={key}
            className={`pb-2 border-b-2 whitespace-nowrap ${
              filter === key
                ? 'border-[rgb(0,52,98)] text-[rgb(0,52,98)] font-semibold'
                : 'border-transparent text-gray-600 hover:text-[rgb(0,52,98)] transition'
            }`}
            onClick={() => setFilter(key)}
          >
            {key === 'ongoing' ? 'Sedang Berlangsung' : key === 'upcoming' ? 'Akan Datang' : 'Selesai'}
          </button>
        ))}
      </div>

      <div>
        {matchList[filter].length > 0 ? (
         <Slider {...getSliderSettings(matchList[filter].length)}>
          {matchList[filter].map((match) => (
            <div key={match.id} className="px-2">
              <div
                className="
                  border border-gray-200 rounded-2xl shadow-sm 
                  transition duration-300 ease-in-out
                  hover:shadow-md hover:border-gray-400
                  active:scale-95 cursor-pointer
                "
              >
                <MatchCard match={match} />
              </div>
            </div>
          ))}
        </Slider>

        ) : (
          <div className="text-gray-500 px-4 py-8 text-center">
            Tidak ada pertandingan{' '}
            {filter === 'ongoing' ? 'Sedang Berlangsung' : filter === 'upcoming' ? 'Akan Datang' : 'Selesai'} yang tersedia.
          </div>
        )}
      </div>
    </section>
  )
}
