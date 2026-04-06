import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 'strong'
    : form.password.length >= 6 ? 'medium' : form.password ? 'weak' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-jade-50 to-ceylon-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12 page-enter">
      <button onClick={toggleTheme} className="fixed top-4 right-4 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        {dark ? '☀️' : '🌙'}
      </button>

      <div className="w-full max-w-md">
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
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-1">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Join the CeylonCart community</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Amara Perera" className="input-field" required autoFocus />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-field pr-12" required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {['weak', 'medium', 'strong'].map((s, i) => (
                      <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= ['weak', 'medium', 'strong'].indexOf(strength)
                          ? strength === 'strong' ? 'bg-jade-500' : strength === 'medium' ? 'bg-amber-400' : 'bg-red-400'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium capitalize ${
                    strength === 'strong' ? 'text-jade-500' : strength === 'medium' ? 'text-amber-500' : 'text-red-500'
                  }`}>{strength}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <input type={showPw ? 'text' : 'password'} name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Repeat password" className={`input-field ${form.confirm && form.confirm !== form.password ? 'border-red-400 focus:ring-red-400' : ''}`} required />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
              ) : '🚀 Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-ceylon-600 dark:text-ceylon-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
