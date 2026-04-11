import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const useScrollTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
};

const useInView = (threshold = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const FadeIn = ({
  children, delay = 0, className = '', direction = 'up'
}: {
  children: React.ReactNode; delay?: number; className?: string; direction?: 'up' | 'left' | 'right';
}) => {
  const { ref, inView } = useInView();
  const transforms: Record<string, string> = {
    up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)',
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translate(0,0)' : transforms[direction],
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
};

// ── Each card has its own distinct soft background color ──────────────────────
const INFO_CARDS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Visit Us',
    lines: ['123 Galle Road, Colombo 03', 'Western Province, Sri Lanka'],
    cardBg:      '#f0fdf4',          // very soft green
    cardBgDark:  'rgba(20,83,45,0.15)',
    borderColor: '#bbf7d0',
    borderHover: '#4ade80',
    iconBg:      '#dcfce7',
    iconBgHover: '#16a34a',
    iconColor:   '#16a34a',
    barFrom:     '#4ade80',
    barTo:       '#16a34a',
    glowColor:   'rgba(74,222,128,0.12)',
    titleHover:  '#16a34a',
    shadowHover: 'rgba(74,222,128,0.25)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Call Us',
    lines: ['+94 11 234 5678', '+94 77 890 1234', 'Mon–Sat 8am–8pm'],
    cardBg:      '#fefce8',          // very soft yellow
    cardBgDark:  'rgba(113,63,18,0.15)',
    borderColor: '#fef08a',
    borderHover: '#facc15',
    iconBg:      '#fef9c3',
    iconBgHover: '#ca8a04',
    iconColor:   '#ca8a04',
    barFrom:     '#fde047',
    barTo:       '#ca8a04',
    glowColor:   'rgba(250,204,21,0.12)',
    titleHover:  '#a16207',
    shadowHover: 'rgba(250,204,21,0.25)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email Us',
    lines: ['hello@ceyloncart.lk', 'support@ceyloncart.lk'],
    cardBg:      '#eff6ff',          // very soft blue
    cardBgDark:  'rgba(29,78,216,0.12)',
    borderColor: '#bfdbfe',
    borderHover: '#60a5fa',
    iconBg:      '#dbeafe',
    iconBgHover: '#2563eb',
    iconColor:   '#2563eb',
    barFrom:     '#60a5fa',
    barTo:       '#2563eb',
    glowColor:   'rgba(96,165,250,0.12)',
    titleHover:  '#1d4ed8',
    shadowHover: 'rgba(96,165,250,0.25)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Hours',
    lines: ['Monday – Friday: 8am – 9pm', 'Saturday: 8am – 8pm', 'Sunday: 10am – 6pm'],
    cardBg:      '#fdf4ff',          // very soft purple/violet
    cardBgDark:  'rgba(88,28,135,0.12)',
    borderColor: '#e9d5ff',
    borderHover: '#c084fc',
    iconBg:      '#f3e8ff',
    iconBgHover: '#9333ea',
    iconColor:   '#9333ea',
    barFrom:     '#c084fc',
    barTo:       '#9333ea',
    glowColor:   'rgba(192,132,252,0.12)',
    titleHover:  '#7e22ce',
    shadowHover: 'rgba(192,132,252,0.25)',
  },
];

const SUBJECTS = [
  'General Inquiry', 'Order Issue', 'Delivery Problem', 'Product Complaint',
  'Wholesale / Bulk Order', 'Partnership / Supplier', 'Media & Press', 'Other',
];

const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' };

