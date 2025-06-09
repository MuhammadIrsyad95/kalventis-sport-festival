'use client';

import { useState, useEffect } from 'react';
import { uploadFile } from '@/lib/storage';

interface ImageUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  currentUrl = '',
  onUpload,
  folder = 'images',
  maxSizeMB = 1,
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(currentUrl);
  }, [currentUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran gambar maksimal ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    const result = await uploadFile(file, folder, imageUrl, 'upload');
    if ('error' in result) {
      setError('Gagal upload gambar: ' + result.error);
      setImageUrl('');
    } else {
      setImageUrl(result.url);
      onUpload(result.url);
    }

    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
      />
      {uploading && <div className="text-sm text-blue-500">Uploading...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="mt-2 w-24 h-24 object-cover rounded"
        />
      )}
    </div>
  );
}
