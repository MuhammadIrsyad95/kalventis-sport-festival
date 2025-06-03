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
    <div className="bg-white rounded-2xl shadow-xl p-6 h-full flex flex-col items-center border border-gray-100 group hover:shadow-2xl transition">
      <img
        src={sport.imageurl || '/default-image.png'}
        alt={sport.name}
        className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition"
      />
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition text-center truncate w-full">
        {sport.name}
      </h3>
    </div>
  );
} 