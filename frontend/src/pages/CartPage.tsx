import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { items, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4">
        <div className="text-8xl animate-bounce-gentle">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">Looks like you haven't added anything yet. Start shopping!</p>
        <Link to="/shop" className="btn-primary mt-2">Browse Products</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />
      <div className="pt-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart 🛒</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium hover:underline transition-colors">
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product._id} className="card p-4 flex gap-4 animate-fade-in">
                <Link to={`/product/${item.product._id}`}>
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'; }}
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link to={`/product/${item.product._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-ceylon-600 dark:hover:text-ceylon-400 transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <button onClick={() => removeItem(item.product._id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Rs. {item.product.price.toLocaleString()} / {item.product.unit}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.product._id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold">−</button>
                      <span className="w-10 text-center text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product._id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold">+</button>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate mr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="text-gray-900 dark:text-white font-medium flex-shrink-0">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-700 dark:text-gray-200">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Delivery</span>
                  <span className={totalPrice >= 2000 ? 'text-jade-500 font-medium' : 'text-gray-700 dark:text-gray-200'}>
                    {totalPrice >= 2000 ? '🎉 FREE' : 'Rs. 200'}
                  </span>
                </div>
                {totalPrice < 2000 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                    Add Rs. {(2000 - totalPrice).toLocaleString()} more for free delivery!
                  </p>
                )}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-ceylon-600 dark:text-ceylon-400">
                    Rs. {(totalPrice + (totalPrice >= 2000 ? 0 : 200)).toLocaleString()}
                  </span>
                </div>
              </div>

              <button onClick={handleCheckout} className="w-full btn-primary mt-6 py-3.5 text-base flex items-center justify-center gap-2">
                {user ? '🔒 Proceed to Checkout' : '🔑 Login to Checkout'}
              </button>
              <Link to="/shop" className="block text-center text-sm text-ceylon-600 dark:text-ceylon-400 hover:underline mt-3">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
