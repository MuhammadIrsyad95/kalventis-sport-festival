'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Dasbor Admin</h1>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Kartu Dasbor */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Pertandingan</h3>
          <p className="text-gray-400">Kelola semua pertandingan turnamen</p>
          <button 
            onClick={() => router.push('/admin/matches')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lihat Pertandingan
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Tim</h3>
          <p className="text-gray-400">Kelola semua tim peserta</p>
          <button 
            onClick={() => router.push('/admin/teams')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lihat Tim
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Cabang Olahraga</h3>
          <p className="text-gray-400">Kelola kategori cabang olahraga</p>
          <button 
            onClick={() => router.push('/admin/sports')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lihat Olahraga
          </button>
        </div>
      </div>
    </div>
  );
}
