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