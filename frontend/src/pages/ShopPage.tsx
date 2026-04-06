import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';
import api from '../utils/api';

const ShopPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [categorySlug, debouncedSearch]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(console.error);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const activeCategory = categories.find(c => c.slug === categorySlug);
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (activeCategory) params.set('category', activeCategory._id);
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [categorySlug, debouncedSearch, page, categories]);

  useEffect(() => {
    if (categories.length > 0) fetchProducts();
  }, [fetchProducts, categories]);

  const activeCategory = categories.find(c => c.slug === categorySlug);
  const pages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />
      <div className="pt-20" />

      {/* Hero strip */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {activeCategory ? (
                  <><span className="text-3xl">{activeCategory.icon}</span> {activeCategory.name}</>
                ) : 'All Products 🛒'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {loading ? 'Loading...' : `${total} products found`}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-7">
        {/* Sidebar categories */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="card p-4 sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Categories</h3>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => navigate('/shop')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                  !categorySlug ? 'bg-ceylon-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                <span>🛒</span> All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => navigate(`/shop/${cat.slug}`)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                    categorySlug === cat.slug ? 'bg-ceylon-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile category chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            <button onClick={() => navigate('/shop')}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                !categorySlug ? 'bg-ceylon-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}>
              🛒 All
            </button>
            {categories.map(cat => (
              <button key={cat._id} onClick={() => navigate(`/shop/${cat.slug}`)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  categorySlug === cat.slug ? 'bg-ceylon-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-72 animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or browse a different category</p>
              <button onClick={() => { setSearch(''); navigate('/shop'); }} className="btn-primary">Browse All Products</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p, i) => (
                  <div key={p._id} style={{ animationDelay: `${i * 0.05}s` }} className="animate-fade-in">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">← Prev</button>
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                        page === i + 1 ? 'bg-ceylon-500 text-white' : 'btn-secondary'
                      }`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;
