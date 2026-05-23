import { useState, useMemo } from 'react';
import { Search, Plus, AlertTriangle, Package, Edit2, Trash2 } from 'lucide-react';
import ItemForm      from './ItemForm';
import ConfirmDelete from './ConfirmDelete';

const SEED_ITEMS = [
  { id: 1,  name: 'CAT6 Patch Cable (1ft)',  quantity: 4,  category: 'Hardware',        threshold: 10, notes: 'Blue cables, patch panel use' },
  { id: 2,  name: 'SC/APC Connector',        quantity: 2,  category: 'Hardware',        threshold: 20, notes: 'Single-mode fiber termination' },
  { id: 3,  name: 'ONT - Calix 803G',        quantity: 12, category: 'Electronics',     threshold: 5,  notes: '' },
  { id: 4,  name: 'Drop Wire (100ft coil)',   quantity: 0,  category: 'Hardware',        threshold: 5,  notes: 'Out of stock — reorder pending' },
  { id: 5,  name: 'Fiber Splice Tray',       quantity: 8,  category: 'Tools',           threshold: 3,  notes: '' },
  { id: 6,  name: 'Safety Glasses',          quantity: 3,  category: 'Safety',          threshold: 10, notes: 'ANSI Z87.1 rated' },
  { id: 7,  name: 'Cable Staples (box)',      quantity: 22, category: 'Hardware',        threshold: 5,  notes: '' },
  { id: 8,  name: 'Label Printer Tape',      quantity: 1,  category: 'Office Supplies', threshold: 4,  notes: 'Brother TZe-231' },
  { id: 9,  name: 'Ground Rod Clamp',        quantity: 6,  category: 'Hardware',        threshold: 5,  notes: '' },
  { id: 10, name: 'Hi-Vis Vest',             quantity: 9,  category: 'Safety',          threshold: 5,  notes: '' },
];

let nextId = SEED_ITEMS.length + 1;

export default function Dashboard({ user, onLogout }) {
  const [items,      setItems]      = useState(SEED_ITEMS);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [showForm,   setShowForm]   = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const lowStockItems = useMemo(
    () => items.filter(i => i.quantity < i.threshold),
    [items]
  );

  const displayItems = useMemo(() => {
    let list = filter === 'low' ? lowStockItems : items;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, lowStockItems, filter, search]);

  function handleSave(data) {
    if (data.id) {
      setItems(prev => prev.map(i => i.id === data.id ? data : i));
    } else {
      setItems(prev => [...prev, { ...data, id: nextId++ }]);
    }
    setShowForm(false);
    setEditItem(null);
  }

  function handleDelete() {
    setItems(prev => prev.filter(i => i.id !== deleteItem.id));
    setDeleteItem(null);
  }

  function adjustQty(id, delta) {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ));
  }

  function openEdit(item) {
    setEditItem(item);
    setShowForm(true);
  }

  function openAdd() {
    setEditItem(null);
    setShowForm(true);
  }

  return (
    <div className="app-shell">

      <header className="topbar">
        <div className="topbar-logo">Stock<span>Track</span></div>
        <div className="topbar-right">
          <span className="topbar-user">{user}</span>
          <button className="topbar-logout" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      {lowStockItems.length > 0 && (
        <div className="alert-banner">
          <AlertTriangle size={14} />
          <span>
            <span className="alert-items">{lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''}</span>
            {' '}below threshold:{' '}
            {lowStockItems.map(i => i.name).join(', ')}
          </span>
        </div>
      )}

      <main className="main-area">

        <div className="stats-bar">
          <div className="stat-cell">
            <div className="stat-label">Total Items</div>
            <div className="stat-value accent">{items.length}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">In Stock</div>
            <div className="stat-value success">{items.filter(i => i.quantity >= i.threshold).length}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Low Stock</div>
            <div className="stat-value danger">{lowStockItems.length}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Out of Stock</div>
            <div className="stat-value danger">{items.filter(i => i.quantity === 0).length}</div>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-wrap">
              <Search size={14} />
              <input
                className="search-input"
                placeholder="Search items or categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="low">Low Stock Only</option>
            </select>
          </div>
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Adjust</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <Package size={28} />
                      {search ? 'No items match your search.' : 'No items yet. Add one to get started.'}
                    </div>
                  </td>
                </tr>
              ) : (
                displayItems.map(item => {
                  const isLow = item.quantity < item.threshold;
                  return (
                    <tr key={item.id} className={isLow ? 'low-stock' : ''}>
                      <td>
                        <div className="td-name">{item.name}</div>
                        {item.notes && <div className="td-sku">{item.notes}</div>}
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <span className={`td-qty ${isLow ? 'low' : 'ok'}`}>
                          {item.quantity}
                        </span>
                        <span style={{ color: 'var(--text-faint)', fontFamily: 'var(--mono)', fontSize: 10, marginLeft: 4 }}>
                          / {item.threshold}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isLow ? 'badge-low' : 'badge-ok'}`}>
                          {item.quantity === 0 ? 'Out of Stock' : isLow ? 'Low' : 'OK'}
                        </span>
                      </td>
                      <td>
                        <div className="qty-controls">
                          <button className="qty-btn" onClick={() => adjustQty(item.id, -1)}>−</button>
                          <button className="qty-btn" onClick={() => adjustQty(item.id, +1)}>+</button>
                        </div>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon"        onClick={() => openEdit(item)}><Edit2  size={13} /></button>
                          <button className="btn-icon delete" onClick={() => setDeleteItem(item)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </main>

      {showForm && (
        <ItemForm
          item={editItem}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      {deleteItem && (
        <ConfirmDelete
          item={deleteItem}
          onConfirm={handleDelete}
          onClose={() => setDeleteItem(null)}
        />
      )}

    </div>
  );
}