'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Trophy, Medal, TrendingUp, Star, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types';

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home & Garden', value: 'home' },
  { label: 'Sports', value: 'sports' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Books', value: 'books' },
  { label: 'Toys', value: 'toys' },
  { label: 'Food', value: 'food' },
];

const PODIUM = [
  { rank: 2, offset: 'pt-8', badge: 'bg-gray-300 text-gray-800', icon: Medal, label: '#2' },
  { rank: 1, offset: '', badge: 'bg-yellow-400 text-yellow-900', icon: Crown, label: '#1 Best Seller' },
  { rank: 3, offset: 'pt-14', badge: 'bg-amber-600 text-white', icon: Medal, label: '#3' },
];

function BestSellersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: '24',
      sort: 'best_sellers',
      ...(category ? { category } : {}),
    });
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((json) => { if (json.success) setProducts(json.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const setCategory = (val: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (val) p.set('category', val); else p.delete('category');
    router.push(`/best-sellers?${p}`);
  };

  const hasPodium = !loading && products.length >= 3;
  // Podium order: 2nd, 1st, 3rd
  const podiumProducts = hasPodium ? [products[1], products[0], products[2]] : [];
  const restProducts = hasPodium ? products.slice(3) : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                <TrendingUp className="w-3.5 h-3.5" />
                Rankings updated daily
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3">
                Best Sellers
              </h1>
              <p className="text-white/85 text-lg max-w-xl">
                The products customers love most — ranked by sales, ratings, and satisfaction. Trusted by thousands of shoppers every day.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 shrink-0">
              {[
                { icon: Trophy, value: '#1', label: 'Top Ranked' },
                { icon: Star, value: '4.8★', label: 'Avg Rating' },
                { icon: TrendingUp, value: '10k+', label: 'Sold Today' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-extrabold leading-none">{value}</p>
                  <p className="text-white/70 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((f) => (
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

        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try a different category.</p>
            <button onClick={() => setCategory('')}
              className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              View All Categories
            </button>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            {hasPodium && (
              <div className="mb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" /> Top 3 This Week
                </h2>
                <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end">
                  {PODIUM.map(({ rank, offset, badge, icon: Icon, label }, idx) => (
                    <div key={rank} className={`flex flex-col ${offset}`}>
                      <div className={`flex items-center gap-1.5 justify-center mb-3 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full self-center ${badge}`}>
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">{label}</span>
                        <span className="sm:hidden">#{rank}</span>
                      </div>
                      <div className={rank === 1 ? 'ring-2 ring-yellow-400 ring-offset-2 rounded-2xl' : ''}>
                        <ProductCard product={podiumProducts[idx]} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of rankings */}
            {restProducts.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-gray-400" />
                  {hasPodium ? 'More Best Sellers' : 'Best Sellers'}
                  <span className="text-sm font-normal text-gray-400">({restProducts.length} products)</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {restProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: Math.min(i * 0.04, 0.3) }}
                        className="relative"
                      >
                        {/* Rank badge */}
                        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
                          #{i + 4}
                        </div>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BestSellersPage() {
  return (
    <Suspense>
      <BestSellersContent />
    </Suspense>
  );
}
