import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        const catId = typeof res.data.category === 'object' ? res.data.category._id : res.data.category;
        const relRes = await api.get(`/products?category=${catId}&limit=4`);
        setRelated(relRes.data.products.filter((p: Product) => p._id !== id));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-ceylon-400 border-t-transparent rounded-full" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  );

  const category = typeof product.category === 'object' ? product.category : null;
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />
      <div className="pt-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-8">
          <Link to="/" className="hover:text-ceylon-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ceylon-500 transition-colors">Shop</Link>
          {category && (<><span>/</span><Link to={`/shop/${category.slug}`} className="hover:text-ceylon-500 transition-colors">{category.name}</Link></>)}
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl overflow-hidden aspect-square">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'; }}
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  -{discount}% OFF
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  ⭐ Featured
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {category && (
              <Link to={`/shop/${category.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-ceylon-600 dark:text-ceylon-400 mb-3 w-fit hover:underline">
                <span className="text-lg">{category.icon}</span> {category.name}
              </Link>
            )}

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-200 dark:fill-gray-600'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">Rs. {product.price.toLocaleString()}</span>
              <span className="text-gray-400 text-lg">/ {product.unit}</span>
            </div>
            {product.originalPrice && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                <span className="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Save Rs. {(product.originalPrice - product.price).toLocaleString()}</span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{product.description}</p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <span key={tag} className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">#{tag}</span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? 'bg-jade-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Cart */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-lg">
                  −
                </button>
                <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-lg">
                  +
                </button>
              </div>

              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                  added ? 'bg-jade-500 text-white' : 'btn-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}>
                {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
              </button>
            </div>

            {/* Total price preview */}
            {qty > 1 && (
              <div className="bg-ceylon-50 dark:bg-ceylon-900/20 border border-ceylon-100 dark:border-ceylon-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                Total for {qty} {product.unit}: <strong className="text-ceylon-700 dark:text-ceylon-400">Rs. {(product.price * qty).toLocaleString()}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
