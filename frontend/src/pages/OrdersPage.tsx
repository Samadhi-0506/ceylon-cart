import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Order } from '../types';
import api from '../utils/api';

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending:    { label: 'Pending',    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',  icon: '⏳' },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',    icon: '✅' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '⚙️' },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: '🚚' },
  delivered:  { label: 'Delivered',  color: 'bg-jade-100 text-jade-700 dark:bg-jade-900/20 dark:text-jade-400',   icon: '🎉' },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',       icon: '❌' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />
      <div className="pt-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">My Orders 📦</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track all your CeylonCart orders</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="card p-6 h-36 animate-pulse bg-gray-200 dark:bg-gray-700" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No orders yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const st = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order._id} className="card p-5 sm:p-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`badge ${st.color}`}>
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">Rs. {order.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'; }} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">×{item.quantity} — Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery info */}
                  {order.shippingAddress.city && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>📍 {[order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.province].filter(Boolean).join(', ')}</span>
                      {order.shippingAddress.phone && <span>📞 {order.shippingAddress.phone}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
