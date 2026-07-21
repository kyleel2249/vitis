import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Tag, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import { getPost, getRelatedPosts, formatDate, POSTS, CATEGORY_COLORS } from '../data';

// Allow CategoryPill to exist server-side without 'use client'
const CATEGORY_PILL_COLORS: Record<string, string> = {
  Commerce:           'bg-blue-100 text-blue-700',
  'Vendor Tips':      'bg-purple-100 text-purple-700',
  'Shopping Guides':  'bg-green-100 text-green-700',
  'Platform Updates': 'bg-orange-100 text-orange-700',
  Sustainability:     'bg-teal-100 text-teal-700',
};

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Vitis Blog`,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

function renderContent(markdown: string) {
  const lines = markdown.trim().split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-gray-900 mt-10 mb-4 first:mt-0">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={key++} className="font-semibold text-gray-900 mt-5 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- **')) {
      // Bold bullet: "- **Label:** text"
      const match = line.match(/^- \*\*(.+?)\*\*[:：]?\s*(.*)/);
      if (match) {
        elements.push(
          <li key={key++} className="text-gray-700 leading-relaxed ml-4 list-disc">
            <strong className="text-gray-900">{match[1]}:</strong> {match[2]}
          </li>
        );
      } else {
        elements.push(
          <li key={key++} className="text-gray-700 leading-relaxed ml-4 list-disc">
            {line.slice(2)}
          </li>
        );
      }
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="text-gray-700 leading-relaxed ml-4 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (/^\d+\. /.test(line)) {
      elements.push(
        <li key={key++} className="text-gray-700 leading-relaxed ml-4 list-decimal">
          {line.replace(/^\d+\. /, '')}
        </li>
      );
    } else {
      // Inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={key++} className="text-gray-700 leading-relaxed text-[1.0625rem]">
          {parts.map((p, idx) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={idx} className="text-gray-900 font-semibold">{p.slice(2, -2)}</strong>;
            }
            return p;
          })}
        </p>
      );
    }
  }

  return <div className="space-y-4">{elements}</div>;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const pillColor = CATEGORY_PILL_COLORS[post.category] || 'bg-gray-100 text-gray-700';

  return (
    <>
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Hero image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      </div>

      {/* Article + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Article */}
          <article>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${pillColor}`}>
                <Tag className="w-3 h-3" />{post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <CalendarDays className="w-4 h-4" />{formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="w-4 h-4" />{post.readTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-primary-400 pl-4">
              {post.excerpt}
            </p>

            {/* Body */}
            <div className="mt-2">
              {renderContent(post.content)}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author bio */}
            <div className="mt-8 card p-6 flex items-start gap-4">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={56}
                height={56}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="font-bold text-gray-900">{post.author.name}</p>
                <p className="text-sm text-primary-600 mb-2">{post.author.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Part of the Vitis team, focused on helping sellers and shoppers get the most out of the platform.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* More from category */}
            <div className="card p-5 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-4">More from the Blog</h3>
              <div className="space-y-4">
                {POSTS.filter((p) => p.slug !== post.slug).slice(0, 4).map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{p.readTime} min · {p.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline">
                View all posts <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => {
                const color = CATEGORY_PILL_COLORS[p.category] || 'bg-gray-100 text-gray-700';
                return (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group card-hover overflow-hidden block">
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${color}`}>
                        <Tag className="w-3 h-3" />{p.category}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2">{p.readTime} min read</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
