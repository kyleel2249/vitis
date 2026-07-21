'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { POSTS, CATEGORIES, CATEGORY_COLORS, formatDate } from './data';

function CategoryPill({ label }: { label: string }) {
  const color = CATEGORY_COLORS[label] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      <Tag className="w-3 h-3" />{label}
    </span>
  );
}

function PostCard({ post, index }: { post: typeof POSTS[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block card-hover overflow-hidden h-full">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryPill label={post.category} />
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />{post.readTime} min read
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-gray-100">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-semibold text-gray-800">{post.author.name}</p>
              <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = POSTS.find((p) => p.featured)!;
  const filtered = POSTS.filter(
    (p) => !p.featured && (activeCategory === 'All' || p.category === activeCategory)
  );

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-gray-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 bg-primary-500/20 text-primary-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ✍️ The Vitis Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Insights for Sellers,<br />Guides for Shoppers
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Strategy, stories, and practical advice from the team behind Vitis — and the vendor community building on it.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Featured post */}
        <section className="mb-14">
          <h2 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-5">Featured</h2>
          <Link href={`/blog/${featured.slug}`} className="group block card-hover overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[340px] overflow-hidden bg-gray-100">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryPill label={featured.category} />
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />{featured.readTime} min read
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <Image
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{featured.author.name}</p>
                    <p className="text-xs text-gray-400">{featured.author.role} · {formatDate(featured.publishedAt)}</p>
                  </div>
                  <span className="btn-primary py-2 px-4 text-sm">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No posts in this category yet.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <section className="mt-20 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Stay in the loop</h2>
          <p className="text-primary-200 mb-7 max-w-md mx-auto">
            Get the latest vendor tips, platform updates, and shopping guides delivered to your inbox — no fluff, no spam.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <button type="submit" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
