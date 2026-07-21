'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tag, Percent, Copy, Check, ChevronDown, Sparkles, Gift, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

const TABS = [
  { id: 'deals', label: 'All Deals', icon: Percent },
  { id: 'coupons', label: 'Coupon Codes', icon: Tag },
  { id: 'clearance', label: 'Clearance', icon: Sparkles },
];

const COUPON_CODES = [
  { code: 'WELCOME10', discount: '10% off', description: '10% off your first order — no minimum', type: 'percent', expiry: 'No expiry', color: 'from-violet-500 to-purple-600' },
  { code: 'SAVE20', discount: '20% off', description: '20% off orders over $100', type: 'percent', expiry: 'Ends soon', color: 'from-blue-500 to-indigo-600' },
  { code: 'SUMMER15', discount: '15% off', description: '15% off orders over $50', type: 'percent', expiry: 'Seasonal', color: 'from-orange-400 to-rose-500' },
  { code: 'FLASH50', discount: '$50 off', description: '$50 off orders over $150', type: 'fixed', expiry: 'Today only', color: 'from-green-500 to-emerald-600' },
  { code: 'FREESHIP', discount: 'Free shipping', description: 'Free shipping on any order over $25', type: 'shipping', expiry: 'Always active', color: 'from-cyan-500 to-teal-600' },
  { code: 'BULK30', discount: '30% off', description: '30% off when you buy 3 or more items', type: 'percent', expiry: 'Limited time', color: 'from-pink-500 to-rose-600' },
];

const CATEGORY_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home', value: 'home' },
  { label: 'Sports', value: 'sports' },
  { label: 'Beauty', value: 'beauty' },
];

function CouponCard({ coupon }: { coupon: typeof COUPON_CODES[0] }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    toast.success(`Code ${coupon.code} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Gradient strip */}
      <div className={`bg-gradient-to-r ${coupon.color} h-2`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{coupon.discount}</p>
            <p className="text-sm text-gray-600 mt-0.5">{coupon.description}</p>
          </div>
          <span className="shrink-0 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            {coupon.expiry}
          </span>
        </div>
        {/* Code row */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-center">
            <span className="font-mono font-bold text-gray-900 tracking-widest text-sm">{coupon.code}</span>
          </div>
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              copied ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function OffersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('deals');
  const [products, setProducts] = useState<Product[]>([]);
  const [clearanceProducts, setClearanceProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('best_sellers');

  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '24', sort, ...(category ? { category } : {}) });
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const all: Product[] = json.data;
          setProducts(all.filter((p: any) => p.compare_price && p.compare_price > p.price));
          setClearanceProducts(all.filter((p: any) => {
            const disc = p.compare_price ? ((p.compare_price - p.price) / p.compare_price) * 100 : 0;
            return disc >= 30;
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sort]);

  const setCategory = (val: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (val) p.set('category', val); else p.delete('category');
    router.push(`/offers?${p}`);
  };

  const displayedProducts = activeTab === 'clearance' ? clearanceProducts : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                New deals added daily
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2">
                Deals & Offers
              </h1>
              <p className="text-white/75 text-lg max-w-xl">
                Exclusive coupon codes, limited-time discounts, and clearance savings all in one place.
              </p>
            </div>

            {/* Perks */}
            <div className="flex flex-col gap-3 shrink-0">
              {[
                { icon: Tag, text: '6 active coupon codes' },
                { icon: Percent, text: 'Up to 70% off selected items' },
                { icon: Truck, text: 'Free shipping available' },
                { icon: Gift, text: 'Bundle deals & gift sets' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-white/80">
                  <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-yellow-300" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-10 bg-white/10 p-1 rounded-xl w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === id ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Coupons tab */}
        {activeTab === 'coupons' ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Active Coupon Codes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {COUPON_CODES.map((c, i) => (
                <motion.div key={c.code} transition={{ delay: i * 0.05 }}>
                  <CouponCard coupon={c} />
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6 text-center">
              <Gift className="w-10 h-10 text-violet-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Unlock exclusive member discounts</h3>
              <p className="text-gray-600 text-sm mb-4">Sign up for a free account to access member-only deals, early sale access, and personalised offers.</p>
              <a href="/auth/register" className="inline-block px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm">
                Create Free Account
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Filter + sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((f) => (
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
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activeTab === 'clearance' ? 'No clearance items right now' : 'No deals in this category'}
                </h3>
                <p className="text-gray-500 mb-6">Check back soon — we add new deals daily.</p>
                <button onClick={() => setCategory('')} className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                  View All
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  Showing <strong className="text-gray-900">{displayedProducts.length}</strong>{' '}
                  {activeTab === 'clearance' ? 'clearance items (30%+ off)' : 'discounted products'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {displayedProducts.map((product, i) => (
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
          </>
        )}
      </div>
    </div>
  );
}

export default function OffersPage() {
  return (
    <Suspense>
      <OffersContent />
    </Suspense>
  );
}
