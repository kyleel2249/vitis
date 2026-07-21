import Link from 'next/link';
import { Search, ShoppingBag, CreditCard, Truck, RotateCcw, User, MessageCircle, ChevronRight, BookOpen, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — Vitis',
  description: 'Find answers to your questions about orders, shipping, returns, payments, and your Vitis account.',
};

const TOPICS = [
  {
    icon: ShoppingBag,
    title: 'Orders',
    color: 'bg-blue-50 text-blue-600',
    links: [
      { label: 'Track my order', href: '/order-status' },
      { label: 'Cancel or modify an order', href: '/help#cancel' },
      { label: 'Missing or incorrect item', href: '/help#missing' },
      { label: 'Order confirmation email', href: '/help#confirmation' },
    ],
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    color: 'bg-orange-50 text-orange-600',
    links: [
      { label: 'How to return an item', href: '/returns' },
      { label: 'Refund timeline', href: '/returns#timeline' },
      { label: 'Non-returnable items', href: '/returns#exclusions' },
      { label: 'Damaged or defective items', href: '/returns#damaged' },
    ],
  },
  {
    icon: Truck,
    title: 'Shipping',
    color: 'bg-green-50 text-green-600',
    links: [
      { label: 'Delivery times & options', href: '/shipping' },
      { label: 'International shipping', href: '/shipping#international' },
      { label: 'Free shipping eligibility', href: '/shipping#free' },
      { label: 'Shipping to PO boxes', href: '/shipping#po-box' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments',
    color: 'bg-purple-50 text-purple-600',
    links: [
      { label: 'Accepted payment methods', href: '/help#payments' },
      { label: 'Apply a coupon code', href: '/help#coupons' },
      { label: 'Payment declined', href: '/help#declined' },
      { label: 'Invoice & receipts', href: '/help#receipts' },
    ],
  },
  {
    icon: User,
    title: 'Account',
    color: 'bg-pink-50 text-pink-600',
    links: [
      { label: 'Create an account', href: '/auth/register' },
      { label: 'Reset your password', href: '/auth/login' },
      { label: 'Update personal details', href: '/account/orders' },
      { label: 'Delete your account', href: '/contact' },
    ],
  },
  {
    icon: MessageCircle,
    title: 'Selling on Vitis',
    color: 'bg-yellow-50 text-yellow-600',
    links: [
      { label: 'How to start selling', href: '/start-selling' },
      { label: 'Commission rates', href: '/commission-rates' },
      { label: 'Vendor resources', href: '/vendor-resources' },
      { label: 'Affiliate program', href: '/affiliates' },
    ],
  },
];

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Go to Order Status and enter your order number and email address. You\'ll see real-time shipping updates.',
  },
  {
    q: 'What is the return window?',
    a: 'Most items can be returned within 30 days of delivery. Some categories (digital products, perishables) are non-returnable.',
  },
  {
    q: 'When will my refund arrive?',
    a: 'Refunds are processed within 3–5 business days of receiving your return. Card refunds may take an additional 3–5 days to appear on your statement.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be cancelled or modified within 1 hour of placement, before the vendor begins processing. Contact us immediately if you need to make a change.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. All payments are processed through Stripe and are PCI-DSS compliant. Vitis never stores your full card details.',
  },
  {
    q: 'Do you offer price matching?',
    a: 'We don\'t offer formal price matching, but check our Deals & Offers page for current promotions and coupon codes.',
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
            Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">How can we help?</h1>
          <p className="text-white/70 text-lg mb-8">
            Find quick answers, browse topics, or get in touch with our support team.
          </p>

          {/* Search box (visual) */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search help articles…"
              className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl text-base placeholder-gray-400 focus:outline-none shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Topic cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOPICS.map(({ icon: Icon, title, color, links }) => (
              <div key={title} className="card p-5">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors group"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-400 flex-shrink-0" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary-500" /> Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="card p-6">
                <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Still need help */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with a support agent', href: '/contact', cta: 'Start chat' },
            { icon: Truck, title: 'Track Order', desc: 'Check your delivery status', href: '/order-status', cta: 'Track now' },
            { icon: RotateCcw, title: 'Returns', desc: 'Start a return or refund', href: '/returns', cta: 'Get started' },
          ].map(({ icon: Icon, title, desc, href, cta }) => (
            <Link key={title} href={href} className="card p-6 text-center hover:shadow-card-hover transition-all group block">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 mb-3">{desc}</p>
              <span className="text-sm text-primary-600 font-semibold group-hover:underline">{cta} →</span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
