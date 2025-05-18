'use client'

import { Sport } from '@/types/database.types'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface SportFormProps {
  sport?: Sport
  onSubmit: (data: Partial<Sport>) => void
  onCancel: () => void
}

export default function SportForm({ sport, onSubmit, onCancel }: SportFormProps) {
  const [imageUrl, setImageUrl] = useState<string>(sport?.imageurl || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`
    const { data, error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
    if (uploadError) {
      setError('Gagal upload gambar')
      setUploading(false)
      return
    }
    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName)
    setImageUrl(publicUrlData.publicUrl)
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
        <label className="block mb-2 text-gray-800 dark:text-gray-200 font-medium">Sport Name</label>
        <input
          type="text"
          name="name"
          defaultValue={sport?.name}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Enter sport name"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-800 dark:text-gray-200 font-medium">Image (max 1MB)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
        {uploading && <div className="text-blue-500 text-xs mt-1">Uploading...</div>}
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
        )}
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {sport ? 'Update' : 'Create'} Sport
        </button>
      </div>
    </form>
  )
} 