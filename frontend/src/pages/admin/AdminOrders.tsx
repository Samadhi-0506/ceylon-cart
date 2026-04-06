import React, { useEffect, useState } from 'react';
import { Order } from '../../types';
import api from '../../utils/api';

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending:    { label: 'Pending',    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',  icon: '⏳' },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',    icon: '✅' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '⚙️' },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: '🚚' },
  delivered:  { label: 'Delivered',  color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '🎉' },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',       icon: '❌' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(os => os.map(o => o._id === orderId ? { ...o, status: newStatus as Order['status'] } : o));
    } catch { console.error('Update failed'); }
    finally { setUpdatingId(null); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const counts = Object.fromEntries(
    Object.keys(statusConfig).map(s => [s, orders.filter(o => o.status === s).length])
  );

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Orders 📦</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{orders.length} total orders</p>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
          All ({orders.length})
        </button>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === key ? cfg.color + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {cfg.icon} {cfg.label} ({counts[key] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="card p-5 h-24 animate-pulse bg-gray-200 dark:bg-gray-700" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-400 dark:text-gray-500">No {filter !== 'all' ? filter : ''} orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const st = statusConfig[order.status] || statusConfig.pending;
            const customer = typeof order.user === 'object' ? order.user : null;
            const isExpanded = expandedId === order._id;

            return (
              <div key={order._id} className="card overflow-hidden">
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`badge ${st.color}`}>{st.icon} {st.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                      <span>👤 {customer?.name || 'Unknown'}</span>
                      <span>✉️ {customer?.email || 'N/A'}</span>
                      <span>📅 {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">Rs. {order.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Status update */}
                    <select
                      value={order.status}
                      onChange={e => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="input-field py-1.5 text-xs w-36 disabled:opacity-60">
                      {Object.entries(statusConfig).map(([val, cfg]) => (
                        <option key={val} value={val}>{cfg.icon} {cfg.label}</option>
                      ))}
                    </select>

                    <button onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                      <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/30 space-y-4 animate-slide-up">
                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'; }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">×{item.quantity} @ Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    {order.shippingAddress.city && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Shipping Address</h4>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}{order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ''} {order.shippingAddress.postalCode}</p>
                          {order.shippingAddress.phone && <p>📞 {order.shippingAddress.phone}</p>}
                        </div>
                      </div>
                    )}

                    {order.note && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Note</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl p-3">{order.note}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Payment: <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">{order.paymentMethod.replace('_', ' ')}</span></span>
                      <span className="font-bold text-gray-900 dark:text-white text-base">Total: Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
