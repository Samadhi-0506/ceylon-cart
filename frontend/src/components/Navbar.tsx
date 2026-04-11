import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { dark, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [scrollY, setScrollY]     = useState(0);
  const [userMenu, setUserMenu]   = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Scroll behaviour: hide on scroll down, show on scroll up ──────────────
  useEffect(() => {
    const handler = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      setScrollY(current);
      // Hide nav when scrolling down past 80px, show on scroll up
      if (current > 80) {
        setNavVisible(current < lastScrollY.current);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── Close menus on route change ───────────────────────────────────────────
  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location]);

  // ── Close user menu on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/',        label: 'Home',    icon: '🏠' },
    { to: '/shop',    label: 'Shop',    icon: '🛒' },
    { to: '/about',   label: 'About',   icon: '🌿' },
    { to: '/contact', label: 'Contact', icon: '✉️' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // ── Progress bar width based on scroll ────────────────────────────────────
  const docHeight = typeof document !== 'undefined'
    ? document.documentElement.scrollHeight - window.innerHeight
    : 1;
  const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl shadow-xl shadow-black/8 dark:shadow-black/30'
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        {/* ── Top gradient accent bar ── */}
        <div className="h-0.5 bg-gradient-to-r from-amber-400 via-ceylon-500 to-emerald-400" />

        {/* ── Scroll progress bar ── */}
        <div
          className="absolute top-0.5 left-0 h-0.5 bg-gradient-to-r from-ceylon-400 to-amber-400 transition-all duration-100 pointer-events-none z-10"
          style={{ width: `${progress}%`, opacity: scrolled ? 1 : 0 }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-10 h-10 flex-shrink-0">
                <img
                  src="/images/hero-products/ceylon-cart-logo.png"
                  alt="CeylonCart"
                  className="w-10 h-10 rounded-xl object-cover shadow-md ring-2 ring-ceylon-200 dark:ring-ceylon-800
                             group-hover:scale-105 group-hover:ring-ceylon-400 group-hover:shadow-lg
                             group-hover:shadow-ceylon-200/50 transition-all duration-300"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const p = (e.target as HTMLImageElement).parentElement;
                    if (p) {
                      p.style.cssText = 'width:40px;height:40px;background:linear-gradient(135deg,#f97316,#ea580c);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;';
                      p.textContent = '🥥';
                    }
                  }}
                />
              </div>
              <div className="leading-none">
                <div className="flex items-baseline gap-0">
                  <span
                    className="font-display text-xl font-bold tracking-tight
                               text-gray-900 dark:text-white
                               group-hover:text-ceylon-700 dark:group-hover:text-ceylon-300
                               transition-colors duration-300">
                    Ceylon
                  </span>
                  <span
                    className="font-display text-xl font-bold tracking-tight
                               text-ceylon-500 dark:text-ceylon-400
                               group-hover:text-ceylon-600 dark:group-hover:text-ceylon-300
                               transition-colors duration-300">
                    Cart
                  </span>
                </div>
                <div className="text-[9px] font-semibold text-gray-400 dark:text-gray-500
                               tracking-widest uppercase mt-0.5 hidden sm:block
                               group-hover:text-ceylon-400 transition-colors duration-300">
                  Sri Lanka's Market
                </div>
              </div>
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 group/nav
                    ${isActive(link.to)
                      ? 'text-ceylon-600 dark:text-ceylon-400 bg-ceylon-50 dark:bg-ceylon-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-ceylon-600 dark:hover:text-ceylon-400 hover:bg-ceylon-50/70 dark:hover:bg-ceylon-900/10'
                    }`}
                >
                  {link.label}

                  {/* Active underline dot */}
                  {isActive(link.to) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5
                                     bg-ceylon-500 rounded-full
                                     shadow-[0_0_6px_rgba(249,115,22,0.5)]
                                     animate-scale-in" />
                  )}

                  {/* Hover underline */}
                  {!isActive(link.to) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5
                                     bg-ceylon-400 rounded-full
                                     group-hover/nav:w-4 transition-all duration-300" />
                  )}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold
                             text-violet-600 dark:text-violet-400
                             border border-violet-200 dark:border-violet-700
                             hover:bg-violet-50 dark:hover:bg-violet-900/20
                             hover:border-violet-400 dark:hover:border-violet-500
                             transition-all duration-200">
                  ⚙️ Admin
                </Link>
              )}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1">

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="relative p-2.5 rounded-xl
                           text-gray-600 dark:text-gray-400
                           hover:text-ceylon-600 dark:hover:text-ceylon-400
                           hover:bg-ceylon-50 dark:hover:bg-gray-800
                           border border-transparent hover:border-ceylon-200 dark:hover:border-ceylon-800
                           transition-all duration-300 hover:scale-105 active:scale-95 group/theme"
              >
                <div className="transition-transform duration-500 group-hover/theme:rotate-12">
                  {dark
                    ? <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    : <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                  }
                </div>
              </button>

              {/* Cart button */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl
                           text-gray-600 dark:text-gray-400
                           hover:text-ceylon-600 dark:hover:text-ceylon-400
                           hover:bg-ceylon-50 dark:hover:bg-gray-800
                           border border-transparent hover:border-ceylon-200 dark:hover:border-ceylon-800
                           transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1
                                   bg-ceylon-500 text-white text-[10px] font-bold
                                   rounded-full flex items-center justify-center
                                   shadow-md shadow-ceylon-200/60 dark:shadow-ceylon-900/40
                                   ring-2 ring-white dark:ring-gray-900
                                   animate-scale-in">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* User area */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenu(v => !v)}
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl
                                transition-all duration-300 hover:scale-[1.02] active:scale-95
                                ${userMenu
                                  ? 'bg-ceylon-50 dark:bg-gray-800 border border-ceylon-200 dark:border-ceylon-800 shadow-md'
                                  : 'hover:bg-ceylon-50 dark:hover:bg-gray-800 border border-transparent hover:border-ceylon-200 dark:hover:border-ceylon-800'
                                }`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-gradient-to-br from-ceylon-400 to-ceylon-600
                                    rounded-full flex items-center justify-center
                                    text-white text-sm font-bold shadow-sm
                                    ring-2 ring-ceylon-200 dark:ring-ceylon-800">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${userMenu ? 'rotate-180 text-ceylon-500' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56
                                    bg-white dark:bg-gray-800
                                    rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40
                                    border border-gray-100 dark:border-gray-700
                                    py-2 animate-scale-in origin-top-right z-50">

                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-ceylon-400 to-ceylon-600
                                          rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link to="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-gray-700 dark:text-gray-200
                                     hover:bg-ceylon-50 dark:hover:bg-gray-700
                                     hover:text-ceylon-700 dark:hover:text-ceylon-400
                                     transition-colors duration-150">
                          <span className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm">📦</span>
                          My Orders
                        </Link>

                        {isAdmin && (
                          <Link to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm
                                       text-violet-600 dark:text-violet-400
                                       hover:bg-violet-50 dark:hover:bg-violet-900/20
                                       transition-colors duration-150">
                            <span className="w-7 h-7 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center text-sm">⚙️</span>
                            Admin Panel
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); navigate('/'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-red-500 dark:text-red-400
                                     hover:bg-red-50 dark:hover:bg-red-900/20
                                     transition-colors duration-150">
                          <span className="w-7 h-7 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-sm">🚪</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className="text-sm font-semibold px-4 py-2 rounded-xl
                               text-gray-700 dark:text-gray-200
                               border border-gray-200 dark:border-gray-700
                               hover:border-ceylon-300 dark:hover:border-ceylon-700
                               hover:text-ceylon-600 dark:hover:text-ceylon-400
                               hover:bg-ceylon-50 dark:hover:bg-ceylon-900/10
                               transition-all duration-200 active:scale-95">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-bold px-4 py-2 rounded-xl
                               bg-ceylon-500 hover:bg-ceylon-600
                               text-white
                               shadow-md shadow-ceylon-200/60 dark:shadow-ceylon-900/30
                               hover:shadow-lg hover:shadow-ceylon-300/50 dark:hover:shadow-ceylon-900/40
                               hover:-translate-y-0.5
                               transition-all duration-200 active:scale-95">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="md:hidden p-2.5 rounded-xl
                           text-gray-600 dark:text-gray-400
                           hover:bg-ceylon-50 dark:hover:bg-gray-800
                           hover:text-ceylon-600 dark:hover:text-ceylon-400
                           border border-transparent hover:border-ceylon-200 dark:hover:border-ceylon-800
                           transition-all duration-200 ml-1 active:scale-95"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {/* ── Mobile Menu ── */}
          {menuOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-3 animate-slide-up">
              <nav className="flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(link.to)
                        ? 'bg-ceylon-50 dark:bg-ceylon-900/20 text-ceylon-700 dark:text-ceylon-400 border-l-2 border-ceylon-500'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-ceylon-600 dark:hover:text-ceylon-400'
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                    {isActive(link.to) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-ceylon-500" />}
                  </Link>
                ))}

                <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

                {user ? (
                  <>
                    {/* User info in mobile */}
                    <div className="flex items-center gap-3 px-4 py-2 mb-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-ceylon-400 to-ceylon-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-ceylon-600">
                      <span>📦</span> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20">
                        <span>⚙️</span> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                      <span>🚪</span> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-2 pt-1">
                    <Link to="/login" className="text-center text-sm font-semibold py-3 rounded-xl text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-ceylon-300 hover:text-ceylon-600 hover:bg-ceylon-50 dark:hover:bg-ceylon-900/10 transition-all">
                      Sign In
                    </Link>
                    <Link to="/register" className="text-center text-sm font-bold py-3 rounded-xl bg-ceylon-500 hover:bg-ceylon-600 text-white shadow-md transition-all active:scale-95">
                      Get Started
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-[65px]" />
    </>
  );
};

export default Navbar;