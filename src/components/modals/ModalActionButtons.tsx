'use client';

import React from 'react';

interface ModalActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  cancelText?: string;
  saveText?: string;
  disabled?: boolean;
}

export default function ModalActionButtons({
  onCancel,
  onSave,
  saving = false,
  cancelText = 'Cancel',
  saveText = 'Simpan Perubahan',
  disabled = false,
}: ModalActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 bg-gray-700 rounded hover:bg-gray-600 transition text-gray-100"
        disabled={disabled || saving}
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition text-white"
        disabled={disabled || saving}
      >
        {saving ? 'Menyimpan...' : saveText}
      </button>
    </div>
  );
}
