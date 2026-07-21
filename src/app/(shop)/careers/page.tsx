import Link from 'next/link';
import { Briefcase, MapPin, Clock, Heart, Zap, Users, Globe, Award, Coffee, ChevronRight, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers — Vitis',
  description: 'Join the team building the future of global commerce. Explore open roles, benefits, and culture at Vitis.',
};

const OPEN_ROLES = [
  { title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'San Francisco / Remote', type: 'Full-time', tag: 'Engineering' },
  { title: 'Staff Backend Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time', tag: 'Engineering' },
  { title: 'Product Manager — Checkout', dept: 'Product', location: 'San Francisco', type: 'Full-time', tag: 'Product' },
  { title: 'Product Designer', dept: 'Design', location: 'London / Remote', type: 'Full-time', tag: 'Design' },
  { title: 'Head of Vendor Success', dept: 'Vendor Operations', location: 'Singapore', type: 'Full-time', tag: 'Operations' },
  { title: 'Data Scientist — Growth', dept: 'Data & Analytics', location: 'Remote', type: 'Full-time', tag: 'Data' },
  { title: 'Marketing Lead — EMEA', dept: 'Marketing', location: 'London', type: 'Full-time', tag: 'Marketing' },
  { title: 'Customer Success Manager', dept: 'Customer Success', location: 'Remote', type: 'Full-time', tag: 'Support' },
  { title: 'Security Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time', tag: 'Engineering' },
  { title: 'Content Writer', dept: 'Marketing', location: 'Remote', type: 'Full-time', tag: 'Marketing' },
];

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Operations', 'Data', 'Marketing', 'Support'];

const TAG_COLORS: Record<string, string> = {
  Engineering: 'bg-blue-50 text-blue-700 border-blue-100',
  Product: 'bg-purple-50 text-purple-700 border-purple-100',
  Design: 'bg-pink-50 text-pink-700 border-pink-100',
  Operations: 'bg-orange-50 text-orange-700 border-orange-100',
  Data: 'bg-teal-50 text-teal-700 border-teal-100',
  Marketing: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  Support: 'bg-green-50 text-green-700 border-green-100',
};

const BENEFITS = [
  { icon: Heart, color: 'text-rose-500', title: 'Health & Wellbeing', desc: 'Comprehensive medical, dental, and vision coverage for you and your family, plus a $1,500 annual wellness stipend.' },
  { icon: Globe, color: 'text-blue-500', title: 'Work From Anywhere', desc: 'Fully remote-friendly with hubs in SF, London, and Singapore. You choose where you do your best work.' },
  { icon: TrendingUp, color: 'text-green-500', title: 'Equity & Growth', desc: 'Competitive equity package so you own a piece of what you build, plus a clear path to grow your career.' },
  { icon: Coffee, color: 'text-amber-500', title: 'Generous Time Off', desc: 'Unlimited PTO, 16 weeks parental leave, and company-wide Rest Weeks twice a year to fully disconnect.' },
  { icon: Award, color: 'text-purple-500', title: 'Learning Budget', desc: '$3,000 per year for courses, conferences, books, and anything else that makes you sharper.' },
  { icon: Zap, color: 'text-yellow-500', title: 'Home Office Setup', desc: '$2,000 one-time setup budget plus a monthly internet and equipment stipend.' },
];

const VALUES = [
  { emoji: '🤝', title: 'Collaborative', desc: 'We win together. No lone heroes, no silos.' },
  { emoji: '⚡', title: 'Bias for Action', desc: 'We move fast, experiment freely, and learn openly.' },
  { emoji: '🌍', title: 'Globally Minded', desc: 'Our team and our customers span the globe.' },
  { emoji: '📣', title: 'Radically Transparent', desc: 'We share context widely and communicate directly.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
              We're hiring
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
              Help us build the future of commerce.
            </h1>
            <p className="text-white/75 text-xl leading-relaxed max-w-2xl mb-8">
              Join a team of builders, designers, and operators who care deeply about creating technology that helps millions of people buy, sell, and connect.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#open-roles" className="btn-primary">See open roles</a>
              <Link href="/about" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-colors">
                Learn about us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '800+', label: 'Team members globally' },
              { value: '40+', label: 'Nationalities' },
              { value: '60%', label: 'Remote workforce' },
              { value: '4.8★', label: 'Glassdoor rating' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-primary-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Culture */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop&q=80"
              alt="Vitis team"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-5">Life at Vitis</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              We're a diverse, distributed team that moves fast and cares deeply. You'll work alongside world-class engineers, designers, and operators who are just as excited about the problem as the solution.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We invest in our people because our people are what make Vitis great. That means real growth opportunities, genuine ownership, and a culture where your voice matters from day one.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map(({ emoji, title, desc }) => (
                <div key={title} className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-2xl mb-2">{emoji}</p>
                  <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Benefits & Perks</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">We take care of you so you can focus on doing your best work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card p-7">
                <Icon className={`w-7 h-7 ${color} mb-4`} />
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open roles */}
        <section id="open-roles">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Open Roles</h2>
            <p className="text-gray-500 text-lg">{OPEN_ROLES.length} positions available across {DEPARTMENTS.length - 1} departments</p>
          </div>

          <div className="card overflow-hidden divide-y divide-gray-100">
            {OPEN_ROLES.map(({ title, dept, location, type, tag }) => (
              <div key={title} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-gray-50 transition-colors group">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TAG_COLORS[tag] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>{tag}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {type}</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                >
                  Apply now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't see a role that fits?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline font-medium">Send us a speculative application</Link> — we're always interested in exceptional people.
          </p>
        </section>

        {/* Interview process */}
        <section className="card p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Hiring Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            {[
              { step: '01', title: 'Apply', desc: 'Submit your application. We review every one.' },
              { step: '02', title: 'Recruiter Screen', desc: '30-minute call to learn about each other.' },
              { step: '03', title: 'Technical / Portfolio', desc: 'A practical assessment relevant to the role.' },
              { step: '04', title: 'Final Interviews', desc: 'Meet the team. Offer within one week.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-extrabold text-lg mx-auto mb-3">{step}</div>
                <p className="font-bold text-gray-900 mb-1">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
