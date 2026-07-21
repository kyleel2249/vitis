import Link from 'next/link';
import { Leaf, Zap, Globe, Recycle, Sun, TreePine, Heart, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sustainability — Vitis',
  description: 'Vitis\'s commitment to environmental responsibility, ethical commerce, and building a sustainable future for global trade.',
};

const GOALS_2030 = [
  { icon: Sun, color: 'bg-yellow-50 text-yellow-600', title: 'Net Zero Emissions', desc: '100% of our operations powered by renewable energy and all residual emissions offset by verified carbon credits by 2030.', progress: 42 },
  { icon: Recycle, color: 'bg-green-50 text-green-600', title: 'Zero Packaging Waste', desc: 'Partner with all vendors to eliminate single-use plastic packaging and transition to fully recyclable or compostable materials.', progress: 31 },
  { icon: TreePine, color: 'bg-emerald-50 text-emerald-600', title: '10M Trees Planted', desc: 'One tree planted for every 10 orders placed on the platform, in partnership with One Tree Planted and Ecosia.', progress: 68 },
  { icon: Globe, color: 'bg-blue-50 text-blue-600', title: 'Ethical Supply Chains', desc: 'Mandatory supply-chain audits for all vendors earning over $1M annually, covering labour, safety, and environmental standards.', progress: 55 },
  { icon: Heart, color: 'bg-rose-50 text-rose-600', title: 'Fair Vendor Pay', desc: 'Ensure 95% of vendors on our platform earn above a living wage in their respective country, measured via annual earnings data.', progress: 89 },
  { icon: Zap, color: 'bg-purple-50 text-purple-600', title: 'Green Logistics', desc: 'Transition our last-mile delivery partnerships to electric and cargo-bike vehicles in all major urban markets.', progress: 24 },
];

const ACHIEVEMENTS = [
  { year: '2022', title: 'Carbon Neutral Data Centres', desc: 'All platform infrastructure migrated to 100% renewable-powered cloud regions.' },
  { year: '2023', title: '2M Trees Planted', desc: 'Exceeded our first tree-planting milestone with 2.1M trees across 15 countries.' },
  { year: '2023', title: 'B Corp Certified', desc: 'Vitis achieved B Corporation certification, joining 6,000+ companies meeting the highest standards of social and environmental performance.' },
  { year: '2024', title: 'Green Packaging Initiative', desc: 'Eliminated plastic packaging from all Vitis-fulfilled orders, removing 40M plastic units per year.' },
  { year: '2024', title: 'EV Delivery Pilots', desc: 'Launched electric delivery pilots in London, Amsterdam, and San Francisco with 85% adoption rate in covered zones.' },
  { year: '2025', title: 'Science-Based Targets', desc: 'Committed to Science Based Targets initiative (SBTi) for a 1.5°C-aligned emissions reduction pathway.' },
];

const PROGRAMS = [
  {
    icon: Leaf,
    title: 'Eco-Certified Vendors',
    desc: 'Our green vendor badge identifies sellers who meet our environmental standards: sustainable packaging, ethical sourcing, and carbon-offset shipping options.',
    cta: 'See eco-certified products',
    href: '/products?filter=eco',
  },
  {
    icon: Recycle,
    title: 'Vitis ReShop',
    desc: 'Our circular commerce programme lets customers resell previously purchased items directly through the platform, extending product lifecycles and reducing waste.',
    cta: 'Learn about ReShop',
    href: '/help',
  },
  {
    icon: TreePine,
    title: 'Plant with Every Purchase',
    desc: 'Every 10 orders placed on Vitis triggers the planting of one tree. Customers can track their personal tree count in their account dashboard.',
    cta: 'Track your impact',
    href: '/account/orders',
  },
  {
    icon: Shield,
    title: 'Responsible Packaging',
    desc: 'Our packaging requirements for all Vitis-fulfilled orders mandate recyclable materials, minimal void fill, and right-sized boxes — reducing shipment volume by 30%.',
    cta: 'Vendor packaging standards',
    href: '/vendor-resources',
  },
];

const REPORTS = [
  { year: '2024', title: 'Sustainability Report 2024', pages: 48, size: '6.2 MB' },
  { year: '2023', title: 'Sustainability Report 2023', pages: 42, size: '5.8 MB' },
  { year: '2022', title: 'Sustainability Report 2022', pages: 36, size: '4.9 MB' },
  { year: '2022', title: 'B Corp Impact Assessment 2022', pages: 22, size: '3.1 MB' },
];

function ProgressBar({ value, color = 'bg-primary-600' }: { value: number; color?: string }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>Progress toward 2030 goal</span>
        <span className="font-bold text-gray-700">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-800 to-green-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Leaf className="w-3.5 h-3.5 text-green-400" />
              Sustainability
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
              Commerce that cares for the planet.
            </h1>
            <p className="text-white/75 text-xl leading-relaxed max-w-2xl mb-8">
              We believe great commerce and responsible business are inseparable. Here's how we're building a platform that's good for people, good for vendors, and good for the earth.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#goals" className="btn-primary">Our 2030 goals</a>
              <a
                href="#reports"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-colors"
              >
                Download reports
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Impact numbers */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '2.1M+', label: 'Trees planted', emoji: '🌳' },
              { value: '40M', label: 'Plastic units eliminated', emoji: '♻️' },
              { value: '100%', label: 'Renewable-powered infrastructure', emoji: '⚡' },
              { value: 'B Corp', label: 'Certified since 2023', emoji: '✅' },
            ].map(({ value, label, emoji }) => (
              <div key={label}>
                <p className="text-3xl mb-1">{emoji}</p>
                <p className="text-2xl font-extrabold text-emerald-700">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* 2030 Goals */}
        <section id="goals">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Our 2030 Commitments</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Six measurable goals we are publicly committed to reaching by 2030.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GOALS_2030.map(({ icon: Icon, color, title, desc, progress }) => (
              <div key={title} className="card p-7">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                <ProgressBar value={progress} color="bg-emerald-600" />
              </div>
            ))}
          </div>
        </section>

        {/* Programmes */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Active Programmes</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Concrete initiatives running on the platform today.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PROGRAMS.map(({ icon: Icon, title, desc, cta, href }) => (
              <div key={title} className="card p-7">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{desc}</p>
                <Link href={href} className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                  {cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Milestones Achieved</h2>
            <p className="text-gray-500 text-lg">Progress we're proud of — with receipts.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACHIEVEMENTS.map(({ year, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{year}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reports */}
        <section id="reports">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sustainability Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REPORTS.map(({ year, title, pages, size }) => (
              <div key={title} className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{pages} pages · PDF · {size}</p>
                </div>
                <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold shrink-0 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="card p-10 text-center bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <Leaf className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Are you an eco-conscious vendor?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">Apply for our Eco-Certified Vendor programme and get your green badge, priority placement in search, and access to our sustainability grant fund.</p>
          <Link href="/start-selling" className="btn-primary">Apply for Eco-Certified status</Link>
        </section>

      </div>
    </div>
  );
}
