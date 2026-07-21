import Link from 'next/link';
import { DollarSign, Users, Share2, TrendingUp, CheckCircle, ChevronRight, Gift, Globe, BarChart3, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Program — Earn by Sharing Vitis',
  description: 'Join the Vitis Affiliate Program and earn commissions by sharing products you love. Free to join, no monthly fees.',
};

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Users,
    title: 'Sign up free',
    desc: 'Create a Vitis account and apply to the affiliate program in one click — no vetting, instant approval.',
  },
  {
    step: '02',
    icon: Share2,
    title: 'Share your link',
    desc: 'Get a unique referral link for any product or page on Vitis and share it anywhere — socials, blog, email.',
  },
  {
    step: '03',
    icon: DollarSign,
    title: 'Earn commissions',
    desc: 'When someone clicks your link and makes a purchase within 30 days, you earn a commission on the sale.',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Get paid',
    desc: 'Commissions are tracked in real time and paid out weekly once you hit the $20 minimum threshold.',
  },
];

const RATES = [
  { category: 'Fashion & Apparel', rate: '8%', popular: true },
  { category: 'Electronics', rate: '4%', popular: false },
  { category: 'Home & Garden', rate: '6%', popular: false },
  { category: 'Beauty & Health', rate: '8%', popular: true },
  { category: 'Sports & Outdoors', rate: '5%', popular: false },
  { category: 'Books & Media', rate: '5%', popular: false },
  { category: 'Toys & Games', rate: '6%', popular: false },
  { category: 'Digital Products', rate: '20%', popular: true },
];

const PERKS = [
  { icon: Globe, title: '30-day cookie window', desc: 'You earn a commission on any purchase made within 30 days of a click on your link.' },
  { icon: BarChart3, title: 'Real-time dashboard', desc: 'Track clicks, conversions, and earnings live in your affiliate dashboard.' },
  { icon: Gift, title: 'Bonus incentives', desc: 'Top affiliates unlock bonus commissions, exclusive products, and early access to sales.' },
  { icon: Zap, title: 'Instant link generation', desc: 'Turn any Vitis product or page URL into an affiliate link in seconds.' },
];

const TESTIMONIALS = [
  {
    quote: 'The affiliate program is fantastic. I\'ve been earning significant commissions just by sharing products I love with my audience.',
    name: 'Yuki Tanaka',
    role: 'Lifestyle Influencer · Tokyo, Japan',
    initials: 'YT',
    earned: '$3,200 last month',
  },
  {
    quote: 'I added Vitis affiliate links to my blog and within 2 weeks I was earning more than my old ad placements. Incredible product selection.',
    name: 'Marco Rossi',
    role: 'Photography Blogger · Milan, Italy',
    initials: 'MR',
    earned: '$870 last month',
  },
];

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <DollarSign className="w-3.5 h-3.5 text-green-400" />
              Earn while you share
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
              The Vitis<br />
              <span className="text-primary-400">Affiliate Program</span>
            </h1>
            <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-xl mx-auto">
              Share products you love and earn up to 20% commission on every sale. Free to join, no monthly fees, instant approval.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-glow"
              >
                Join Free <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="#rates"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
              >
                View Rates
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-sm mx-auto">
              {[
                { value: 'Up to 20%', label: 'Commission' },
                { value: '30 days', label: 'Cookie Window' },
                { value: 'Weekly', label: 'Payouts' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-white/50 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500 text-lg">From sign-up to first payout in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-3xl font-black text-primary-100">{step}</span>
                <h3 className="font-bold text-gray-900 mt-2 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Why affiliates love Vitis</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission rates */}
      <section id="rates" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Commission by Category</h2>
            <p className="text-gray-500 text-lg">Higher rates for high-margin products. Digital products earn the most.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RATES.map(({ category, rate, popular }) => (
              <div key={category} className={`card p-5 flex items-center justify-between ${popular ? 'border-primary-200 bg-primary-50/30' : ''}`}>
                <div className="flex items-center gap-3">
                  {popular && <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Popular</span>}
                  <span className="font-medium text-gray-900">{category}</span>
                </div>
                <span className="text-xl font-black text-primary-600">{rate}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 text-center mt-6">
            Rates shown are per completed sale after refund window. Full terms in the affiliate agreement.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">From our affiliates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map(({ quote, name, role, initials, earned }) => (
              <div key={name} className="card p-6">
                <p className="text-gray-700 leading-relaxed mb-5 text-sm">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-green-600 text-sm">{earned}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Start earning today</h2>
          <p className="text-primary-100 text-lg mb-8">
            Join thousands of creators and publishers already earning with Vitis.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-primary-50 transition-colors"
          >
            Join the Program Free <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-primary-200 text-sm mt-6 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> No approval wait · Instant link generation · Weekly payouts
          </p>
        </div>
      </section>
    </div>
  );
}
