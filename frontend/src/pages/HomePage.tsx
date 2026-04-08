import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';
import api from '../utils/api';

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Hero images array - using local images from public folder
  const heroImages = [
    '/images/hero-products/shopping-cart.png',    // Shopping cart image
    '/images/hero-products/fresh-basket.png',     // Fresh produce basket
    '/images/hero-products/shopping-app.png'      // Mobile shopping app
  ];

  // Rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=8')
        ]);
        setCategories(catRes.data);
        setFeatured(prodRes.data.products);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ceylon-600 via-ceylon-500 to-amber-500 dark:from-ceylon-800 dark:via-ceylon-700 dark:to-amber-800 pt-24 pb-20">
        {/* Batik pattern overlay */}
        <div className="absolute inset-0 bg-batik opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="animate-bounce-gentle">🛺</span> Free delivery on orders over Rs. 2,000
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-4">
              Fresh from the<br />
              <span className="text-yellow-300">Heart of Ceylon</span>
            </h1>
            <p className="text-white/85 text-lg max-w-md mb-8 leading-relaxed">
              Shop authentic Sri Lankan groceries, spices, sweets, and fresh produce — delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/shop" className="bg-white text-ceylon-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-yellow-50 transition-colors shadow-lg hover:shadow-xl active:scale-95">
                Shop Now 🛒
              </Link>
              <Link to="/shop/spices" className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-colors">
                Explore Spices
              </Link>
            </div>
          </div>

          {/* Animated single hero image carousel */}
          <div className="flex-1 flex justify-center items-center max-w-sm mx-auto">
            <div className="relative w-full aspect-square">
              {/* Image container with fade animation */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-ceylon-100 to-amber-100 dark:from-ceylon-900/30 dark:to-amber-900/30 shadow-2xl">
                {heroImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Product showcase ${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                      i === heroImageIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    }`}
                  />
                ))}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Carousel indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroImageIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === heroImageIndex
                        ? 'bg-white w-8 shadow-lg'
                        : 'bg-white/40 hover:bg-white/60 w-2'
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              {/* Side navigation arrows */}
              <button
                onClick={() => setHeroImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all z-10 hidden sm:flex items-center justify-center"
              >
                ←
              </button>
              <button
                onClick={() => setHeroImageIndex((prev) => (prev + 1) % heroImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all z-10 hidden sm:flex items-center justify-center"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-gray-50 dark:text-gray-900">
            <path d="M0 60L1440 60L1440 30C1200 60 900 0 720 30C540 60 240 0 0 30L0 60Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🌿', label: 'Fresh Products', value: '200+' },
            { icon: '🚚', label: 'Free Delivery', value: 'Rs. 2000+' },
            { icon: '⭐', label: 'Avg Rating', value: '4.8/5' },
            { icon: '🏪', label: 'Happy Customers', value: '10K+' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ceylon-50 dark:bg-ceylon-900/20 rounded-xl flex items-center justify-center text-xl">{stat.icon}</div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

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

      {/* Featured products */}
      <section className="bg-white dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Handpicked favourites from our collection</p>
            </div>
            <Link to="/shop" className="text-ceylon-600 dark:text-ceylon-400 font-semibold hover:underline text-sm hidden sm:block">View All →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-72 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((p, i) => (
                <div key={p._id} style={{ animationDelay: `${i * 0.07}s` }} className="animate-fade-in">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-jade-600 to-jade-700 dark:from-jade-700 dark:to-jade-800 rounded-3xl p-8 sm:p-12 text-center text-white">
          <div className="absolute inset-0 bg-batik opacity-20" />
          <div className="relative">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">New Customer? Get 10% Off!</h2>
            <p className="text-white/80 text-lg mb-6">Register today and use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">WELCOME10</span> at checkout</p>
            <Link to="/register" className="inline-block bg-white text-jade-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-yellow-50 transition-colors shadow-lg active:scale-95">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
