import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(u => u.filter(x => x.id !== id && (x as unknown as { _id: string })._id !== id));
      setConfirmDelete(null);
    } catch { console.error('Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Users 👥</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{adminCount} admin{adminCount !== 1 ? 's' : ''} · {userCount} customer{userCount !== 1 ? 's' : ''}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: '👥', color: 'bg-blue-100 dark:bg-blue-900/20' },
          { label: 'Admins', value: adminCount, icon: '⚙️', color: 'bg-purple-100 dark:bg-purple-900/20' },
          { label: 'Customers', value: userCount, icon: '🛒', color: 'bg-ceylon-100 dark:bg-ceylon-900/20' },
        ].map(s => (
          <div key={s.label} className={`card p-4 flex items-center gap-3 ${s.color}`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 py-2.5 text-sm" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.map((u: User & { _id?: string; createdAt?: string }) => {
                  const uid = u._id || u.id;
                  const isCurrentUser = uid === currentUser?.id;
                  return (
                    <tr key={uid} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${u.role === 'admin' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-ceylon-400 to-ceylon-600'}`}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm text-gray-900 dark:text-white">{u.name}</span>
                          {isCurrentUser && <span className="badge bg-ceylon-100 text-ceylon-600 dark:bg-ceylon-900/30 dark:text-ceylon-400 text-xs">You</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {u.role === 'admin' ? '⚙️ Admin' : '👤 User'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setConfirmDelete(uid)}
                          disabled={isCurrentUser || u.role === 'admin'}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isCurrentUser ? "Can't delete yourself" : u.role === 'admin' ? "Can't delete admin" : 'Delete user'}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-scale-in text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Delete User?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This will permanently remove the user account and all their data.</p>
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

export default AdminUsers;
