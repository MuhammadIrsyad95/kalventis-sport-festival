'use client'

import { Sport } from '@/types/database.types'

interface SportFormProps {
  sport?: Sport
  onSubmit: (data: Partial<Sport>) => void
  onCancel: () => void
}

export default function SportForm({ sport, onSubmit, onCancel }: SportFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit({
      name: formData.get('name') as string
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Sport Name</label>
        <input
          type="text"
          name="name"
          defaultValue={sport?.name}
          className="w-full p-2 rounded-lg bg-white/5"
          placeholder="Enter sport name"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
        >
          {sport ? 'Update' : 'Create'} Sport
        </button>
      </div>
    </form>
  )
} 