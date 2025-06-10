'use client';

import Slider from 'react-slick';
import MatchCard from './MatchCard';
import type { Database } from '@/types/supabase';

type Match = Database['public']['Tables']['matches']['Row'];

export default function MatchCarousel({ matches }: { matches: Match[] }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(3, matches.length),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {matches.map((match) => (
        <div key={match.id} className="px-2">
          <MatchCard match={match} />
        </div>
      ))}
    </Slider>
  );
}
