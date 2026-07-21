'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { Zap, Clock, Flame, ChevronDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types';

function useCountdown(targetHour: number) {
  const getRemaining = useCallback(() => {
    const now = new Date();
    const target = new Date();
    target.setHours(targetHour, 0, 0, 0);
    if (now >= target) target.setDate(target.getDate() + 1);
    const diff = Math.max(0, target.getTime() - now.getTime());
    return {
      hours: Math.floor(diff / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  }, [targetHour]);

  const [time, setTime] = useState(getRemaining);

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1_000);
    return () => clearInterval(id);
  }, [getRemaining]);

  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-black text-white font-mono font-extrabold text-3xl sm:text-4xl w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-white/60 text-xs font-semibold mt-1.5 uppercase tracking-wider">{label}</span>
    </div>
  );
}

const SALE_WINDOWS = [
  { label: 'All Flash Sales', hour: 0 },
  { label: 'Morning Deals (ends 12:00)', hour: 12 },
  { label: 'Afternoon Deals (ends 18:00)', hour: 18 },
  { label: 'Midnight Deals (ends 00:00)', hour: 0 },
];

const CATEGORY_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home', value: 'home' },
  { label: 'Sports', value: 'sports' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Toys', value: 'toys' },
];

function FlashSalesContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('best_sellers');
  const countdown = useCountdown(23); // counts down to 23:00

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '24', sort, ...(category ? { category } : {}) });
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          // Flash sales = products with any discount
          const discounted = (json.data as Product[]).filter(
            (p: any) => p.compare_price && p.compare_price > p.price
          );
          setProducts(discounted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sort]);

  const urgencyColor = countdown.hours < 1 ? 'text-red-400' : countdown.hours < 3 ? 'text-orange-400' : 'text-yellow-400';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gray-950 text-white overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-semibold px-3 py-1.5 rounded-full mb-4 animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                LIVE NOW — Limited Quantities
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
                  Flash Sales
                </span>
              </h1>
              <p className="text-white/60 text-lg max-w-xl">
                Massive discounts for a limited time only. These prices won't last — grab yours before they're gone.
              </p>

              {/* Urgency banner */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-white/70">
                  <span className="font-bold text-white">{products.length} deals</span> active right now.
                  Sale ends when the timer hits zero.
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="shrink-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/60 mb-4">
                <Clock className={`w-4 h-4 ${urgencyColor}`} />
                <span>Sale ends in</span>
              </div>
              <div className="flex items-end gap-3">
                <CountdownUnit value={countdown.hours} label="Hours" />
                <span className="text-white/40 font-bold text-3xl mb-4">:</span>
                <CountdownUnit value={countdown.minutes} label="Minutes" />
                <span className="text-white/40 font-bold text-3xl mb-4">:</span>
                <CountdownUnit value={countdown.seconds} label="Seconds" />
              </div>
              {countdown.hours < 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm font-bold mt-3 text-center"
                >
                  ⚠ Ending very soon!
                </motion.p>
              )}
            </div>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10">
            {[
              { icon: Zap, label: 'Active Deals', value: String(products.length || '...') },
              { icon: Flame, label: 'Selling Fast', value: `${Math.floor(products.length * 0.4) || '—'} items` },
              { icon: Clock, label: 'Time Left', value: `${countdown.hours}h ${countdown.minutes}m` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-none">{value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCategory(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  category === f.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 cursor-pointer"
            >
              <option value="best_sellers">Best Sellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No flash sales in this category</h3>
            <p className="text-gray-500 mb-6">Try a different category or check back soon.</p>
            <button onClick={() => setCategory('')}
              className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              View All Flash Sales
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                <Flame className="w-3.5 h-3.5" /> {products.length} flash deals
              </span>{' '}
              active now
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FlashSalesPage() {
  return (
    <Suspense>
      <FlashSalesContent />
    </Suspense>
  );
}
