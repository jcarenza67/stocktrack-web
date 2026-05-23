import { X } from 'lucide-react';

export default function ConfirmDelete({ item, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-modal">
        <div className="modal-header">
          <span className="modal-title">Delete Item</span>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="confirm-body">
          <p className="confirm-msg">
            Are you sure you want to delete{' '}
            <span className="confirm-name">{item?.name}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-danger"    onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}