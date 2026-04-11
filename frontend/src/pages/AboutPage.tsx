import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s` }}>
      {children}
    </div>
  );
};

const TEAM = [
  { name: 'Kavindu Perera', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', quote: 'Bringing Ceylon\'s finest to every home.' },
  { name: 'Nimali Silva',   role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', quote: 'Fresh quality, every single delivery.' },
  { name: 'Roshan Fernando', role: 'Head of Sourcing', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', quote: 'Direct from the farms, always fresh.' },
  { name: 'Dilini Jayawardena', role: 'Customer Experience', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80', quote: 'Your satisfaction is our mission.' },
];

const VALUES = [
  { icon: '🌿', title: 'Farm Fresh Always',     desc: 'Every product is sourced directly from Sri Lankan farms, ensuring maximum freshness and nutritional value when it reaches your table.' },
  { icon: '🤝', title: 'Supporting Local',       desc: 'We partner with over 200 local farmers and producers across Sri Lanka, ensuring fair prices and sustainable livelihoods.' },
  { icon: '🔒', title: 'Quality Guaranteed',     desc: 'Every item undergoes strict quality checks before delivery. If you\'re not satisfied, we make it right — guaranteed.' },
  { icon: '🚚', title: 'Swift Delivery',         desc: 'Same-day delivery in Colombo and next-day delivery to all major cities. Fresh produce delivered right to your doorstep.' },
  { icon: '🌱', title: 'Eco-Conscious',          desc: 'We use biodegradable packaging and partner with farms that practice sustainable agriculture to protect Sri Lanka\'s natural heritage.' },
  { icon: '💚', title: 'Community First',        desc: 'A portion of every sale goes toward supporting rural farming communities across Sri Lanka through our foundation.' },
];

const STATS = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '200+',    label: 'Local Farm Partners' },
  { value: '8',       label: 'Product Categories' },
  { value: '4.8★',   label: 'Average Rating' },
];

const AboutPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />

    {/* ── HERO ── */}
    {/* Changed from pt-16 to pt-0 to eliminate space between navbar and hero image */}
    <section className="relative overflow-hidden pt-0">
      <div className="relative h-72 sm:h-96">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80" alt="Sri Lankan market" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-white mb-4 leading-tight">About <span className="text-amber-400">CeylonCart</span></h1>
            <p className="text-white/75 text-lg max-w-xl">Sri Lanka's most trusted online grocery market — connecting local farms to your family table since 2022.</p>
          </div>
        </div>
      </div>
    </section>

    {/* ── STATS STRIP ── */}
    <section className="bg-amber-500 dark:bg-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="text-white">
                <div className="font-display text-3xl sm:text-4xl font-bold">{s.value}</div>
                <div className="text-amber-100 text-sm font-medium mt-1">{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>

    {/* ── OUR STORY ── */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <FadeIn>
          <div>
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-widest mb-3">How We Started</p>
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Born from a love of<br />authentic Sri Lankan food
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>CeylonCart was founded in 2022 when our founder Kavindu noticed how difficult it was for Sri Lankan families — both locally and abroad — to access authentic, high-quality local produce without overpaying middlemen.</p>
              <p>We started with just 12 products and 3 farm partners in Colombo. Today we carry over 200 products across 8 categories, partnering directly with more than 200 farmers from Jaffna to Matara.</p>
              <p>Our mission is simple: connect the hardworking farmers of Sri Lanka with the families who love their produce — cutting out middlemen, ensuring better prices for farmers and fresher products for customers.</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95">
              Shop Our Products →
            </Link>
          </div>
        </FadeIn>

<FadeIn delay={0.2}>
  <div className="flex justify-center items-center py-6 px-4">
    <div className="relative group max-w-md w-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-ceylon-400/30 to-amber-400/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>

      <div className="relative z-10 bg-transparent rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500">
        <img 
          src="/images/hero-products/girl.png" 
          alt="Authentic Sri Lankan Produce" 
          className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="absolute -top-2 -left-2 bg-ceylon-500 text-white p-2 rounded-full shadow-lg z-20 animate-bounce text-xs">
        🍃
      </div>
    </div>
  </div>
</FadeIn>
      </div>
    </section>

    {/* ── VALUES ── */}
    <section className="bg-white dark:bg-gray-800/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-amber-500 font-semibold text-sm uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">Our Core Values</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((v, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="group bg-gray-50 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-3xl p-7 border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{v.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>

    {/* ── TEAM ── */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <FadeIn>
        <div className="text-center mb-14">
          <p className="text-amber-500 font-semibold text-sm uppercase tracking-widest mb-3">The People Behind CeylonCart</p>
          <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">Meet Our Team</h2>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM.map((member, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="group text-center">
              <div className="relative mx-auto w-36 h-36 mb-5">
                <div className="w-36 h-36 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-gray-800 group-hover:ring-amber-400 transition-all duration-300">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f59e0b&color=fff&size=144`; }} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-lg shadow-lg">
                  {['🌿', '⚙️', '🚜', '💬'][i]}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{member.name}</h3>
              <p className="text-amber-500 dark:text-amber-400 text-sm font-semibold mt-0.5">{member.role}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-2">"{member.quote}"</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>

    

    <Footer />
  </div>
);

export default AboutPage;