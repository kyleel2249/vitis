import Link from 'next/link';
import { TrendingUp, DollarSign, Users, Globe, Shield, Mail, FileText, BarChart3, Landmark, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investors — Vitis',
  description: 'Investor relations for Vitis — financial highlights, corporate governance, funding history, and contact information.',
};

const FINANCIAL_HIGHLIGHTS = [
  { metric: '$4B+', label: 'Annual GMV', change: '+68% YoY', positive: true },
  { metric: '$320M', label: 'Annual Revenue', change: '+54% YoY', positive: true },
  { metric: '50M+', label: 'Active Shoppers', change: '+41% YoY', positive: true },
  { metric: '500K+', label: 'Active Vendors', change: '+38% YoY', positive: true },
  { metric: '82%', label: 'Gross Margin', change: '+4pp YoY', positive: true },
  { metric: '$5B', label: 'Latest Valuation (Series D)', change: 'June 2025', positive: true },
];

const FUNDING_ROUNDS = [
  { round: 'Series D', date: 'June 2025', amount: '$500M', valuation: '$5B', investors: 'Tiger Global, Sequoia, SoftBank Vision Fund' },
  { round: 'Series C', date: 'February 2024', amount: '$250M', valuation: '$2B', investors: 'Andreessen Horowitz, Coatue, General Atlantic' },
  { round: 'Series B', date: 'August 2022', amount: '$80M', valuation: '$600M', investors: 'Insight Partners, IVP, Bessemer' },
  { round: 'Series A', date: 'November 2021', amount: '$20M', valuation: '$120M', investors: 'Accel, Index Ventures' },
  { round: 'Seed', date: 'March 2020', amount: '$3.5M', valuation: '$18M', investors: 'Y Combinator, LocalGlobe' },
];

const INVESTORS = [
  { name: 'Tiger Global', logo: '🐯', type: 'Lead — Series D' },
  { name: 'Sequoia Capital', logo: '🌲', type: 'Series D' },
  { name: 'SoftBank Vision Fund', logo: '🟠', type: 'Series D' },
  { name: 'Andreessen Horowitz', logo: '🔵', type: 'Lead — Series C' },
  { name: 'Coatue Management', logo: '🐞', type: 'Series C' },
  { name: 'General Atlantic', logo: '🟢', type: 'Series C' },
  { name: 'Insight Partners', logo: '💡', type: 'Lead — Series B' },
  { name: 'Accel', logo: '⚡', type: 'Lead — Series A' },
];

const GOVERNANCE = [
  { icon: Shield, title: 'Board of Directors', desc: '7-member board including 4 independent directors. Audit, compensation, and nominating committees in place.' },
  { icon: FileText, title: 'Audit & Compliance', desc: 'Annual audits conducted by a Big Four firm. SOC 2 Type II certified. PCI-DSS Level 1 compliant.' },
  { icon: Landmark, title: 'Legal Structure', desc: 'Vitis Inc., incorporated in Delaware, USA. Operating subsidiaries in UK, Singapore, and Ireland.' },
  { icon: BarChart3, title: 'Financial Reporting', desc: 'Quarterly business updates shared with shareholders. Annual audited financials available to investors.' },
];

const FAQS = [
  { q: 'Is Vitis publicly traded?', a: 'Vitis is currently a private company. We are evaluating a potential IPO pathway for 2026–2027.' },
  { q: 'How can I invest in Vitis?', a: 'Equity is currently available only to institutional and accredited investors. Please contact our IR team to enquire about current investment opportunities.' },
  { q: 'Where can I access financial statements?', a: 'Audited financial statements are available to current shareholders and accredited investors upon request via our IR team.' },
  { q: 'Does Vitis pay dividends?', a: 'Vitis does not currently pay dividends. We reinvest all profits into platform growth, product development, and international expansion.' },
  { q: 'Who are your primary shareholders?', a: 'Our cap table includes Tiger Global, Sequoia Capital, SoftBank Vision Fund, Andreessen Horowitz, and our founding team, among others.' },
  { q: 'What is your path to profitability?', a: 'We reached contribution-margin profitability in Q3 2024. We expect EBITDA breakeven on a consolidated basis in 2026.' },
];

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
              Investor Relations
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
              Building the infrastructure of global commerce.
            </h1>
            <p className="text-white/70 text-xl leading-relaxed max-w-2xl mb-8">
              Vitis is one of the fastest-growing commerce platforms in the world. Here you'll find our financial highlights, funding history, governance information, and investor contact details.
            </p>
            <a
              href="mailto:investors@vitis.com"
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" /> Contact Investor Relations
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Financial highlights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Financial Highlights (FY 2024)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {FINANCIAL_HIGHLIGHTS.map(({ metric, label, change, positive }) => (
              <div key={label} className="card p-5 text-center">
                <p className="text-2xl font-extrabold text-gray-900 mb-1">{metric}</p>
                <p className="text-xs text-gray-500 mb-2 leading-tight">{label}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {change}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">* Financial figures are illustrative. Audited financials available to shareholders upon request.</p>
        </section>

        {/* Funding history */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Funding History</h2>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Round', 'Date', 'Amount Raised', 'Valuation', 'Lead Investors'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FUNDING_ROUNDS.map(({ round, date, amount, valuation, investors }) => (
                  <tr key={round} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{round}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{valuation}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{investors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key investors */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Investors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INVESTORS.map(({ name, logo, type }) => (
              <div key={name} className="card p-5 text-center">
                <p className="text-3xl mb-3">{logo}</p>
                <p className="font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-xs text-gray-500 mt-1">{type}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Governance */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Corporate Governance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GOVERNANCE.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7 flex gap-5">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Vitis */}
        <section className="card p-10 bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Vitis?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Globe, color: 'text-blue-500', title: 'Massive Market', desc: 'Global e-commerce is a $7T+ market growing at 15% annually. Vitis is capturing share across every geography.' },
              { icon: Users, color: 'text-green-500', title: 'Network Effects', desc: 'Every new vendor brings more buyers. Every new buyer attracts more vendors. The flywheel accelerates.' },
              { icon: DollarSign, color: 'text-primary-600', title: 'Multiple Revenue Streams', desc: 'Take rate, subscription plans, advertising, financial services, and logistics all contribute to a diversified model.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title}>
                <Icon className={`w-10 h-10 ${color} mx-auto mb-4`} />
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Investor FAQ</h2>
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
        <section className="card p-10 text-center bg-gradient-to-br from-slate-900 to-blue-950 text-white">
          <TrendingUp className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">For shareholder enquiries, investment opportunities, or press around our financials, reach our investor relations team directly.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:investors@vitis.com" className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-3 rounded-xl transition-colors">
              <Mail className="w-4 h-4" /> investors@vitis.com
            </a>
            <Link href="/press" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-colors">
              Press room <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
