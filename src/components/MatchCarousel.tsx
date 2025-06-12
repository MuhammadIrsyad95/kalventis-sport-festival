// components/MatchCarousel.tsx
'use client';

import Slider from 'react-slick';
import MatchCard from './MatchCard';
import type { Database } from '@/types/supabase';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
    infinite: true, // terus bergerak
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

export default function MatchCarousel({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <div className="text-gray-700 px-4 py-8 text-center text-lg">Tidak ada pertandingan tersedia.</div>;
  }

  return (
    <Slider {...getSliderSettings(matches.length)}>
      {matches.map((match) => (
        <div key={match.id} className="px-2">
          <div
            className="
              border border-gray-200 rounded-2xl shadow-sm 
              transition duration-300 ease-in-out
              hover:shadow-md hover:border-gray-400
              hover:scale-105 active:scale-95 cursor-pointer
            "
          >
            <MatchCard match={match} />
          </div>
        </div>
      ))}
    </Slider>
  );
}
