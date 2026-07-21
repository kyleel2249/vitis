'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types';

type Tab = 'featured' | 'trending' | 'deals' | 'new';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'featured', label: 'Featured', icon: Star },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'deals', label: 'Best Deals', icon: Zap },
  { id: 'new', label: 'New Arrivals', icon: ArrowRight },
];

export default function FeaturedProducts() {
  const [tab, setTab] = useState<Tab>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '8' });
    if (tab === 'featured') params.set('featured', 'true');
    if (tab === 'trending') params.set('sort', 'rating');
    if (tab === 'deals') params.set('sort', 'discount');
    if (tab === 'new') params.set('sort', 'newest');

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tab]);

  return (
    <section className="section">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">Discover Products</h2>
            <p className="section-subtitle">Curated picks just for you</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No products found</div>
        ) : (
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        <div className="text-center mt-10">
          <Link href="/products" className="btn-outline inline-flex">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
