'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Grid3X3, ArrowRight, Package, Search } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  electronics: '📱',
  fashion: '👗',
  'home-garden': '🏡',
  'sports-outdoors': '⚽',
  'beauty-health': '💄',
  'books-media': '📚',
  'toys-games': '🎮',
  automotive: '🚗',
  food: '🍎',
  default: '🛍️',
};

const CATEGORY_COLORS: Record<string, string> = {
  electronics: 'from-blue-500 to-indigo-600',
  fashion: 'from-pink-500 to-rose-600',
  'home-garden': 'from-green-500 to-emerald-600',
  'sports-outdoors': 'from-orange-500 to-amber-600',
  'beauty-health': 'from-purple-500 to-violet-600',
  'books-media': 'from-yellow-500 to-orange-500',
  'toys-games': 'from-red-500 to-pink-600',
  automotive: 'from-gray-600 to-gray-800',
  food: 'from-lime-500 to-green-600',
  default: 'from-primary-500 to-primary-700',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <Grid3X3 className="w-3.5 h-3.5 text-yellow-400" />
              Browse everything we carry
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              All Categories
            </h1>
            <p className="text-white/70 text-lg mb-8">
              From electronics to fashion — find exactly what you're looking for across every department.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl text-base placeholder-gray-400 focus:outline-none shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Grid3X3 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {search ? `No categories matching "${search}"` : 'No categories yet'}
            </h3>
            <p className="text-gray-500">Try a different search term.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-8">
              Showing <strong className="text-gray-900">{filtered.length}</strong> categor{filtered.length === 1 ? 'y' : 'ies'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((cat, i) => {
                const icon = CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS.default;
                const gradient = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS.default;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.06, 0.4) }}
                  >
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      {/* Gradient header */}
                      <div className={`bg-gradient-to-br ${gradient} h-28 flex items-center justify-center relative overflow-hidden`}>
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{cat.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" />
                            <span>{cat.product_count ?? 0} items</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-primary-400" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
