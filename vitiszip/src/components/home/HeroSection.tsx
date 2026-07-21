'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Sparkles, ShoppingBag, Zap, Shield, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HERO_SLIDES = [
  {
    title: 'The Future of Commerce',
    subtitle: 'Smart Shopping',
    description: 'Shop smarter with instant search, personalized deals, and millions of products from top brands worldwide.',
    cta: 'Start Shopping',
    ctaHref: '/products',
    badge: '🛍️ Smart Shopping',
    bgColor: '#1a1a2e',
    bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Summer Sale is Live',
    subtitle: 'Up to 70% Off',
    description: 'Discover incredible deals across fashion, electronics, home & more. Limited time offers updated every hour.',
    cta: 'Shop the Sale',
    ctaHref: '/deals',
    badge: '⚡ Flash Sale',
    bgColor: '#7c0c20',
    bgImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Sell Globally Today',
    subtitle: 'Join 500K+ Vendors',
    description: 'Turn your passion into profit. Set up your store in minutes and reach millions of customers worldwide.',
    cta: 'Start Selling',
    ctaHref: '/vendor/register',
    badge: '🌍 Global Marketplace',
    bgColor: '#064e3b',
    bgImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Premium Electronics',
    subtitle: 'Top Brands, Best Prices',
    description: 'From smartphones to smart TVs — the latest tech at unbeatable prices with same-day delivery available.',
    cta: 'Shop Electronics',
    ctaHref: '/products?category=electronics',
    badge: '💻 Tech Deals',
    bgColor: '#0f172a',
    bgImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Style Your World',
    subtitle: 'Fashion & Accessories',
    description: 'Discover curated fashion from hundreds of independent designers and global brands all in one place.',
    cta: 'Shop Fashion',
    ctaHref: '/products?category=fashion',
    badge: '👗 New Collection',
    bgColor: '#4a044e',
    bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Elevate Your Home',
    subtitle: 'Home & Garden Essentials',
    description: 'Transform every room with handpicked furniture, décor, and appliances from premium home brands.',
    cta: 'Shop Home',
    ctaHref: '/products?category=home',
    badge: '🏠 Home Refresh',
    bgColor: '#1c3a2f',
    bgImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Train Smarter',
    subtitle: 'Sports & Outdoors',
    description: 'Gear up for greatness — premium sports equipment, activewear, and outdoor adventures gear.',
    cta: 'Shop Sports',
    ctaHref: '/products?category=sports',
    badge: '⚽ Active Living',
    bgColor: '#1e3a5f',
    bgImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Glow Up',
    subtitle: 'Beauty & Health',
    description: 'Shop clean beauty, skincare essentials, and wellness products loved by millions worldwide.',
    cta: 'Shop Beauty',
    ctaHref: '/products?category=beauty',
    badge: '💄 Clean Beauty',
    bgColor: '#4a1942',
    bgImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Read, Learn, Grow',
    subtitle: 'Books & Knowledge',
    description: 'Expand your mind with bestsellers, educational resources, and digital content from top authors.',
    cta: 'Shop Books',
    ctaHref: '/products?category=books',
    badge: '📚 Bestsellers',
    bgColor: '#1e1b4b',
    bgImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Play. Create. Imagine.',
    subtitle: 'Toys & Games',
    description: 'From building sets to board games — spark joy for kids of all ages with our curated toy collection.',
    cta: 'Shop Toys',
    ctaHref: '/products?category=toys',
    badge: '🎮 Fun for All Ages',
    bgColor: '#7f1d1d',
    bgImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Watch. Experience. Love.',
    subtitle: 'Premium Timepieces',
    description: 'Explore an exclusive collection of watches — from Swiss craftsmanship to modern smart wearables.',
    cta: 'Shop Watches',
    ctaHref: '/products?category=fashion',
    badge: '⌚ Luxury & Sport',
    bgColor: '#292524',
    bgImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&h=900&fit=crop&q=80',
  },
  {
    title: 'Exclusive Memberships',
    subtitle: 'Vitis Plus',
    description: 'Get free shipping, early access to deals, and exclusive member pricing on every order, every day.',
    cta: 'Join Vitis Plus',
    ctaHref: '/auth/register',
    badge: '⭐ Members Only',
    bgColor: '#713f12',
    bgImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=900&fit=crop&q=80',
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: 'Secure Checkout' },
  { icon: Truck, label: 'Fast Shipping' },
  { icon: Zap, label: 'Instant Search' },
  { icon: ShoppingBag, label: '10M+ Products' },
];

export default function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[current];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.bgImage}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            unoptimized
          />
          {/* Color tint overlay so text stays readable */}
          <div className="absolute inset-0" style={{ backgroundColor: slide.bgColor, opacity: 0.78 }} />
        </motion.div>
      </AnimatePresence>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05]" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 mb-6"
            >
              <span>{slide.badge}</span>
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-white/70 text-xl font-medium mb-2">{slide.subtitle}</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-none tracking-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed mb-8">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex gap-3 mb-8"
          >
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl text-base placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
              />
            </div>
            <button type="submit"
              className="px-6 py-4 bg-white text-primary-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors shadow-xl flex items-center gap-2 whitespace-nowrap">
              Search <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            <Link href={slide.ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              {slide.cta} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 hover:bg-white/25 transition-all">
              <Sparkles className="w-4 h-4" /> Browse All Products
            </Link>
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-12">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-4 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="relative bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
            <div className="text-white/60 text-sm">
              Trusted by <strong className="text-white">2M+</strong> customers worldwide
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
