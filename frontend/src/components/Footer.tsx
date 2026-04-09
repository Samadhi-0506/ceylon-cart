import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="relative mt-20 overflow-hidden text-white">

    {/* ── Background image — blurred + dark so text reads clearly ── */}
    <div className="absolute inset-0 z-0">
      <img
        src="/images/hero-products/Sign-background.jpg"
        alt=""
        className="w-full h-full object-cover object-center"
        style={{ filter: 'blur(6px) brightness(0.30)', transform: 'scale(1.06)' }}
      />
      {/* Semi-transparent dark layer */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Ceylon tint at top-left */}
      <div className="absolute inset-0 bg-gradient-to-br from-ceylon-900/25 via-transparent to-transparent" />
    </div>

    {/* ── Top accent line ── */}
    <div className="relative z-10 h-0.5 bg-gradient-to-r from-transparent via-ceylon-500 to-transparent" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

        {/* ── Brand column ── */}
        <div className="md:col-span-5">

          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 group mb-6 block">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl ring-2 ring-ceylon-500/40 group-hover:ring-ceylon-400 group-hover:scale-105 transition-all duration-300 flex-shrink-0">
              <img
                src="/images/hero-products/ceylon-cart-logo.png"
                alt="CeylonCart"
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.style.background = 'linear-gradient(135deg, #f59e0b, #ea580c)';
                    parent.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:1.8rem;">🥥</span>';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="font-display text-3xl font-bold text-white leading-none">Ceylon</span>
                <span className="font-display text-3xl font-bold text-ceylon-400 leading-none">Cart</span>
              </div>
              <p className="text-xs text-gray-300 font-medium tracking-widest uppercase mt-0.5">
                Sri Lanka's Market
              </p>
            </div>
          </Link>

          {/* Tagline */}
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs mb-8">
            Your trusted online market for authentic Sri Lankan groceries, spices, sweets, and daily essentials. Fresh from the island, delivered to your door.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">

            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#1877F2';
                (e.currentTarget as HTMLElement).style.border = '1px solid #1877F2';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(24,119,242,0.50)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/94112345678" target="_blank" rel="noopener noreferrer"
              className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#25D366';
                (e.currentTarget as HTMLElement).style.border = '1px solid #25D366';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.50)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Email */}
            <a href="mailto:hello@ceyloncart.lk"
              className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#EA4335';
                (e.currentTarget as HTMLElement).style.border = '1px solid #EA4335';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(234,67,53,0.50)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)';
                (e.currentTarget as HTMLElement).style.border = '1px solid #FD1D1D';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(253,29,29,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>

          </div>
        </div>

        {/* ── Links columns ── */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Shop */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-ceylon-500 rounded-full inline-block" />
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Vegetables',    slug: 'vegetables' },
                { label: 'Fruits',        slug: 'fruits' },
                { label: 'Spices',        slug: 'spices' },
                { label: 'Rice & Grains', slug: 'rice-grains' },
                { label: 'Beverages',     slug: 'beverages' },
                { label: 'Cakes & Sweets', slug: 'cakes' },
              ].map(cat => (
                <li key={cat.slug}>
                  <Link to={`/shop/${cat.slug}`}
                    className="text-gray-300 hover:text-ceylon-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-ceylon-400 transition-colors flex-shrink-0" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-ceylon-500 rounded-full inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'All Products',   to: '/shop' },
                { label: 'Shopping Cart',  to: '/cart' },
                { label: 'My Orders',      to: '/orders' },
                { label: 'About Us',       to: '/about' },
                { label: 'Contact',        to: '/contact' },
                { label: 'Create Account', to: '/register' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-gray-300 hover:text-ceylon-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-ceylon-400 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-ceylon-500 rounded-full inline-block" />
              Contact
            </h4>
            <ul className="space-y-4">

              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <svg className="w-3.5 h-3.5 text-ceylon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed pt-1">
                  123 Galle Road<br />Colombo 03, Sri Lanka
                </p>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <svg className="w-3.5 h-3.5 text-ceylon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href="tel:+94112345678" className="text-gray-300 hover:text-ceylon-400 transition-colors text-xs">
                  +94 11 234 5678
                </a>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <svg className="w-3.5 h-3.5 text-ceylon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:hello@ceyloncart.lk" className="text-gray-300 hover:text-ceylon-400 transition-colors text-xs">
                  hello@ceyloncart.lk
                </a>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <svg className="w-3.5 h-3.5 text-ceylon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-300 text-xs">Mon–Sat: 8am – 9pm</p>
              </li>

            </ul>
          </div>
        </div>
      </div>

      {/* ── Newsletter strip ── */}
      <div className="rounded-2xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-center gap-4 justify-between backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div>
          <p className="font-bold text-white text-sm">Get fresh deals in your inbox 🌿</p>
          <p className="text-gray-300 text-xs mt-0.5">Subscribe for weekly offers and new arrivals.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 sm:w-56 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent transition-all backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          />
          <button className="bg-ceylon-500 hover:bg-ceylon-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 whitespace-nowrap shadow-lg">
            Subscribe
          </button>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="pt-7 flex flex-col sm:flex-row justify-between items-center gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">© 2024 CeylonCart.</p>
          <span className="text-gray-600">·</span>
          <p className="text-xs text-gray-400">Made with</p>
          <span className="text-red-400 text-xs">❤️</span>
          <p className="text-xs text-gray-400">in Sri Lanka</p>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">Privacy Policy</a>
          <span className="text-gray-600">·</span>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">Terms of Service</a>
          <span className="text-gray-600">·</span>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">Sitemap</a>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;