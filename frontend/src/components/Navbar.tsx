import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { dark, toggleTheme } = useTheme();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location]);

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/shop',     label: 'Shop' },
    { to: '/about',    label: 'About' },
    { to: '/contact',  label: 'Contact' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/96 dark:bg-gray-950/96 backdrop-blur-xl shadow-lg shadow-black/5'
        : 'bg-white dark:bg-gray-950'
    }`}>
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-amber-500 via-ceylon-500 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {/* Logo image with fallback */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1546961342-ea5f62d3a27b?w=80&q=80"
                alt="CeylonCart logo"
                className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform ring-2 ring-amber-400/30"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback emoji logo */}
              <div className="hidden w-10 h-10 bg-gradient-to-br from-amber-400 to-ceylon-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xl">🥥</span>
              </div>
            </div>
            <div className="leading-none">
              <div className="flex items-baseline gap-0.5">
                <span className="font-display text-xl font-bold text-gray-900 dark:text-white tracking-tight">Ceylon</span>
                <span className="font-display text-xl font-bold text-amber-500 dark:text-amber-400 tracking-tight">Cart</span>
              </div>
              <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-0.5 hidden sm:block">
                Sri Lanka's Market
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                }`}>
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin"
                className="ml-1 px-4 py-2 rounded-lg text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1">

            {/* Theme toggle */}
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-500 transition-all">
              {dark
                ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              }
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-500 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-md">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User area */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(v => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-800 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-ceylon-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                      <span>📦</span> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                        <span>⚙️</span> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                    <button onClick={() => { logout(); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-amber-600 px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors ml-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-3 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.to)
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                  {{'/': '🏠', '/shop': '🛒', '/about': 'ℹ️', '/contact': '✉️'}[link.to] || ''} {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">📦 My Orders</Link>
                  {isAdmin && <Link to="/admin" className="px-4 py-3 rounded-xl text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20">⚙️ Admin Panel</Link>}
                  <button onClick={() => { logout(); navigate('/'); }} className="text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">🚪 Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Sign In</Link>
                  <Link to="/register" className="mx-4 mt-1 block text-center text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl transition-colors shadow-md">Get Started</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
