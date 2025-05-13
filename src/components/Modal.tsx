'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-800 rounded-lg border-2 border-gray-600 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-700">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-200 modal-content">
          <style jsx global>{`
            .modal-content input[type="text"],
            .modal-content input[type="number"],
            .modal-content input[type="email"],
            .modal-content input[type="password"],
            .modal-content input[type="date"],
            .modal-content input[type="datetime-local"],
            .modal-content select,
            .modal-content textarea {
              width: 100%;
              padding: 0.5rem;
              border-radius: 0.375rem;
              border: 1px solid #4b5563;
              background-color: #374151;
              color: #f3f4f6;
              margin-bottom: 1rem;
              outline: none;
            }
            
            .modal-content input:focus,
            .modal-content select:focus,
            .modal-content textarea:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
            }
            
            .modal-content label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
              color: #d1d5db;
            }
            
            .modal-content button {
              border-radius: 0.375rem;
              padding: 0.5rem 1rem;
              font-weight: 500;
              transition: all 0.2s;
            }
            
            .modal-content button[type="submit"],
            .modal-content button.primary {
              background-color: #3b82f6;
              color: white;
              border: 1px solid transparent;
            }
            
            .modal-content button[type="submit"]:hover,
            .modal-content button.primary:hover {
              background-color: #2563eb;
            }
            
            .modal-content button[type="button"]:not(.primary) {
              background-color: #374151;
              color: #e5e7eb;
              border: 1px solid #4b5563;
            }
            
            .modal-content button[type="button"]:not(.primary):hover {
              background-color: #4b5563;
            }
          `}</style>
          
          {children}
        </div>
      </div>
    </div>
  )
} 