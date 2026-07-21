import Link from 'next/link';
import { BookOpen, Video, FileText, HelpCircle, Download, ArrowRight, Lightbulb, BarChart3, Package, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Resources — Vitis Seller Hub',
  description: 'Guides, tutorials, and tools to help you grow your Vitis store. Everything from listing best practices to marketing strategies.',
};

const GUIDES = [
  {
    icon: Package,
    category: 'Getting Started',
    title: 'How to list your first product',
    desc: 'A step-by-step walkthrough of creating a product listing — photos, pricing, variants, and going live.',
    tag: 'Beginner',
    tagColor: 'bg-green-100 text-green-700',
    href: '#',
  },
  {
    icon: BarChart3,
    category: 'Analytics',
    title: 'Understanding your vendor dashboard',
    desc: 'Learn to read your earnings chart, top products, and order stats to make smarter decisions.',
    tag: 'Beginner',
    tagColor: 'bg-green-100 text-green-700',
    href: '/vendor/dashboard',
  },
  {
    icon: DollarSign,
    category: 'Pricing',
    title: 'Pricing strategy for maximum profit',
    desc: 'How to set competitive prices, run promotions, and use coupons without eating into your margins.',
    tag: 'Intermediate',
    tagColor: 'bg-blue-100 text-blue-700',
    href: '#',
  },
  {
    icon: Lightbulb,
    category: 'Marketing',
    title: 'Driving traffic to your store',
    desc: 'SEO tips, social sharing, and promotional tactics to bring more buyers to your Vitis store.',
    tag: 'Intermediate',
    tagColor: 'bg-blue-100 text-blue-700',
    href: '#',
  },
  {
    icon: Video,
    category: 'Product Photography',
    title: 'Taking photos that convert',
    desc: 'Lighting, angles, and editing tips that make your products stand out and drive more sales.',
    tag: 'Beginner',
    tagColor: 'bg-green-100 text-green-700',
    href: '#',
  },
  {
    icon: FileText,
    category: 'Operations',
    title: 'Managing orders & shipping',
    desc: 'From fulfilling your first order to setting up shipping zones and handling returns efficiently.',
    tag: 'Intermediate',
    tagColor: 'bg-blue-100 text-blue-700',
    href: '#',
  },
];

const QUICK_LINKS = [
  { label: 'Commission Rates', href: '/commission-rates', desc: 'See exactly what you keep per sale' },
  { label: 'Affiliate Program', href: '/affiliates', desc: 'Earn extra by referring other sellers' },
  { label: 'Vendor Dashboard', href: '/vendor/dashboard', desc: 'Manage your store and orders' },
  { label: 'Start Selling', href: '/start-selling', desc: 'Open your store in minutes' },
];

const FAQS = [
  {
    q: 'When do I get paid?',
    a: 'Payouts are processed every week on Friday. You need a minimum balance of $10 to receive a payout.',
  },
  {
    q: 'How do I handle returns?',
    a: 'Buyers can request returns within 30 days of delivery. Approved returns are deducted from your next payout and we handle the dispute process.',
  },
  {
    q: 'Can I sell internationally?',
    a: 'Yes — Vitis ships to 50+ countries. You can configure which regions you want to sell to from your shipping settings.',
  },
  {
    q: 'Is there a product listing limit?',
    a: 'No — you can list as many products as you like at no extra cost.',
  },
];

export default function VendorResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
              Seller Education Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Vendor Resources
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Everything you need to build, grow, and scale your Vitis store — from your first listing to your first thousand orders.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guides grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides & Tutorials</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {GUIDES.map(({ icon: Icon, category, title, desc, tag, tagColor, href }) => (
                  <Link
                    key={title}
                    href={href}
                    className="group card p-5 hover:shadow-card-hover transition-all block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor}`}>{tag}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">{category}</p>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    <div className="flex items-center gap-1 mt-4 text-primary-600 text-sm font-medium">
                      Read guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary-500" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {FAQS.map(({ q, a }) => (
                  <div key={q} className="card p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick links */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                {QUICK_LINKS.map(({ label, href, desc }) => (
                  <Link key={label} href={href}
                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Download card */}
            <div className="card p-5 bg-primary-50 border-primary-100">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mb-3">
                <Download className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Seller Handbook</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download our complete guide to selling on Vitis — policies, tips, and best practices in one PDF.
              </p>
              <button className="w-full btn-primary text-sm py-2.5">
                Download PDF
              </button>
            </div>

            {/* Support */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-2">Need more help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Our vendor support team is available 24/7 to answer questions about your store.
              </p>
              <Link href="/contact" className="w-full btn-secondary text-sm py-2.5 text-center block">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
