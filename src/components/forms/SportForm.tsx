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
  { label: 'Exhibition', value: 'exhibition' },
];

export default function SportForm({ sport, onSubmit, onCancel }: SportFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(sport?.imageurl || '');
  const [mediaLink, setMediaLink] = useState<string>(sport?.media_link || '');
  const [kategori, setKategori] = useState<string>(sport?.kategori || 'sport');
  const [isFootball, setIsFootball] = useState<boolean>(sport?.is_football || false);
  const [rules, setRules] = useState<string>(sport?.rules || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      name: formData.get('name') as string,
      imageurl: imageUrl,
      media_link: mediaLink,
      kategori: kategori,
      is_football: isFootball,
      rules: rules,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-start overflow-auto pt-10 z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-5xl mx-4 md:mx-0 border border-gray-700 text-gray-100">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {sport ? 'Edit Sport' : 'Create Sport'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Informasi Dasar */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Informasi Dasar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sport Name */}
                <div>
                  <label className="block mb-2 font-medium">Sport Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={sport?.name}
                    required
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block mb-2 font-medium">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  >
                    {kategoriOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-gray-900 text-gray-100"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div>
                  <label className="block mb-2 font-medium">Image (max 1MB)</label>
                  <ImageUploader
                    currentUrl={imageUrl}
                    onUpload={setImageUrl}
                    folder="upload"
                  />
                </div>

                {/* Media Link */}
                <div>
                  <label className="block mb-2 font-medium">Media Link</label>
                  <input
                    type="url"
                    value={mediaLink}
                    onChange={(e) => setMediaLink(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Informasi Tambahan</h3>
              
              {/* Rules */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Rules</label>
                <textarea
                  name="rules"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  placeholder="Masukkan aturan/penjelasan olahraga..."
                />
              </div>

              {/* Checkbox Is Football */}
              {/* <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFootball"
                  checked={isFootball}
                  onChange={(e) => setIsFootball(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border border-gray-700 rounded checked:bg-blue-500 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isFootball" className="font-medium select-none">
                  Tandai jika ini adalah olahraga Sepak Bola
                </label>
              </div>
              <p className="text-sm text-gray-400 mt-1">Jika ini bukan sepak bola, abaikan saja.</p> */}
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-700 rounded hover:bg-gray-600 transition text-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition text-white"
              >
                {sport ? 'Update' : 'Create'} Sport
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
