'use client'

import { Sport } from '@/types/database.types'
import { useEffect, useState } from 'react'
import { uploadFile } from '@/lib/storage'

interface SportFormProps {
  sport?: Sport
  onSubmit: (data: Partial<Sport>) => void
  onCancel: () => void
}

export default function SportForm({ sport, onSubmit, onCancel }: SportFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(sport?.imageurl || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ Sinkronisasi imageUrl jika sport berubah
  useEffect(() => {
    setImageUrl(sport?.imageurl || '')
  }, [sport])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }
    if (file.size > 1024 * 1024) {
      setError('Ukuran gambar maksimal 1MB')
      return
    }

    setUploading(true)
    setError(null)

    const result = await uploadFile(file, 'images', imageUrl, 'upload') // oldFileUrl = imageUrl
    if ('error' in result) {
      setError('Gagal upload gambar: ' + result.error)
      setImageUrl('')
    } else {
      setImageUrl(result.url)
    }

    setUploading(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit({
      name: formData.get('name') as string,
      imageurl: imageUrl,
    })
  }

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
          disabled={uploading}
        >
          {sport ? 'Update' : 'Create'} Sport
        </button>
      </div>
    </form>
  )
}
