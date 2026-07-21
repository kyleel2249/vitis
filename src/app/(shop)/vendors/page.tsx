'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Star, ShieldCheck, Store, ArrowRight, Package, Globe, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

const VENDOR_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400&h=300&fit=crop&q=80',
];

function VendorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setLoading(true);
    fetch('/api/vendors?limit=50')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setVendors(json.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(search ? `/vendors?q=${encodeURIComponent(search)}` : '/vendors');
  };

  const filtered = vendors.filter((v) =>
    !search ||
    v.store_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
                <Store className="w-3.5 h-3.5 text-yellow-400" />
                Trusted Sellers on Vitis
              </div>
              <h1 className="text-5xl font-extrabold leading-tight mb-4 text-white">
                Discover Independent Vendors
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Shop directly from passionate sellers around the world. Every vendor on Vitis is reviewed and trusted by our community.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search vendors…"
                    className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl text-base placeholder-gray-400 focus:outline-none shadow-xl"
                  />
                </div>
                <button type="submit"
                  className="px-6 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-xl whitespace-nowrap">
                  Search
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap lg:flex-col gap-6 shrink-0">
              {[
                { icon: Store, value: `${vendors.length || '500'}+`, label: 'Active Vendors' },
                { icon: Globe, value: '50+', label: 'Countries' },
                { icon: TrendingUp, value: '$2M+', label: 'Paid to Vendors' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl leading-none">{value}</p>
                    <p className="text-white/50 text-sm">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Become a vendor CTA */}
      <div className="bg-gradient-to-r from-green-700 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-semibold text-base">
            🚀 Ready to sell your products to millions of shoppers?
          </p>
          <Link
            href="/vendor/register"
            className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors shrink-0 text-sm"
          >
            <Plus className="w-4 h-4" /> Become a Vendor
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Store className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {search ? `No vendors found for "${search}"` : 'No vendors yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search ? 'Try a different search term.' : 'Be the first to open a store on Vitis!'}
            </p>
            <Link href="/vendor/register"
              className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" /> Open Your Store
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing <strong className="text-gray-900">{filtered.length}</strong> vendor{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((vendor, i) => {
                const coverImg = VENDOR_PLACEHOLDERS[i % VENDOR_PLACEHOLDERS.length];
                return (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.06, 0.4) }}
                  >
                    <Link
                      href={`/products?vendor_id=${vendor.id}`}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 block"
                    >
                      {/* Cover */}
                      <div className="relative h-36 overflow-hidden">
                        <Image
                          src={coverImg}
                          alt={vendor.store_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        {/* Store initial badge */}
                        <div className="absolute bottom-0 left-4 translate-y-1/2">
                          <div className="w-14 h-14 bg-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center">
                            <span className="text-xl font-extrabold text-gray-800">
                              {vendor.store_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {vendor.is_verified && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="pt-10 pb-5 px-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-black leading-tight">
                            {vendor.store_name}
                          </h3>
                          {vendor.rating && (
                            <div className="flex items-center gap-1 shrink-0">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-bold text-gray-900">{Number(vendor.rating).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {vendor.description || 'Quality products from a trusted Vitis seller.'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" />
                            <span>{vendor.product_count || 0} products</span>
                          </div>
                          <span className="font-semibold text-black flex items-center gap-1 group-hover:gap-2 transition-all">
                            Visit store <ArrowRight className="w-3 h-3" />
                          </span>
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

export default function VendorsPage() {
  return (
    <Suspense>
      <VendorsContent />
    </Suspense>
  );
}
