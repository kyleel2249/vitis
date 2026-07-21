import Link from 'next/link';
import { CheckCircle, DollarSign, TrendingUp, Shield, ChevronRight, Info } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commission Rates — Vitis Vendor Pricing',
  description: 'Clear, competitive commission rates with no hidden fees. See exactly what you keep on every sale across every category.',
};

const TIERS = [
  {
    name: 'Starter',
    range: '$0 – $1,000/mo GMV',
    commission: '12%',
    highlight: false,
    perks: [
      'Up to 50 product listings',
      'Standard storefront',
      'Weekly payouts',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    range: '$1,001 – $10,000/mo GMV',
    commission: '10%',
    highlight: true,
    perks: [
      'Unlimited product listings',
      'Featured placement eligibility',
      'Weekly payouts',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  {
    name: 'Pro',
    range: '$10,001+/mo GMV',
    commission: '8%',
    highlight: false,
    perks: [
      'Unlimited product listings',
      'Homepage feature eligibility',
      'Daily payouts',
      'Dedicated account manager',
      'Advanced analytics',
      'Custom store URL',
    ],
  },
];

const CATEGORY_RATES = [
  { category: 'Electronics', rate: '10%', note: 'Standard rate' },
  { category: 'Fashion & Apparel', rate: '12%', note: 'Standard rate' },
  { category: 'Home & Garden', rate: '10%', note: 'Standard rate' },
  { category: 'Sports & Outdoors', rate: '10%', note: 'Standard rate' },
  { category: 'Beauty & Health', rate: '12%', note: 'Standard rate' },
  { category: 'Books & Media', rate: '8%', note: 'Reduced rate' },
  { category: 'Toys & Games', rate: '10%', note: 'Standard rate' },
  { category: 'Automotive', rate: '8%', note: 'Reduced rate' },
  { category: 'Handmade / Custom', rate: '6%', note: 'Lowest rate — supports creators' },
  { category: 'Digital Products', rate: '15%', note: 'Digital delivery premium' },
];

const FAQS = [
  {
    q: 'When do tier rates change?',
    a: 'Your commission tier is calculated based on your rolling 30-day GMV. When you cross a threshold, your rate drops automatically on the next payout cycle.',
  },
  {
    q: 'Are there any listing fees?',
    a: 'No — listing products on Vitis is always free regardless of your tier.',
  },
  {
    q: 'What does GMV mean?',
    a: 'Gross Merchandise Value — the total value of completed orders placed through your store before refunds and commissions.',
  },
  {
    q: 'Are payment processing fees separate?',
    a: 'Yes. A standard 2.9% + $0.30 payment processing fee applies per transaction. This is separate from the platform commission.',
  },
];

export default function CommissionRatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <DollarSign className="w-3.5 h-3.5 text-green-400" />
              Simple, transparent pricing
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Commission Rates
            </h1>
            <p className="text-white/70 text-xl leading-relaxed">
              No surprises. No hidden fees. Just clear, competitive rates that get better as you grow.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Tier cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Volume-Based Tiers</h2>
          <p className="text-gray-500 text-center mb-10">The more you sell, the lower your rate.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map(({ name, range, commission, highlight, perks }) => (
              <div
                key={name}
                className={`rounded-2xl border p-7 flex flex-col ${
                  highlight
                    ? 'bg-primary-600 border-primary-500 text-white shadow-xl scale-105'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                {highlight && (
                  <span className="self-start mb-3 text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <p className={`text-sm mb-6 ${highlight ? 'text-primary-200' : 'text-gray-400'}`}>{range}</p>
                <div className={`text-5xl font-black mb-6 ${highlight ? 'text-white' : 'text-gray-900'}`}>
                  {commission}
                  <span className={`text-base font-semibold ${highlight ? 'text-primary-200' : 'text-gray-400'}`}> commission</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-green-300' : 'text-green-500'}`} />
                      <span className={highlight ? 'text-primary-100' : 'text-gray-600'}>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`mt-8 w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-colors ${
                    highlight
                      ? 'bg-white text-primary-600 hover:bg-primary-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Get Started <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Category rates */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rates by Category</h2>
          <p className="text-gray-500 mb-8">Some categories carry different base rates. Volume discounts apply on top.</p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Base Rate</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CATEGORY_RATES.map(({ category, rate, note }) => (
                  <tr key={category} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{category}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-primary-50 text-primary-700 font-bold text-sm px-2.5 py-1 rounded-lg">{rate}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 mt-4 text-sm text-gray-500">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
            Category base rates are the starting rate for Starter-tier sellers. Growth and Pro discounts apply on top.
          </div>
        </section>

        {/* Benefits row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: TrendingUp, title: 'Rates drop as you grow', desc: 'Volume tiers are applied automatically — no application needed.' },
            { icon: Shield, title: 'No hidden fees', desc: 'The only fees are commission and payment processing. Nothing else.' },
            { icon: DollarSign, title: 'Weekly payouts', desc: 'Earn on Monday, get paid by Friday. Daily payouts for Pro sellers.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Common Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="card p-6">
                <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-3">Ready to start earning?</h2>
          <p className="text-primary-100 mb-8 text-lg">Open your store free — no monthly fees, no lock-in.</p>
          <Link
            href="/start-selling"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-primary-50 transition-colors"
          >
            Start Selling <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
