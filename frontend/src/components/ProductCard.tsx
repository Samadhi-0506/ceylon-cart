import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props { product: Product; }

const ProductCard = ({ product }: Props) => {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.product._id === product._id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const categoryObj = typeof product.category === 'object' ? product.category : null;

  return (
    <Link to={`/product/${product._id}`}
      className="group card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 aspect-[4/3]">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'; }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">⭐ Featured</span>
          )}
          {discount > 0 && (
            <span className="badge bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300">-{discount}%</span>
          )}
        </div>
        {/* Stock indicator */}
        {product.stock < 10 && (
          <div className="absolute bottom-2 right-2">
            <span className="badge bg-orange-100 text-orange-600 dark:bg-orange-900/60 dark:text-orange-300">
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        {categoryObj && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">{categoryObj.icon}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{categoryObj.name}</span>
          </div>
        )}

        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2 group-hover:text-ceylon-600 dark:group-hover:text-ceylon-400 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-200 dark:fill-gray-600'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Rs. {product.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400">/{product.unit}</span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              added
                ? 'bg-jade-500 text-white scale-95'
                : inCart
                ? 'bg-ceylon-100 text-ceylon-700 dark:bg-ceylon-900/30 dark:text-ceylon-400'
                : 'bg-ceylon-500 hover:bg-ceylon-600 text-white hover:shadow-md active:scale-95'
            }`}>
            {added ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Added</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>{inCart ? 'Add More' : 'Add'}</>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
