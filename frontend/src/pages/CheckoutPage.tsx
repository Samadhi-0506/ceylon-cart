import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    note: '',
    paymentMethod: 'cash_on_delivery'
  });

  const delivery = totalPrice >= 2000 ? 0 : 200;
  const grandTotal = totalPrice + delivery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.phone) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setPlacing(true);
    try {
      const orderItems = items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      }));
      const res = await api.post('/orders', {
        items: orderItems,
        totalAmount: grandTotal,
        shippingAddress: { street: form.street, city: form.city, province: form.province, postalCode: form.postalCode, phone: form.phone },
        paymentMethod: form.paymentMethod,
        note: form.note
      });
      setOrderId(res.data._id);
      clearCart();
      setSuccess(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to place order. Please try again.';
      setError(msg);
    } finally {
      setPlacing(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
        <div className="card p-10 max-w-md w-full">
          <div className="text-7xl mb-5 animate-bounce-gentle">🎉</div>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Thank you for shopping with CeylonCart</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Order ID: <span className="font-mono text-ceylon-600 dark:text-ceylon-400">{orderId.slice(-8).toUpperCase()}</span></p>
          <div className="bg-jade-50 dark:bg-jade-900/20 rounded-xl p-4 mb-6 text-sm text-jade-700 dark:text-jade-300">
            Our team will confirm your order shortly. Expected delivery in 1–3 business days.
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/orders" className="btn-primary text-center">View My Orders</Link>
            <Link to="/shop" className="btn-secondary text-center">Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-enter">
      <Navbar />
      <div className="pt-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout 🔒</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping address */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-ceylon-100 dark:bg-ceylon-900/30 text-ceylon-600 dark:text-ceylon-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address *</label>
                    <input name="street" value={form.street} onChange={handleChange} placeholder="123 Galle Road" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="Colombo" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Province</label>
                    <input name="province" value={form.province} onChange={handleChange} placeholder="Western Province" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Postal Code</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="00100" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 123 4567" className="input-field" required />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-ceylon-100 dark:bg-ceylon-900/30 text-ceylon-600 dark:text-ceylon-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank transfer' },
                  ].map(method => (
                    <label key={method.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.paymentMethod === method.value
                          ? 'border-ceylon-500 bg-ceylon-50 dark:bg-ceylon-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-ceylon-300'
                      }`}>
                      <input type="radio" name="paymentMethod" value={method.value} checked={form.paymentMethod === method.value} onChange={handleChange} className="sr-only" />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{method.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{method.desc}</div>
                      </div>
                      {form.paymentMethod === method.value && (
                        <div className="ml-auto w-5 h-5 bg-ceylon-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Order Note (optional)</h2>
                <textarea name="note" value={form.note} onChange={handleChange} rows={3}
                  placeholder="Any special instructions for delivery..."
                  className="input-field resize-none" />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-5">Order Summary</h2>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">×{item.quantity} — Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-700 dark:text-gray-200">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Delivery</span>
                    <span className={delivery === 0 ? 'text-jade-500 font-medium' : 'text-gray-700 dark:text-gray-200'}>
                      {delivery === 0 ? '🎉 FREE' : `Rs. ${delivery}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-bold text-lg">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-ceylon-600 dark:text-ceylon-400">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" disabled={placing}
                  className="w-full btn-primary mt-5 py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60">
                  {placing ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                  ) : '✅ Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
