'use client';

import { Sport } from '@/types/database.types';
import { useState } from 'react';
import ImageUploader from '@/components/upload/ImageUploader';

interface SportFormProps {
  sport?: Sport;
  onSubmit: (data: Partial<Sport>) => void;
  onCancel: () => void;
}

export default function SportForm({ sport, onSubmit, onCancel }: SportFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(sport?.imageurl || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get('name') as string,
      imageurl: imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">Sport Name</label>
        <input
          type="text"
          name="name"
          defaultValue={sport?.name}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Image (max 1MB)</label>
        <ImageUploader
          currentUrl={sport?.imageurl}
          onUpload={(url) => setImageUrl(url)}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {sport ? 'Update' : 'Create'} Sport
        </button>
      </div>
    </form>
  );
}