const ContactPage = () => {
  useScrollTop();

  const [form, setForm]           = useState({ ...emptyForm });
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');
  const [charCount, setCharCount] = useState(0);
  // Track which card is hovered for dynamic inline styles
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'message') setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      setError('Please fill in all required fields.'); return;
    }
    if (form.message.trim().length < 10) {
      setError('Message must be at least 10 characters.'); return;
    }
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setSuccess(res.data.message || 'Your message has been sent! We will get back to you within 24 hours.');
      setForm({ ...emptyForm }); setCharCount(0);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* ── HERO ── */}
      {/* Reduced top padding from pt-16 to pt-0 to eliminate space between navbar and hero image */}
      <section className="relative pt-0 overflow-hidden">
        <div className="relative h-56 sm:h-72">
          <img
            src="/images/hero-products/contact.jpg"
            alt="Contact us"
            className="w-full h-full object-cover"
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div style={{ animation: 'heroFadeUp 0.6s ease-out both' }}>
                <p className="text-ceylon-400 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
              </div>
              <div style={{ animation: 'heroFadeUp 0.6s ease-out 0.1s both' }}>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
                  Contact <span className="text-ceylon-400">Us</span>
                </h1>
              </div>
              <div style={{ animation: 'heroFadeUp 0.6s ease-out 0.2s both' }}>
                <p className="text-white/75 text-base max-w-md">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO CARDS — each with its own soft background color ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INFO_CARDS.map((card, i) => {
            const isHovered = hoveredCard === i;
            return (
              <FadeIn key={i} delay={i * 0.1} direction="up">
                <div
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative rounded-2xl p-6 overflow-hidden h-full
                             transition-all duration-300 cursor-default"
                  style={{
                    background: card.cardBg,
                    border: `1.5px solid ${isHovered ? card.borderHover : card.borderColor}`,
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? `0 20px 40px ${card.shadowHover}, 0 8px 16px ${card.shadowHover}`
                      : '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Corner glow */}
                  <div
                    className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500"
                    style={{
                      background: card.glowColor,
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4
                               shadow-sm transition-all duration-300"
                    style={{
                      background: isHovered ? card.iconBgHover : card.iconBg,
                      color: isHovered ? '#ffffff' : card.iconColor,
                      boxShadow: isHovered ? `0 4px 12px ${card.shadowHover}` : 'none',
                    }}
                  >
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold mb-2.5 text-base transition-colors duration-200"
                    style={{ color: isHovered ? card.titleHover : '#111827' }}
                  >
                    {card.title}
                  </h3>

                  {/* Lines */}
                  {card.lines.map((line, j) => (
                    <p key={j} className="text-gray-500 text-sm leading-relaxed">{line}</p>
                  ))}

                  {/* Animated bottom bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 transition-transform duration-300 origin-left"
                    style={{
                      background: `linear-gradient(to right, ${card.barFrom}, ${card.barTo})`,
                      transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ── FORM + SIDE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── CONTACT FORM ── */}
          <FadeIn className="lg:col-span-3" direction="left">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-7 sm:p-10
                            border border-ceylon-100 dark:border-gray-700 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Send us a message
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">
                Fill in the form below and we'll get back to you within 24 hours.
              </p>

              {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700
                                text-emerald-700 dark:text-emerald-400 rounded-2xl px-5 py-4 text-sm mb-6
                                flex items-start gap-3 animate-scale-in">
                  <span className="text-xl flex-shrink-0">✅</span>
                  <div><p className="font-semibold mb-0.5">Message Sent!</p><p>{success}</p></div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                                text-red-600 dark:text-red-400 rounded-2xl px-5 py-4 text-sm mb-6
                                flex items-center gap-3 animate-scale-in">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="Amara Perera" required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                                 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent
                                 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com" required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                                 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent
                                 transition-all text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone Number
                    </label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                                 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent
                                 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <select name="subject" value={form.subject} onChange={handleChange} required
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                                 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent
                                 transition-all text-sm">
                      <option value="">Select a subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <span className={`text-xs ${charCount > 450 ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {charCount}/500
                    </span>
                  </div>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    rows={5} required maxLength={500}
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                               rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent
                               transition-all text-sm resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-ceylon-500 hover:bg-ceylon-600 text-white font-bold py-4 rounded-2xl
                             transition-all shadow-lg shadow-ceylon-200 dark:shadow-ceylon-900/30
                             hover:shadow-xl active:scale-95 disabled:opacity-60
                             flex items-center justify-center gap-2 text-base">
                  {loading
                    ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    : '✉️ Send Message'}
                </button>
              </form>
            </div>
          </FadeIn>

          {/* ── SIDE PANEL ── */}
          <FadeIn delay={0.15} className="lg:col-span-2 space-y-6" direction="right">

            {/* Google Maps */}
            <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-60 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7985946767576!2d79.84861031477348!3d6.914682895003458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259620a1d0c4b%3A0x4df4952ab4e65cf0!2sGalle%20Rd%2C%20Colombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CeylonCart Location"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl
                                px-4 py-2 text-center shadow-lg border border-ceylon-100 dark:border-ceylon-900/30 whitespace-nowrap">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">📍 123 Galle Road</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Colombo 03, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6
                            border border-ceylon-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base flex items-center gap-2">
                <span className="w-5 h-0.5 bg-ceylon-500 rounded-full inline-block" />
                Common Questions
              </h3>
              <div className="space-y-0">
                {[
                  { q: 'How long does delivery take?', a: 'Same-day in Colombo, 1–2 days elsewhere.' },
                  { q: 'Can I change my order?',       a: 'Yes, within 30 minutes of placing it.' },
                  { q: 'What is your return policy?',  a: 'Full refund within 24 hours of delivery.' },
                  { q: 'Do you deliver island-wide?',  a: 'Yes, we deliver to all 25 districts.' },
                ].map((faq, i) => (
                  <details key={i} className="group border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <summary className="flex items-center justify-between cursor-pointer list-none
                                       text-sm font-semibold text-gray-800 dark:text-gray-200
                                       hover:text-ceylon-600 dark:hover:text-ceylon-400
                                       transition-colors py-3.5 select-none">
                      {faq.q}
                      <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-300 flex-shrink-0 ml-2"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="text-gray-500 dark:text-gray-400 text-sm pb-3.5 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Social icons */}
            <div className="bg-ceylon-50 dark:bg-ceylon-900/20 rounded-3xl p-6
                            border border-ceylon-100 dark:border-ceylon-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Follow Us</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Stay updated with fresh arrivals and special offers.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/94112345678" target="_blank" rel="noopener noreferrer"
                  className="group w-11 h-11 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center
                             shadow-sm border border-ceylon-100 dark:border-ceylon-900/40
                             hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='#25D366'; el.style.border='1px solid #25D366'; el.style.boxShadow='0 6px 20px rgba(37,211,102,0.40)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background=''; el.style.border=''; el.style.boxShadow=''; }}>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="group w-11 h-11 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center
                             shadow-sm border border-ceylon-100 dark:border-ceylon-900/40
                             hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='#1877F2'; el.style.border='1px solid #1877F2'; el.style.boxShadow='0 6px 20px rgba(24,119,242,0.40)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background=''; el.style.border=''; el.style.boxShadow=''; }}>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="group w-11 h-11 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center
                             shadow-sm border border-ceylon-100 dark:border-ceylon-900/40
                             hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='linear-gradient(135deg,#833AB4,#FD1D1D,#F77737)'; el.style.border='1px solid #FD1D1D'; el.style.boxShadow='0 6px 20px rgba(253,29,29,0.35)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background=''; el.style.border=''; el.style.boxShadow=''; }}>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;