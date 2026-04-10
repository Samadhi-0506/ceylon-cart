import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';
import api from '../utils/api';

// Home page for the Ceylon Cart storefront.
// Includes hero carousel, category cards, featured products, promo banners, and a CTA section.

// Static hero slide data for the homepage carousel.
const HERO_SLIDES = [
  { bg: '/images/hero-products/vegetable.jpg', tag: '🌿 Farm Fresh', title: 'Fresh from the', highlight: 'Heart of Ceylon', sub: 'Premium Sri Lankan groceries, spices & farm-fresh produce delivered to your door.', cta: '/shop/vegetables', ctaLabel: 'Shop Vegetables', accent: 'from-emerald-400 to-green-300' },
  { 
    bg: '/images/hero-products/spice-slide.jpg',
    tag: '🌶️ Authentic Spices',
    title: 'World-Famous',
    highlight: 'Ceylon Spices',
    sub: "True cinnamon, black pepper, cardamom — the finest spices from the Spice Island.",
    cta: '/shop/spices',
    ctaLabel: 'Shop Spices',
    accent: 'from-red-400 to-orange-300'
  },
  { bg: '/images/hero-products/tea.jpg', tag: '🍵 Pure Ceylon Tea', title: 'Highland Grown', highlight: 'Ceylon Tea', sub: "Orange Pekoe from Nuwara Eliya highlands. The world's finest cup, delivered fresh.", cta: '/shop/beverages', ctaLabel: 'Shop Tea', accent: 'from-amber-400 to-yellow-300' },
  { bg: '/images/hero-products/fruits.jpg', tag: '🍍 Tropical Fruits', title: 'Sun-Ripened', highlight: 'Tropical Fruits', sub: 'King coconut, rambutan, mango & more. Sweet seasonal fruits straight from the estate.', cta: '/shop/fruits', ctaLabel: 'Shop Fruits', accent: 'from-yellow-400 to-orange-300' },
];

