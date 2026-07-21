import Link from 'next/link';
import { Truck, Globe, Zap, CheckCircle, Package, Clock, MapPin, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information — Vitis',
  description: 'Delivery options, timelines, international shipping, and free shipping eligibility — everything you need to know about how Vitis ships.',
};

const DOMESTIC_OPTIONS = [
  {
    name: 'Standard Shipping',
    time: '3–5 business days',
    cost: '$4.99',
    free: 'Free on orders $50+',
    icon: Package,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Express Shipping',
    time: '1–2 business days',
    cost: '$12.99',
    free: 'Free on orders $150+',
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    name: 'Same-Day Delivery',
    time: 'Order by 12 PM',
    cost: '$24.99',
    free: 'Select cities only',
    icon: Clock,
    color: 'bg-green-50 text-green-600',
  },
];

const INTERNATIONAL_ZONES = [
  { zone: 'Canada & Mexico', time: '5–8 business days', cost: 'From $8.99' },
  { zone: 'Europe (EU)', time: '7–12 business days', cost: 'From $14.99' },
  { zone: 'UK', time: '7–10 business days', cost: 'From $12.99' },
  { zone: 'Australia & NZ', time: '10–15 business days', cost: 'From $16.99' },
  { zone: 'Asia Pacific', time: '8–14 business days', cost: 'From $15.99' },
  { zone: 'Middle East & Africa', time: '10–20 business days', cost: 'From $18.99' },
  { zone: 'Latin America', time: '10–18 business days', cost: 'From $14.99' },
  { zone: 'Rest of World', time: '14–21 business days', cost: 'From $22.99' },
];

const FAQS = [
  { q: 'Do you offer free shipping?', a: 'Yes — standard shipping is free on domestic orders over $50. Use coupon code FREESHIP for free shipping on orders over $25.' },
  { q: 'Can I ship to a PO Box?', a: 'Standard shipping is available to PO Boxes. Express and same-day delivery options are not available for PO Box addresses.' },
  { q: 'Will I be charged customs duties?', a: 'International orders may be subject to customs duties, taxes, and fees levied by the destination country. These charges are the buyer\'s responsibility and are not included in our shipping fees.' },
  { q: 'How do I track my shipment?', a: 'Once your order ships you\'ll receive a tracking number by email. You can also track via our Order Status page.' },
  { q: 'What carriers do you use?', a: 'We partner with FedEx, UPS, USPS, and DHL depending on the destination and shipping option selected at checkout.' },
  { q: 'Can I change my delivery address after ordering?', a: 'Address changes can be made within 1 hour of order placement. Contact support immediately — once the order is picked up by the carrier, we cannot redirect it.' },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <Truck className="w-3.5 h-3.5 text-yellow-300" />
              Shipping worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Shipping Information</h1>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Fast, reliable delivery to 50+ countries. Free standard shipping on US orders over $50.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Globe, text: '50+ countries' },
                { icon: Zap, text: 'Same-day available' },
                { icon: Package, text: 'Free on $50+' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5 text-sm font-semibold">
                  <Icon className="w-4 h-4 text-yellow-300" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Domestic options */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">US Domestic Shipping</h2>
          <p className="text-gray-500 mb-8">Delivered to all 50 states including Alaska and Hawaii.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {DOMESTIC_OPTIONS.map(({ name, time, cost, free, icon: Icon, color }) => (
              <div key={name} className="card p-6">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
                <p className="text-2xl font-black text-gray-900 mb-1">{cost}</p>
                <p className="text-sm text-gray-500 mb-3">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-gray-400" />{time}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                  <CheckCircle className="w-3.5 h-3.5" /> {free}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Free shipping callout */}
        <div id="free" className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Free Shipping — Two Ways</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Spend over <strong>$50</strong> on any order for free standard shipping</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Use code <strong className="font-mono bg-green-100 px-1.5 py-0.5 rounded">FREESHIP</strong> for free shipping on orders $25+</li>
              </ul>
            </div>
          </div>
        </div>

        {/* International */}
        <section id="international">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">International Shipping</h2>
          <p className="text-gray-500 mb-8">We ship to 50+ countries. Delivery times are estimates and may vary due to customs clearance.</p>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Region</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Shipping Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {INTERNATIONAL_ZONES.map(({ zone, time, cost }) => (
                  <tr key={zone} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {zone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{time}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary-600">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 mt-4 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-400" />
            International orders may be subject to customs duties and import taxes, which are the buyer's responsibility.
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

        {/* Track order CTA */}
        <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900">Track your current order</h3>
              <p className="text-sm text-gray-600">Enter your order number for real-time delivery updates.</p>
            </div>
          </div>
          <Link href="/order-status"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shrink-0 text-sm">
            Track Order <Truck className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
