import Link from 'next/link';
import { Users, Globe, Zap, Shield, Heart, TrendingUp, Award, MapPin, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Vitis',
  description: 'Learn about Vitis — our mission, story, values, and the team building the future of global commerce.',
};

const MILESTONES = [
  { year: '2019', event: 'Vitis founded with a vision to democratise global commerce.' },
  { year: '2020', event: 'Platform launched with 500 founding vendors across 12 countries.' },
  { year: '2021', event: 'Reached 1 million registered shoppers. Series A funding secured.' },
  { year: '2022', event: 'Expanded to 50+ countries. Introduced multi-vendor marketplace.' },
  { year: '2023', event: '10 million orders fulfilled. Launched Vitis Loyalty & Rewards.' },
  { year: '2024', event: 'Surpassed 500,000 active vendors. Series C funding at $2B valuation.' },
  { year: '2025', event: 'Introduced personalised shopping assistant. 50M+ shoppers worldwide.' },
];

const VALUES = [
  {
    icon: Heart,
    color: 'bg-rose-50 text-rose-600',
    title: 'Customer First',
    desc: 'Every decision starts with the question: does this make life better for our shoppers and sellers? If the answer is no, we go back to the drawing board.',
  },
  {
    icon: Shield,
    color: 'bg-blue-50 text-blue-600',
    title: 'Trust & Safety',
    desc: 'We verify every vendor, protect every transaction, and stand behind every purchase with our Vitis Buyer Guarantee.',
  },
  {
    icon: Globe,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Radical Inclusion',
    desc: 'Commerce should be open to everyone — regardless of geography, language, or background. We build for the whole world.',
  },
  {
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600',
    title: 'Move Fast, Build Right',
    desc: 'We ship quickly without cutting corners on quality, security, or accessibility. Speed and craftsmanship are not opposites.',
  },
  {
    icon: TrendingUp,
    color: 'bg-purple-50 text-purple-600',
    title: 'Shared Success',
    desc: 'When our vendors grow, we grow. Our incentives are perfectly aligned — we only win when the people on our platform win.',
  },
  {
    icon: Award,
    color: 'bg-orange-50 text-orange-600',
    title: 'Excellence in Everything',
    desc: 'From the products we allow on the platform to the pixels we push, we hold ourselves to an uncompromising standard of quality.',
  },
];

const STATS = [
  { value: '50M+', label: 'Shoppers worldwide' },
  { value: '500K+', label: 'Active vendors' },
  { value: '50+', label: 'Countries served' },
  { value: '$4B+', label: 'GMV processed annually' },
  { value: '10M+', label: 'Products listed' },
  { value: '4.8★', label: 'Average platform rating' },
];

const TEAM = [
  { name: 'Alexandra Chen', role: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80' },
  { name: 'Marcus Williams', role: 'Chief Technology Officer', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&q=80' },
  { name: 'Priya Sharma', role: 'Chief Product Officer', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&q=80' },
  { name: 'James Okafor', role: 'Chief Revenue Officer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80' },
  { name: 'Sofia Lindqvist', role: 'Chief Design Officer', img: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=200&h=200&fit=crop&q=80' },
  { name: 'David Park', role: 'Chief Financial Officer', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&q=80' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Users className="w-3.5 h-3.5 text-yellow-400" />
              About Vitis
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
              Built for buyers.<br />Built for sellers.<br />Built for everyone.
            </h1>
            <p className="text-white/75 text-xl leading-relaxed max-w-2xl">
              Vitis is a global commerce platform connecting millions of shoppers with hundreds of thousands of trusted vendors — making buying and selling simpler, smarter, and more rewarding for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-primary-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              We believe commerce should work for everyone. Whether you're a first-time shopper looking for a bargain, a small business owner trying to reach new customers, or a global brand expanding into new markets — Vitis gives you the tools, trust, and technology to succeed.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We're building the infrastructure layer of global commerce — the platform that powers millions of transactions, relationships, and businesses every single day.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/careers" className="btn-primary">Join our team</Link>
              <Link href="/investors" className="btn-secondary">Investor relations</Link>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80"
              alt="Vitis team collaborating"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">What we stand for</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Six principles that guide every product decision, hiring choice, and business strategy.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card p-7">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Our Story</h2>
            <p className="text-gray-500 text-lg">From a bold idea to a global platform.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-px" />
            <div className="space-y-8">
              {MILESTONES.map(({ year, event }, i) => (
                <div key={year} className={`flex gap-6 items-start ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} relative`}>
                  <div className="sm:w-1/2 flex sm:justify-end pl-14 sm:pl-0 sm:pr-10">
                    {i % 2 === 0 && (
                      <div className="card p-5 max-w-sm w-full">
                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-1">{year}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{event}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 rounded-full bg-primary-600 border-4 border-white shadow-md mt-5" />
                  <div className="sm:w-1/2 pl-14 sm:pl-10">
                    {i % 2 !== 0 && (
                      <div className="card p-5 max-w-sm w-full">
                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-1">{year}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{event}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Leadership Team</h2>
            <p className="text-gray-500 text-lg">The people steering the ship.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {TEAM.map(({ name, role, img }) => (
              <div key={name} className="text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-3 shadow-md">
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Office */}
        <section className="card p-8 bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { city: 'San Francisco', role: 'Global HQ', flag: '🇺🇸' },
              { city: 'London', role: 'EMEA HQ', flag: '🇬🇧' },
              { city: 'Singapore', role: 'APAC HQ', flag: '🇸🇬' },
            ].map(({ city, role, flag }) => (
              <div key={city} className="flex items-center gap-4">
                <div className="text-3xl">{flag}</div>
                <div>
                  <p className="font-bold text-gray-900">{city}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to be part of the story?</h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">We're always looking for passionate, talented people to help us build the future of commerce.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/careers" className="btn-primary text-base px-8 py-3">View open roles <ChevronRight className="w-4 h-4 inline" /></Link>
            <Link href="/contact" className="btn-secondary text-base px-8 py-3">Get in touch</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