// Category visuals map categories to optimized image cards and gradient overlays.
const CAT_VISUALS: Record<string, { img: string; gradient: string }> = {
  vegetables:   { img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', gradient: 'from-green-900/80 to-green-600/40' },
  fruits:       { img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80', gradient: 'from-yellow-900/80 to-yellow-500/40' },
  cakes:        { img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', gradient: 'from-pink-900/80 to-pink-500/40' },
  biscuits:     { img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80', gradient: 'from-orange-900/80 to-orange-500/40' },
  dairy:        { img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80', gradient: 'from-blue-900/80 to-blue-400/40' },
  spices:       { img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80', gradient: 'from-red-900/80 to-red-500/40' },
  'rice-grains':{ img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', gradient: 'from-lime-900/80 to-lime-500/40' },
  beverages:    { img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', gradient: 'from-teal-900/80 to-teal-500/40' },
};

// Promotional banner content shown in the "Hot Picks" section.
const PROMO_BANNERS = [
  { img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&q=80', tag: 'NEW ARRIVAL', title: 'Ambewela Buffalo Curd', sub: 'Thick, creamy, traditional.', link: '/shop/dairy', badge: 'Rs. 350', color: 'from-indigo-900 to-indigo-700' },
  { img: 'https://images.unsplash.com/photo-1565087534298-b9e9f5fe8a4e?w=700&q=80', tag: '⭐ BESTSELLER', title: 'True Ceylon Cinnamon', sub: "Export quality. World's finest.", link: '/shop/spices', badge: 'Rs. 420', color: 'from-amber-900 to-amber-700' },
  { img: 'https://images.unsplash.com/photo-1546961342-ea5f62d3a27b?w=700&q=80', tag: '🥥 FRESH TODAY', title: 'King Coconut (Thambili)', sub: "Nature's hydration drink.", link: '/shop/fruits', badge: 'Rs. 80 each', color: 'from-orange-900 to-orange-700' },
];

// Reusable hook to detect when a section enters the viewport.
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

// Small wrapper component that fades children in when they scroll into view.
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)', transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s` }}>
      {children}
    </div>
  );
};

// Main homepage component.
// Fetches categories and featured products, manages hero slide state, and renders page sections.
const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [slide, setSlide]           = useState(0);
  const [fading, setFading]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([api.get('/categories'), api.get('/products?featured=true&limit=8')]);
        setCategories(catRes.data);
        setFeatured(prodRes.data.products);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
  };

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const changeSlide = (next: number | ((s: number) => number)) => {
    setFading(true);
    setTimeout(() => {
      setSlide(typeof next === 'function' ? next(slide) : next);
      setFading(false);
    }, 350);
  };

  const manualSlide = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    changeSlide(i);
    setTimeout(() => startTimer(), 400); // Restart timer after manual change
  };
  const cur = HERO_SLIDES[slide];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[90vh] min-h-[580px] max-h-[860px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === slide ? 1 : 0, zIndex: 1 }}>
            <img src={s.bg} alt="" className="w-full h-full object-cover" style={{ transform: i === slide ? 'scale(1.04)' : 'scale(1)', transition: 'transform 7s ease-out' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}

        {/* Text */}
        <div className="relative h-full flex items-center" style={{ zIndex: 3 }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
            <div className="max-w-2xl" style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(14px)' : 'translateY(0)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span>{cur.tag}</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4">
                {cur.title}<br />
                <span className={`bg-gradient-to-r ${cur.accent} bg-clip-text text-transparent`}>{cur.highlight}</span>
              </h1>
              <p className="text-white/80 text-lg sm:text-xl max-w-lg mb-8 leading-relaxed">{cur.sub}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={cur.cta} className="bg-white text-gray-900 font-bold px-8 py-3.5 rounded-2xl hover:bg-yellow-50 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2">
                  {cur.ctaLabel} →
                </Link>
                <Link to="/shop" className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/25 transition-all active:scale-95">
                  Browse All
                </Link>
              </div>
              <div className="flex items-center gap-2.5 mt-10">
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => manualSlide(i)}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === slide ? '32px' : '10px', height: '10px', background: i === slide ? 'white' : 'rgba(255,255,255,0.35)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll nudge */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40" style={{ zIndex: 3 }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" style={{ animation: 'pulse 2s infinite' }} />
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
            {[{ icon:'🚚', title:'Free Delivery', sub:'On orders over Rs. 2,000' }, { icon:'🌿', title:'100% Fresh', sub:'Farm to your doorstep' }, { icon:'⭐', title:'4.8 Rating', sub:'10,000+ happy customers' }, { icon:'🔒', title:'Secure Pay', sub:'Encrypted checkout' }].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="flex items-center gap-3 px-4 py-3">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div><p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</p></div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Explore our fresh Sri Lankan product categories</p>
          </div>
          <Link to="/shop" className="text-ceylon-600 dark:text-ceylon-400 font-semibold hover:underline text-sm hidden sm:block">View All →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={cat._id} to={`/shop/${cat.slug}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer animate-fade-in">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{cat.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5 hidden sm:block">{cat.description.slice(0, 40)}...</p>
                </div>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div><p className="text-ceylon-500 font-semibold text-sm uppercase tracking-widest mb-2">Handpicked for you</p><h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">Featured Products</h2></div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-ceylon-600 dark:text-ceylon-400 hover:gap-2 transition-all">View All →</Link>
          </div>
        </FadeIn>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">{[...Array(8)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-72 animate-pulse" />)}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p, i) => <FadeIn key={p._id} delay={i * 0.06}><ProductCard product={p} /></FadeIn>)}
          </div>
        )}
      </section>

      {/* ── WIDE TEA BANNER ── */}
      <FadeIn>
        <section className="relative overflow-hidden h-72 sm:h-96 my-6">
          <img src="https://images.unsplash.com/photo-1547825407-2d060104b7f8?w=1600&q=80" alt="Ceylon Tea Estate" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 sm:px-20">
            <div className="max-w-lg">
              <p className="text-ceylon-400 font-semibold text-sm uppercase tracking-widest mb-3">Straight from Nuwara Eliya</p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight mb-5">The World's Finest<br />Ceylon Tea</h2>
              <Link to="/shop/beverages" className="inline-flex items-center gap-2 bg-ceylon-500 hover:bg-ceylon-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95">
                Shop Tea Collection →
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
      
      <Footer />

      <style>{`
        @keyframes bounceGentle {
          from { transform: translateY(0); }
          to   { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;