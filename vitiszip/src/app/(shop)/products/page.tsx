'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Grid, List, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import { PRODUCT_CATEGORIES, cn } from '@/lib/utils';
import type { Product } from '@/types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'best_sellers', label: 'Best Sellers' },
];

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 – $50', min: 25, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $250', min: 100, max: 250 },
  { label: '$250+', min: 250, max: 999999 },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '16',
      ...(q && { q }),
      ...(category && { category }),
      ...(sort && { sort }),
      ...(minPrice && { min_price: minPrice }),
      ...(maxPrice && { max_price: maxPrice }),
    });
    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, q, category, sort, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    router.push(`/products?${p}`);
  };

  const totalPages = Math.ceil(total / 16);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {q ? `Results for "${q}"` : category ? PRODUCT_CATEGORIES.find(c => c.id === category)?.name || 'Products' : 'All Products'}
          </h1>
          {!loading && <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} products found</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button onClick={() => setView('grid')} className={cn('p-1.5 rounded-lg transition-all', view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400')}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={cn('p-1.5 rounded-lg transition-all', view === 'list' ? 'bg-white shadow-sm' : 'text-gray-400')}>
              <List className="w-4 h-4" />
            </button>
          </div>

          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary py-2 flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden lg:block w-64 flex-shrink-0"
            >
              <div className="card p-5 space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button onClick={() => router.push('/products')} className="text-xs text-primary-600 hover:underline">Clear all</button>
                </div>

                {/* Category */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
                  <div className="space-y-1">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button key={cat.id} onClick={() => updateParam('category', category === cat.id ? '' : cat.id)}
                        className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                          category === cat.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                        <span>{cat.icon}</span><span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-1">
                    {PRICE_RANGES.map((range) => (
                      <button key={range.label}
                        onClick={() => { updateParam('min_price', String(range.min)); updateParam('max_price', range.max === 999999 ? '' : String(range.max)); }}
                        className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                          minPrice === String(range.min) ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Customer Rating</h4>
                  <div className="space-y-1">
                    {[4, 3, 2].map((r) => (
                      <button key={r} onClick={() => updateParam('min_rating', String(r))}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        <span className="text-yellow-400">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                        <span>& up</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Active filters */}
          {(q || category || minPrice) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {q && <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">Search: {q} <button onClick={() => updateParam('q', '')}><X className="w-3 h-3" /></button></span>}
              {category && <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">{PRODUCT_CATEGORIES.find(c => c.id === category)?.name} <button onClick={() => updateParam('category', '')}><X className="w-3 h-3" /></button></span>}
              {minPrice && <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">From ${minPrice} <button onClick={() => updateParam('min_price', '')}><X className="w-3 h-3" /></button></span>}
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={16} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className={cn(
                view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'
              )}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} variant={view === 'list' ? 'horizontal' : 'default'} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">← Prev</button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn('w-9 h-9 rounded-xl text-sm font-medium transition-all',
                        p === page ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300')}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
