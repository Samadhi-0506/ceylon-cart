import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
};

const INFO_CARDS = [
  { icon: '📍', title: 'Visit Us', lines: ['123 Galle Road, Colombo 03', 'Western Province, Sri Lanka'] },
  { icon: '📞', title: 'Call Us', lines: ['+94 11 234 5678', '+94 77 890 1234', 'Mon–Sat 8am–8pm'] },
  { icon: '✉️', title: 'Email Us', lines: ['hello@ceyloncart.lk', 'support@ceyloncart.lk'] },
  { icon: '⏰', title: 'Hours', lines: ['Monday – Friday: 8am – 9pm', 'Saturday: 8am – 8pm', 'Sunday: 10am – 6pm'] },
];

const SUBJECTS = [
  'General Inquiry',
  'Order Issue',
  'Delivery Problem',
  'Product Complaint',
  'Wholesale / Bulk Order',
  'Partnership / Supplier',
  'Media & Press',
  'Other',
];

const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' };

const ContactPage = () => {
  const [form, setForm]       = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'message') setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.message.trim().length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setSuccess(res.data.message || 'Your message has been sent! We will get back to you within 24 hours.');
      setForm({ ...emptyForm });
      setCharCount(0);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-16 overflow-hidden">
        <div className="relative h-56 sm:h-72">
          <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80" alt="Contact us" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">Contact <span className="text-amber-400">Us</span></h1>
              <p className="text-white/75 text-base max-w-md">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INFO_CARDS.map((card, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                {card.lines.map((line, j) => (
                  <p key={j} className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FORM + MAP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── CONTACT FORM ── */}
          <FadeIn className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-7 sm:p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">Send us a message</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">Fill in the form below and we'll get back to you within 24 hours.</p>

              {/* Success */}
              {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 rounded-2xl px-5 py-4 text-sm mb-6 flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-semibold mb-0.5">Message Sent!</p>
                    <p>{success}</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl px-5 py-4 text-sm mb-6 flex items-center gap-3">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Amara Perera" required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-sm" />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 123 4567"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject <span className="text-red-400">*</span></label>
                    <select name="subject" value={form.subject} onChange={handleChange} required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-sm">
                      <option value="">Select a subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Message <span className="text-red-400">*</span></label>
                    <span className={`text-xs ${charCount > 450 ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>{charCount}/500</span>
                  </div>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} required maxLength={500}
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-sm resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 text-base">
                  {loading
                    ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    : '✉️ Send Message'}
                </button>
              </form>
            </div>
          </FadeIn>

          {/* ── SIDE INFO ── */}
          <FadeIn delay={0.2} className="lg:col-span-2 space-y-6">
            {/* Map placeholder */}
            <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-56 relative">
              <img src="https://images.unsplash.com/photo-1617501571655-1e25c6c8c0bb?w=700&q=80" alt="Colombo Sri Lanka" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-5 py-3 text-center shadow-lg">
                  <div className="text-2xl mb-1">📍</div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">123 Galle Road</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Colombo 03, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* FAQ quick links */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Common Questions</h3>
              <div className="space-y-3">
                {[
                  { q: 'How long does delivery take?', a: 'Same-day in Colombo, 1–2 days elsewhere.' },
                  { q: 'Can I change my order?', a: 'Yes, within 30 minutes of placing it.' },
                  { q: 'What is your return policy?', a: 'Full refund within 24 hours of delivery.' },
                  { q: 'Do you deliver island-wide?', a: 'Yes, we deliver to all 25 districts.' },
                ].map((faq, i) => (
                  <details key={i} className="group border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1">
                      {faq.q}
                      <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 pl-0">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-6 border border-amber-100 dark:border-amber-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Follow Us</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Stay updated with fresh arrivals and special offers.</p>
              <div className="flex gap-3">
                {[{ icon: '📘', label: 'Facebook' }, { icon: '📸', label: 'Instagram' }, { icon: '🐦', label: 'Twitter' }, { icon: '▶️', label: 'YouTube' }].map((s, i) => (
                  <button key={i} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-lg hover:bg-amber-500 hover:scale-110 transition-all shadow-sm border border-amber-100 dark:border-amber-700">
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
