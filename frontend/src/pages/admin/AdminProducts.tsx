import React, { useEffect, useState, useCallback } from 'react';
import { Product, Category } from '../../types';
import api from '../../utils/api';

const emptyForm = {
  name: '', description: '', price: '', originalPrice: '', image: '',
  category: '', stock: '100', unit: 'kg', isFeatured: false, tags: ''
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(typeof emptyForm === 'object' ? { ...emptyForm } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.get('/products?limit=100'), api.get('/categories')]);
      setProducts(pRes.data.products);
      setCategories(cRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setError(''); setShowModal(true); };

  const openEdit = (p: Product) => {
    const cat = typeof p.category === 'object' ? p.category._id : p.category;
    setEditing(p);
    setForm({
      name: p.name, description: p.description,
      price: String(p.price), originalPrice: String(p.originalPrice || ''),
      image: p.image, category: cat, stock: String(p.stock),
      unit: p.unit, isFeatured: p.isFeatured, tags: p.tags.join(', ')
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        name: form.name, description: form.description,
        price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        image: form.image, category: form.category,
        stock: Number(form.stock), unit: form.unit,
        isFeatured: form.isFeatured,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      };
      if (editing) { await api.put(`/products/${editing._id}`, payload); }
      else { await api.post('/products', payload); }
      setShowModal(false);
      fetchAll();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
      setConfirmDelete(null);
    } catch { setError('Delete failed'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (typeof p.category === 'object' && p.category.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Products 🛒</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 py-2.5 text-sm" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.map(p => {
                  const cat = typeof p.category === 'object' ? p.category : null;
                  return (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'; }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[180px]">{p.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">/{p.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {cat && <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{cat.icon} {cat.name}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">Rs. {p.price.toLocaleString()}</div>
                        {p.originalPrice && <div className="text-xs text-gray-400 line-through">Rs. {p.originalPrice.toLocaleString()}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${p.stock > 10 ? 'bg-jade-100 text-jade-700 dark:bg-jade-900/20 dark:text-jade-400' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${p.isFeatured ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {p.isFeatured ? '⭐ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm" title="Edit">✏️</button>
                          <button onClick={() => setConfirmDelete(p._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="input-field" required placeholder="e.g. Ceylon Cinnamon" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" required placeholder="Product description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (Rs.) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" required min="0" placeholder="250" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Original Price (Rs.)</label>
                  <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} className="input-field" min="0" placeholder="300 (optional)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit *</label>
                  <input name="unit" value={form.unit} onChange={handleChange} className="input-field" required placeholder="kg, g, piece, bunch, pack..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="input-field" min="0" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" name="isFeatured" id="isFeatured" checked={form.isFeatured as boolean} onChange={handleChange} className="w-4 h-4 rounded text-ceylon-500" />
                  <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-300">⭐ Featured product</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="fresh, organic, local" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : editing ? '💾 Update Product' : '➕ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-scale-in text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This action cannot be undone.</p>
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

export default AdminProducts;
