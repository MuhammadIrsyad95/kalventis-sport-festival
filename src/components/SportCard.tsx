import React from 'react';

interface SportCardProps {
  sport: {
    id: string;
    name: string;
    imageurl?: string | null;
  };
}

export default function SportCard({ sport }: SportCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/15 transition cursor-pointer h-full flex flex-col items-center shadow-lg">
      <img
        src={sport.imageurl || '/default-image.png'}
        alt={sport.name}
        className="w-full h-40 object-cover rounded mb-4 group-hover:opacity-90 transition"
      />
      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition text-center truncate w-full">
        {sport.name}
      </h3>
    </div>
  );
} 