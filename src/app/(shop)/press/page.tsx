import Link from 'next/link';
import { Newspaper, Download, Mail, ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press & Media — Vitis',
  description: 'Press releases, media coverage, brand assets, and contact information for journalists covering Vitis.',
};

const PRESS_RELEASES = [
  {
    date: 'June 12, 2025',
    category: 'Funding',
    headline: 'Vitis Raises $500M Series D at $5B Valuation to Accelerate Global Expansion',
    summary: 'Funding will be used to expand into 20 new markets, deepen vendor tools, and invest in next-generation personalisation capabilities.',
  },
  {
    date: 'April 3, 2025',
    category: 'Product',
    headline: 'Vitis Launches Smart Shopping Assistant, Redefining How 50 Million Shoppers Discover Products',
    summary: 'The conversational assistant uses live catalog data to surface personalised recommendations, deals, and order help in real time.',
  },
  {
    date: 'January 15, 2025',
    category: 'Milestones',
    headline: 'Vitis Surpasses 500,000 Active Vendors and $4B in Annual GMV',
    summary: 'The milestone underscores rapid vendor adoption across Southeast Asia, the Middle East, and Latin America.',
  },
  {
    date: 'October 8, 2024',
    category: 'Partnership',
    headline: 'Vitis and DHL Announce Strategic Logistics Partnership for Same-Day Global Delivery',
    summary: 'The partnership will bring same-day delivery to 30 major cities across North America, Europe, and Asia Pacific by Q1 2025.',
  },
  {
    date: 'July 22, 2024',
    category: 'Awards',
    headline: 'Vitis Named to Fast Company's "World's Most Innovative Companies" List for 2024',
    summary: 'Vitis was recognised in the Retail & E-commerce category for its vendor marketplace model and buyer-protection innovations.',
  },
  {
    date: 'March 5, 2024',
    category: 'Product',
    headline: 'Vitis Introduces Multi-Currency Checkout and Real-Time Currency Conversion for Global Shoppers',
    summary: 'Shoppers can now browse and purchase in 40+ currencies with live exchange rates and no hidden conversion fees.',
  },
];

const COVERAGE = [
  {
    outlet: 'TechCrunch',
    logo: '🟠',
    headline: '"Vitis is quietly becoming the world\'s most complete commerce platform"',
    date: 'May 2025',
    url: '#',
  },
  {
    outlet: 'The Wall Street Journal',
    logo: '🔵',
    headline: '"Vitis Disrupts Amazon\'s Dominance with Vendor-First Approach"',
    date: 'April 2025',
    url: '#',
  },
  {
    outlet: 'Forbes',
    logo: '🟢',
    headline: '"Meet the Commerce Platform Growing Faster Than Any Other This Decade"',
    date: 'March 2025',
    url: '#',
  },
  {
    outlet: 'Bloomberg',
    logo: '🔴',
    headline: '"Vitis\'s $5B Valuation Signals Investor Confidence in Multi-Vendor Commerce"',
    date: 'June 2025',
    url: '#',
  },
  {
    outlet: 'Wired',
    logo: '⚫',
    headline: '"How Vitis Built a Loyalty Engine That Keeps Shoppers Coming Back"',
    date: 'February 2025',
    url: '#',
  },
  {
    outlet: 'Financial Times',
    logo: '🟡',
    headline: '"Vitis Expands Into Emerging Markets, Targeting 100M Users by 2026"',
    date: 'January 2025',
    url: '#',
  },
];

const BRAND_ASSETS = [
  { name: 'Vitis Logo Pack', desc: 'SVG, PNG, dark & light variants', size: '2.4 MB' },
  { name: 'Brand Guidelines', desc: 'Colors, typography, usage rules', size: '8.1 MB' },
  { name: 'Product Screenshots', desc: 'Storefront, dashboard, mobile', size: '14.6 MB' },
  { name: 'Executive Headshots', desc: 'High-resolution press photos', size: '22.3 MB' },
  { name: 'B-roll Video Package', desc: 'Office, team, product footage', size: '1.2 GB' },
  { name: 'Fact Sheet 2025', desc: 'Key stats, milestones, leadership', size: '0.8 MB' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Funding: 'bg-green-50 text-green-700 border-green-100',
  Product: 'bg-blue-50 text-blue-700 border-blue-100',
  Milestones: 'bg-purple-50 text-purple-700 border-purple-100',
  Partnership: 'bg-orange-50 text-orange-700 border-orange-100',
  Awards: 'bg-yellow-50 text-yellow-700 border-yellow-100',
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Newspaper className="w-3.5 h-3.5 text-yellow-400" />
              Press & Media
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
              Vitis in the news.
            </h1>
            <p className="text-white/70 text-xl leading-relaxed max-w-2xl mb-8">
              Find the latest press releases, media coverage, brand assets, and press contact details for journalists and analysts.
            </p>
            <a
              href="mailto:press@vitis.com"
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" /> Contact Press Team
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Press releases */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Press Releases</h2>
          <div className="space-y-4">
            {PRESS_RELEASES.map(({ date, category, headline, summary }) => (
              <div key={headline} className="card p-6 hover:shadow-card-hover transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[category] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        {category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {date}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {headline}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{summary}</p>
                  </div>
                  <button className="shrink-0 inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-sm font-semibold">
                    Read more <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media coverage */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">In the Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COVERAGE.map(({ outlet, logo, headline, date, url }) => (
              <a
                key={outlet}
                href={url}
                className="card p-6 hover:shadow-card-hover transition-all group block"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{logo}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{outlet}</p>
                    <p className="text-xs text-gray-400">{date}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary-500 ml-auto transition-colors" />
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">{headline}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Brand assets */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Brand Assets</h2>
          <p className="text-gray-500 mb-8">Download official Vitis brand assets for editorial and press use. Please review our brand guidelines before publishing.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAND_ASSETS.map(({ name, desc, size }) => (
              <div key={name} className="card p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-xs text-gray-500">{desc} · {size}</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-xs font-bold shrink-0">
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Press contact */}
        <section className="card p-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Press Contact</h2>
              <p className="text-gray-400 mb-6">
                For interview requests, press releases, editorial enquiries, or speaking opportunities, please reach out to our communications team.
              </p>
              <div className="space-y-3">
                <a href="mailto:press@vitis.com" className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors font-medium">
                  <Mail className="w-4 h-4" /> press@vitis.com
                </a>
                <p className="text-sm text-gray-400">Response within 4 business hours</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { value: '500+', label: 'Media mentions in 2024' },
                { value: '80+', label: 'Countries with coverage' },
                { value: '4h', label: 'Avg. press response time' },
                { value: '200+', label: 'Journalist relationships' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-extrabold text-yellow-400">{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
