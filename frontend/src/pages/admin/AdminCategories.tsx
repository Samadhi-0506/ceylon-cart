import React, { useEffect, useState, useCallback } from 'react';
import { Category } from '../../types';
import api from '../../utils/api';

const emptyForm = { name: '', description: '', image: '', color: '#10b981', icon: '🛒' };

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setError(''); setShowModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description, image: c.image, color: c.color, icon: c.icon }); setError(''); setShowModal(true); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editing) { await api.put(`/categories/${editing._id}`, form); }
      else { await api.post('/categories', form); }
      setShowModal(false);
      fetchCategories();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(c => c.filter(x => x._id !== id));
      setConfirmDelete(null);
    } catch { setError('Delete failed'); }
  };

  const emojiOptions = ['🛒','🥦','🍍','🍰','🍪','🥛','🌶️','🌾','🍵','🫚','🥩','🍞','🧁','🧄','🫛'];

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Categories 📂</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card p-5 h-32 animate-pulse bg-gray-200 dark:bg-gray-700" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="card p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = ''; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl" style={{ backgroundColor: cat.color + '22' }}>
                    {cat.icon}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{cat.icon}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">✏️</button>
                    <button onClick={() => setConfirmDelete(cat._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">🗑️</button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-gray-400 font-mono">{cat.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" required placeholder="e.g. Vegetables" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input-field resize-none" placeholder="Short description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="color" value={form.color} onChange={handleChange} className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer" />
                    <input name="color" value={form.color} onChange={handleChange} className="input-field font-mono text-sm py-2.5" placeholder="#10b981" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Icon</label>
                  <input name="icon" value={form.icon} onChange={handleChange} className="input-field text-2xl" placeholder="🥦" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Emoji Picker</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map(e => (
                    <button key={e} type="button" onClick={() => setForm(f => ({ ...f, icon: e }))}
                      className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-colors ${form.icon === e ? 'bg-ceylon-100 ring-2 ring-ceylon-500 dark:bg-ceylon-900/30' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : editing ? '💾 Update' : '➕ Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-scale-in text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Delete Category?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Products in this category will lose their category assignment.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
