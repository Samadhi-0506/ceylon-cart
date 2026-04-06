import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-ceylon-400 to-ceylon-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🥥</span>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-white">Ceylon</span>
              <span className="font-display text-2xl font-bold text-ceylon-400">Cart</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Your trusted online market for authentic Sri Lankan groceries, spices, sweets, and daily essentials. Fresh from the island, delivered to your door.
          </p>
          <div className="flex gap-3 mt-5">
            {['🌐', '📘', '📸', '🐦'].map((icon, i) => (
              <button key={i} className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-ceylon-600 transition-colors text-sm">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            {['Vegetables', 'Fruits', 'Spices', 'Rice & Grains', 'Beverages', 'Cakes & Sweets'].map(cat => (
              <li key={cat}>
                <Link to={`/shop/${cat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                  className="text-gray-400 hover:text-ceylon-400 transition-colors">{cat}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-white font-semibold mb-4">Info</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="text-gray-400 hover:text-ceylon-400 transition-colors">All Products</Link></li>
            <li><Link to="/cart" className="text-gray-400 hover:text-ceylon-400 transition-colors">Shopping Cart</Link></li>
            <li><Link to="/orders" className="text-gray-400 hover:text-ceylon-400 transition-colors">My Orders</Link></li>
            <li><Link to="/register" className="text-gray-400 hover:text-ceylon-400 transition-colors">Create Account</Link></li>
          </ul>
          <div className="mt-6">
            <p className="text-xs text-gray-500">📍 Colombo, Sri Lanka</p>
            <p className="text-xs text-gray-500 mt-1">📞 +94 11 234 5678</p>
            <p className="text-xs text-gray-500 mt-1">✉️ hello@ceyloncart.lk</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">© 2024 CeylonCart. Made with ❤️ in Sri Lanka.</p>
        <div className="flex gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
