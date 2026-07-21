import Link from 'next/link';
import { CheckCircle, DollarSign, Globe, Shield, TrendingUp, Package, Users, Zap, ChevronRight, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Selling on Vitis — Reach Millions of Shoppers',
  description: 'Join thousands of vendors already selling on Vitis. List your first product in minutes, reach global buyers, and grow your business.',
};

const BENEFITS = [
  { icon: Globe, title: 'Global Reach', desc: 'Sell to millions of shoppers across 50+ countries from day one.' },
  { icon: DollarSign, title: 'Competitive Commissions', desc: 'Keep more of what you earn with industry-leading commission rates.' },
  { icon: TrendingUp, title: 'Growth Tools', desc: 'Analytics, promotions, and smart tools to scale your store fast.' },
  { icon: Shield, title: 'Seller Protection', desc: 'Fraud prevention, dispute resolution, and secure payouts built in.' },
  { icon: Package, title: 'Easy Inventory', desc: 'Bulk upload, variant management, and real-time stock tracking.' },
  { icon: Users, title: 'Dedicated Support', desc: 'Onboarding help and 24/7 vendor support when you need it.' },
];

const STEPS = [
  { step: '01', title: 'Create your account', desc: 'Sign up in seconds with your email. No fees to get started.' },
  { step: '02', title: 'Set up your store', desc: 'Add your logo, store name, and a short description to build trust.' },
  { step: '03', title: 'List your products', desc: 'Upload photos, set prices, and go live. Your first listing is free.' },
  { step: '04', title: 'Start earning', desc: 'Receive orders, ship to customers, and get paid on a weekly cycle.' },
];

const STATS = [
  { value: '500+', label: 'Active Vendors' },
  { value: '$2M+', label: 'Paid to Sellers' },
  { value: '50+', label: 'Countries' },
  { value: '4.8★', label: 'Vendor Rating' },
];

export default function StartSellingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Join 500+ sellers already growing on Vitis
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
              Sell to the World —<br />
              <span className="text-primary-400">Starting Today</span>
            </h1>
            <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-xl mx-auto">
              List your first product in minutes. No monthly fees. No complexity. Just a powerful platform built to help you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-glow"
              >
                Open Your Store Free <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/vendor/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
              >
                Vendor Dashboard
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-2xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="text-white/50 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Vitis gives you the tools, reach, and support to build a thriving online business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:shadow-card-hover transition-all">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Up and running in 4 steps
            </h2>
            <p className="text-gray-500 text-lg">No technical skills required.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="card p-6">
                  <span className="text-4xl font-black text-primary-100">{step}</span>
                  <h3 className="font-bold text-gray-900 mt-3 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
          </div>
          <blockquote className="text-2xl font-semibold text-gray-900 italic mb-6">
            "My sales tripled in the first month after joining Vitis. The dashboard tools are powerful yet simple — exactly what a small business owner needs."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">AR</div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Aisha Rahman</p>
              <p className="text-sm text-gray-500">Small Business Owner · London, UK</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to start selling?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Create your free account and list your first product today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-primary-50 transition-colors"
            >
              Get Started Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/commission-rates"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:border-white transition-colors"
            >
              View Commission Rates
            </Link>
          </div>
          <p className="text-primary-200 text-sm mt-6 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> No monthly fees · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
