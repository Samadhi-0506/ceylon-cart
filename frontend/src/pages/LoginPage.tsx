import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceylon-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12 page-enter">
      {/* Theme toggle */}
      <button onClick={toggleTheme} className="fixed top-4 right-4 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        {dark ? '☀️' : '🌙'}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-gradient-to-br from-ceylon-400 to-ceylon-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-2xl">🥥</span>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">Ceylon</span>
              <span className="font-display text-2xl font-bold text-ceylon-500">Cart</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-1">Welcome back!</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-field" required autoFocus />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-field pr-12" required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : '🔑 Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs">
            <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">🧪 Demo Accounts:</p>
            <button onClick={() => { setEmail('admin@ceyloncart.lk'); setPassword('Admin@123'); }}
              className="block text-amber-600 dark:text-amber-400 hover:underline">Admin: admin@ceyloncart.lk / Admin@123</button>
            <button onClick={() => { setEmail('user@ceyloncart.lk'); setPassword('User@123'); }}
              className="block text-amber-600 dark:text-amber-400 hover:underline mt-0.5">User: user@ceyloncart.lk / User@123</button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-ceylon-600 dark:text-ceylon-400 font-semibold hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
