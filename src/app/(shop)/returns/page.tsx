import Link from 'next/link';
import { RotateCcw, CheckCircle, XCircle, Clock, Package, AlertCircle, ChevronRight, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds — Vitis',
  description: 'Our 30-day return policy explained. Learn how to return items, track your refund, and what is and isn\'t eligible for return.',
};

const STEPS = [
  { step: '01', title: 'Initiate your return', desc: 'Go to My Account → Orders, find the item, and click "Return item". Select your reason and confirm.' },
  { step: '02', title: 'Pack your items', desc: 'Place items in their original packaging where possible. Include any accessories, manuals, and tags.' },
  { step: '03', title: 'Ship it back', desc: 'Use the prepaid label we email you. Drop off at any authorised carrier location.' },
  { step: '04', title: 'Receive your refund', desc: 'We inspect the return and process your refund within 3–5 business days of receipt.' },
];

const RETURNABLE = [
  'Unworn clothing with tags attached',
  'Electronics in original sealed packaging',
  'Unused household items in original condition',
  'Footwear with original box and unworn soles',
  'Beauty products that are unopened and unused',
  'Books without markings or damage',
];

const NON_RETURNABLE = [
  'Digital products and downloads',
  'Personalised or custom-made items',
  'Perishable goods (food, flowers)',
  'Hazardous materials',
  'Items marked "Final Sale"',
  'Swimwear and underwear (hygiene)',
];

const FAQS = [
  { q: 'How long does a refund take?', a: 'We process refunds within 3–5 business days of receiving your return. Card refunds take an additional 3–5 days to appear on your statement depending on your bank.' },
  { q: 'Do I pay for return shipping?', a: 'No — returns for defective, damaged, or incorrectly shipped items are always free. For change-of-mind returns, a flat $4.99 return shipping fee is deducted from your refund.' },
  { q: 'Can I exchange instead of refund?', a: 'Yes. Select "Exchange" instead of "Refund" when initiating your return. Exchanges are processed within 1–2 business days of receiving the original item.' },
  { q: 'What if my item arrived damaged?', a: 'Contact us within 48 hours of delivery with photos of the damage. We\'ll send a replacement or issue a full refund with free return shipping.' },
  { q: 'Can I return a gift?', a: 'Yes. Use the gift receipt or order number included with your package. Refunds for gifts are issued as Vitis store credit.' },
  { q: 'What happens if I miss the 30-day window?', a: 'We\'re unable to accept returns after 30 days. Contact our support team — in exceptional cases we can make exceptions at our discretion.' },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <RotateCcw className="w-3.5 h-3.5 text-yellow-300" />
              Hassle-free returns
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Returns & Refunds</h1>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Not happy with your purchase? Return most items within 30 days for a full refund — no questions asked.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-green-300" /> 30-day window
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-green-300" /> Free returns on defects
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-green-300" /> Fast refund processing
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Start return CTA */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Ready to return an item?</h3>
            <p className="text-sm text-gray-600">Sign in to your account to initiate a return in seconds.</p>
          </div>
          <Link href="/auth/login?redirect=/account/orders"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shrink-0">
            Start a Return <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How to return an item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="card p-6">
                <span className="text-4xl font-black text-primary-100 block mb-2">{step}</span>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What can/can't be returned */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What can be returned?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-gray-900">Eligible for return</h3>
              </div>
              <ul className="space-y-2.5">
                {RETURNABLE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-gray-900">Not eligible for return</h3>
              </div>
              <ul className="space-y-2.5">
                {NON_RETURNABLE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Refund timeline */}
        <section id="timeline">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary-500" /> Refund Timeline
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Stage</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { stage: 'Return received at warehouse', time: 'Day 1', note: 'You receive a confirmation email' },
                  { stage: 'Item inspection', time: '1–2 business days', note: 'Condition verified against return reason' },
                  { stage: 'Refund issued', time: '3–5 business days', note: 'Refund sent to original payment method' },
                  { stage: 'Appears on statement', time: '+3–5 banking days', note: 'Varies by card issuer' },
                ].map(({ stage, time, note }) => (
                  <tr key={stage} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{stage}</td>
                    <td className="px-6 py-4 text-sm text-primary-600 font-semibold">{time}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="card p-6">
                <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-orange-100 bg-orange-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Still have questions?</h3>
              <p className="text-sm text-gray-600">Our support team is available 24/7 to help with any return issues.</p>
            </div>
          </div>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shrink-0 text-sm">
            Contact Support <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
