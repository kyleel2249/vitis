'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, ArrowRight, ShieldCheck, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const BRANDS = [
  {
    name: 'Apple',
    slug: 'apple',
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&h=300&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.9,
    products: 48,
    verified: true,
    description: 'Premium consumer electronics, software and services.',
    color: '#1d1d1f',
  },
  {
    name: 'Nike',
    slug: 'nike',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&h=300&fit=crop&q=80',
    category: 'Sports & Fashion',
    rating: 4.8,
    products: 124,
    verified: true,
    description: 'Just do it. World-leading athletic footwear and apparel.',
    color: '#111111',
  },
  {
    name: 'Sony',
    slug: 'sony',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=300&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.7,
    products: 63,
    verified: true,
    description: 'World-class audio, entertainment and imaging products.',
    color: '#000000',
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=300&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.6,
    products: 89,
    verified: true,
    description: 'Innovative technology for everyone — from TVs to smartphones.',
    color: '#1428a0',
  },
  {
    name: 'Dyson',
    slug: 'dyson',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=300&fit=crop&q=80',
    category: 'Home & Garden',
    rating: 4.8,
    products: 32,
    verified: true,
    description: 'Engineering-led technology for home and personal care.',
    color: '#c5a028',
  },
  {
    name: 'Levi\'s',
    slug: 'levis',
    logo: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&h=300&fit=crop&q=80',
    category: 'Fashion',
    rating: 4.5,
    products: 77,
    verified: true,
    description: 'Iconic American denim brand since 1853.',
    color: '#cc2529',
  },
  {
    name: 'LEGO',
    slug: 'lego',
    logo: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop&q=80',
    category: 'Toys & Games',
    rating: 4.9,
    products: 41,
    verified: true,
    description: 'The world\'s most beloved construction toy brand.',
    color: '#e3000b',
  },
  {
    name: 'Instant Brands',
    slug: 'instant-brands',
    logo: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop&q=80',
    category: 'Home & Kitchen',
    rating: 4.7,
    products: 28,
    verified: true,
    description: 'Smart home appliances that make cooking effortless.',
    color: '#e07b39',
  },
  {
    name: 'Hydro Flask',
    slug: 'hydro-flask',
    logo: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1504980989-a1c7c1803f33?w=800&h=300&fit=crop&q=80',
    category: 'Sports',
    rating: 4.8,
    products: 19,
    verified: true,
    description: 'Premium insulated drinkware for an active lifestyle.',
    color: '#2d6a4f',
  },
  {
    name: 'CeraVe',
    slug: 'cerave',
    logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=300&fit=crop&q=80',
    category: 'Beauty & Health',
    rating: 4.7,
    products: 34,
    verified: true,
    description: 'Dermatologist-developed skincare with essential ceramides.',
    color: '#005eb8',
  },
  {
    name: 'Kindle',
    slug: 'kindle',
    logo: 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=300&fit=crop&q=80',
    category: 'Books & Media',
    rating: 4.6,
    products: 15,
    verified: true,
    description: 'Read millions of books anytime, anywhere.',
    color: '#232f3e',
  },
  {
    name: 'Logitech',
    slug: 'logitech',
    logo: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&h=200&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=300&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.6,
    products: 55,
    verified: false,
    description: 'Peripherals and software for computers and mobile devices.',
    color: '#00b2d6',
  },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty & Health', 'Books & Media', 'Toys & Games'];

export default function BrandsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = BRANDS.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || b.category.includes(category.replace('Home & Garden', 'Home'));
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              Verified Brands on Vitis
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4 text-white">
              Shop Your Favourite Brands
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Every brand on Vitis is verified for authenticity. Shop with confidence from the world's most trusted names.
            </p>

            {/* Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands…"
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
              />
            </div>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-white/10">
            {[
              { icon: ShieldCheck, value: '100%', label: 'Verified Authentic' },
              { icon: Globe, value: '500+', label: 'Global Brands' },
              { icon: Award, value: '4.8★', label: 'Average Brand Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{value}</p>
                  <p className="text-white/50 text-sm">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                category === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <strong className="text-gray-900">{filtered.length}</strong> brand{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Brand grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Award className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-500">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((brand, i) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  href={`/products?q=${encodeURIComponent(brand.name)}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 block"
                >
                  {/* Cover image */}
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={brand.cover}
                      alt={brand.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                    <div className="absolute inset-0" style={{ backgroundColor: brand.color, opacity: 0.55 }} />
                    {/* Logo thumb */}
                    <div className="absolute bottom-0 left-4 translate-y-1/2">
                      <div className="w-14 h-14 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-white">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    {brand.verified && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="pt-9 pb-5 px-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-black">{brand.name}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">{brand.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-400 mb-2">{brand.category}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{brand.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{brand.products} products</span>
                      <span className="text-xs font-semibold text-black flex items-center gap-1 group-hover:gap-2 transition-all">
                        Shop now <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
