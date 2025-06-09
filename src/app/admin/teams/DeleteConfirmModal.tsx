// src/app/admin/teams/DeleteConfirmModal.tsx
'use client';

import Modal from '@/components/Modal';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ onCancel, onConfirm }: Props) {
  return (
    <Modal isOpen={true} onClose={onCancel} title="Confirm Delete">
      <div className="mt-2">
        <p className="text-sm text-gray-400">
          Are you sure you want to delete this team? This action cannot be undone.
        </p>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
