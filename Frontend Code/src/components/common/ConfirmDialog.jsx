import React from 'react'
import Modal from './Modal'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-slate-600 mb-6">{message}</p>
      <div className="flex items-center justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors">
          {cancelText}
        </button>
        <button 
          onClick={() => { onConfirm(); onClose() }}
          className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
            type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
