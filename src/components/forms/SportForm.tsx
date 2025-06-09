'use client';

import { Sport } from '@/types/database.types';
import { useState } from 'react';
import ImageUploader from '@/components/upload/ImageUploader';

interface SportFormProps {
  sport?: Sport;
  onSubmit: (data: Partial<Sport>) => void;
  onCancel: () => void;
}

const kategoriOptions = [
  { label: 'Sport', value: 'sport' },
  { label: 'Esport', value: 'esport' },
  { label: 'Fun Games', value: 'fungames' },
];

export default function SportForm({ sport, onSubmit, onCancel }: SportFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(sport?.imageurl || '');
  const [mediaLink, setMediaLink] = useState<string>(sport?.media_link || '');
  const [kategori, setKategori] = useState<string>(sport?.kategori || 'sport');
  const [rules, setRules] = useState<string>(sport?.rules || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      name: formData.get('name') as string,
      kategori,
      rules,
      media_link: mediaLink,
      imageurl: imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 overflow-auto pt-10 flex justify-center items-start">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg w-full max-w-6xl mx-4 md:mx-0 text-gray-100">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Judul */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {sport ? 'Edit Sport' : 'Create Sport'}
            </h2>
          </div>

          {/* Konten 2 kolom */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Kolom kiri */}
            <div className="flex-1 space-y-6">
              {/* Nama */}
              <div>
                <label htmlFor="name" className="block font-semibold text-gray-200 mb-1">Nama Olahraga</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={sport?.name}
                  required
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Kategori */}
              <div>
                <label htmlFor="kategori" className="block font-semibold text-gray-200 mb-1">Kategori</label>
                <select
                  id="kategori"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {kategoriOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Rules */}
              <div>
                <label htmlFor="rules" className="block font-semibold text-gray-200 mb-1">Rules / Penjelasan</label>
                <textarea
                  id="rules"
                  name="rules"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  rows={8}
                  placeholder="Masukkan aturan/penjelasan olahraga..."
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Kolom kanan */}
            <div className="flex-1 space-y-6">
              {/* Media Link */}
              <div>
                <label htmlFor="media_link" className="block font-semibold text-gray-200 mb-1">Media Link (YouTube, dll.)</label>
                <input
                  type="url"
                  id="media_link"
                  value={mediaLink}
                  onChange={(e) => setMediaLink(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block font-semibold text-gray-200 mb-1">Upload Gambar (max 1MB)</label>
                <ImageUploader
                  currentUrl={imageUrl}
                  onUpload={setImageUrl}
                  folder="upload"
                />
              </div>
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {sport ? 'Simpan Perubahan' : 'Tambah Olahraga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
