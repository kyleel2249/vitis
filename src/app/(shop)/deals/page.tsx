'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Zap, Clock, Tag, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types';

const DEAL_FILTERS = [
  { label: 'All Deals', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home & Garden', value: 'home' },
  { label: 'Sports', value: 'sports' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Books', value: 'books' },
  { label: 'Toys', value: 'toys' },
];

const SORT_OPTIONS = [
  { value: 'best_sellers', label: 'Best Sellers' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

function DealsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('best_sellers');
  const [page, setPage] = useState(1);

  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const params = new URLSearchParams({
      limit: '24',
      page: '1',
      sort,
      ...(category ? { category } : {}),
    });
    // Deals = products that have a compare_price (i.e. discounted)
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          // Client-side filter to only products with a compare_price (on sale)
          const onSale = (json.data as Product[]).filter(
            (p: any) => p.compare_price && p.compare_price > p.price
          );
          setProducts(onSale);
          setTotal(onSale.length);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sort]);

  const setCategory = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set('category', val);
    else params.delete('category');
    router.push(`/deals?${params}`);
  };

  // Savings calculator
  const savingsOf = (p: any) =>
    p.compare_price ? Math.round(((p.compare_price - p.price) / p.compare_price) * 100) : 0;

  const totalSavings = products.reduce(
    (acc, p: any) => acc + (p.compare_price ? p.compare_price - p.price : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Flash Deals — Updated Hourly
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2">
                Today's Best Deals
              </h1>
              <p className="text-white/70 text-lg max-w-xl">
                Hand-picked discounts across every category. Don't miss out — prices change daily.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-yellow-400">{total}</p>
                <p className="text-white/60 text-sm mt-0.5">Active Deals</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-green-400">
                  Up to {products.length ? Math.max(...products.map(savingsOf)) : 0}%
                </p>
                <p className="text-white/60 text-sm mt-0.5">Off Original Price</p>
              </div>
              <div className="text-center hidden sm:block">
                <p className="text-3xl font-extrabold text-white">
                  ${totalSavings.toFixed(0)}
                </p>
                <p className="text-white/60 text-sm mt-0.5">Total You Save</p>
              </div>
            </div>
          </div>

          {/* Active coupon codes */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { code: 'WELCOME10', label: '10% off everything' },
              { code: 'SAVE20', label: '20% off $100+' },
              { code: 'SUMMER15', label: '15% off $50+' },
              { code: 'FLASH50', label: '$50 off $150+' },
              { code: 'FREESHIP', label: 'Free shipping on $25+' },
            ].map(({ code, label }) => (
              <div key={code}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
                <Tag className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-bold text-yellow-300">{code}</span>
                <span className="text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters + Sort bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {DEAL_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCategory(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  category === f.value
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No deals in this category right now</h3>
            <p className="text-gray-500 mb-6">Check back soon — deals update every hour.</p>
            <button onClick={() => setCategory('')}
              className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              View All Deals
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing <strong className="text-gray-900">{products.length}</strong> deals
              {category && ` in ${DEAL_FILTERS.find((f) => f.value === category)?.label || category}`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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

export default function DealsPage() {
  return (
    <Suspense>
      <DealsContent />
    </Suspense>
  );
}
