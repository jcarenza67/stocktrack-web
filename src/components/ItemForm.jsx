import { useState } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Hardware', 'Office Supplies', 'Tools', 'Safety', 'Uncategorized'];

function initForm(item) {
  if (!item) return { name: '', quantity: '', category: 'Uncategorized', threshold: '5', notes: '' };
  return {
    name:      item.name,
    quantity:  String(item.quantity),
    category:  item.category,
    threshold: String(item.threshold),
    notes:     item.notes || '',
  };
}

export default function ItemForm({ item, onSave, onClose }) {
  const [form,   setForm]   = useState(() => initForm(item));
  const [errors, setErrors] = useState({});

  const isEdit = !!item;

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())
      errs.name = 'Item name is required.';
    if (form.quantity === '')
      errs.quantity = 'Quantity is required.';
    else if (isNaN(form.quantity) || Number(form.quantity) < 0)
      errs.quantity = 'Quantity must be a non-negative number.';
    if (form.threshold === '' || isNaN(form.threshold) || Number(form.threshold) < 0)
      errs.threshold = 'Threshold must be a non-negative number.';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onSave({
      ...(item || {}),
      name:      form.name.trim(),
      quantity:  Number(form.quantity),
      category:  form.category,
      threshold: Number(form.threshold),
      notes:     form.notes.trim(),
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Item' : 'Add Item'}</span>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              className={`form-input${errors.name ? ' error' : ''}`}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. CAT6 Patch Cable"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                className={`form-input${errors.quantity ? ' error' : ''}`}
                type="number"
                min="0"
                value={form.quantity}
                onChange={e => set('quantity', e.target.value)}
                placeholder="0"
              />
              {errors.quantity && <span className="form-error">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Low-Stock Threshold</label>
              <input
                className={`form-input${errors.threshold ? ' error' : ''}`}
                type="number"
                min="0"
                value={form.threshold}
                onChange={e => set('threshold', e.target.value)}
                placeholder="5"
              />
              {errors.threshold && <span className="form-error">{errors.threshold}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select form-input"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional notes about this item..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary"   onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}