'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/utils';

export default function CategoriesSection() {
  return (
    <section className="section bg-gray-50">
      <div className="container-max">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore millions of products across every category</p>
          </div>
          <Link href="/categories" className="btn-ghost hidden sm:flex items-center gap-1 text-primary-600">
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100
                           hover:border-primary-200 hover:shadow-card-hover transition-all duration-200 text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: cat.color + '15' }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
