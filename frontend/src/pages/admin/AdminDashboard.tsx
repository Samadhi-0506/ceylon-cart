import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardStats, Order } from '../../types';
import api from '../../utils/api';

const statusColor: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shipped:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered:  'bg-jade-100 text-jade-700 dark:bg-jade-900/20 dark:text-jade-400',
  cancelled:  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const StatCard = ({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color: string }) => (
  <div className="card p-5 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/dashboard-stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="card p-5 h-24 animate-pulse bg-gray-200 dark:bg-gray-700" />)}
      </div>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="space-y-6 page-enter">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Dashboard 📊</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon="💰" label="Total Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} sub="All time" color="bg-ceylon-100 dark:bg-ceylon-900/20" />
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} sub={`${stats.pendingOrders} pending`} color="bg-blue-100 dark:bg-blue-900/20" />
        <StatCard icon="⏳" label="Pending Orders" value={stats.pendingOrders} sub="Need attention" color="bg-amber-100 dark:bg-amber-900/20" />
        <StatCard icon="👥" label="Total Users" value={stats.totalUsers} sub="Registered" color="bg-purple-100 dark:bg-purple-900/20" />
        <StatCard icon="🛒" label="Products" value={stats.totalProducts} sub="Active listings" color="bg-jade-100 dark:bg-jade-900/20" />
        <StatCard icon="📂" label="Categories" value={stats.totalCategories} sub="Active" color="bg-pink-100 dark:bg-pink-900/20" />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/admin/products', label: 'Add Product', icon: '➕', desc: 'New listing' },
            { to: '/admin/categories', label: 'Add Category', icon: '📂', desc: 'New category' },
            { to: '/admin/orders', label: 'View Orders', icon: '📦', desc: 'Manage orders' },
            { to: '/admin/users', label: 'View Users', icon: '👥', desc: 'Manage users' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className="card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-center group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{a.icon}</div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{a.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-ceylon-600 dark:text-ceylon-400 hover:underline">View all →</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {stats.recentOrders.map((order: Order) => {
                  const customer = typeof order.user === 'object' ? order.user : null;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-sm text-gray-700 dark:text-gray-200">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{customer?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Rs. {order.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusColor[order.status] || ''}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
