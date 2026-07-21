'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle, ChevronDown } from 'lucide-react';

const SUBJECTS = [
  'Order issue',
  'Return or refund',
  'Shipping question',
  'Payment problem',
  'Account help',
  'Vendor inquiry',
  'Partnership',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <MessageCircle className="w-3.5 h-3.5 text-yellow-400" />
              We're here to help
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg">
              Have a question or need help with your order? Our support team typically responds within 2 business hours.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="card p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-500 mb-6">
                    Thanks for reaching out, <strong>{form.name}</strong>. We'll get back to you at <strong>{form.email}</strong> within 2 business hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="btn-secondary"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Smith"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                    <div className="relative">
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="">Select a topic…</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your issue or question in detail. Include your order number if relevant."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Send Message
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact info */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-4">Get in touch</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'support@commerceos.app', href: 'mailto:support@commerceos.app' },
                  { icon: Phone, label: 'Phone', value: '1-800-COMMERCE', href: 'tel:18002666373' },
                  { icon: MapPin, label: 'Address', value: 'San Francisco, CA', href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response times */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-primary-500" />
                <h3 className="font-bold text-gray-900">Response times</h3>
              </div>
              <div className="space-y-3">
                {[
                  { channel: 'Live chat', time: '< 5 minutes', dot: 'bg-green-400' },
                  { channel: 'Email / form', time: '< 2 hours', dot: 'bg-yellow-400' },
                  { channel: 'Phone', time: 'Mon–Fri 9am–6pm PT', dot: 'bg-blue-400' },
                ].map(({ channel, time, dot }) => (
                  <div key={channel} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 ${dot} rounded-full`} />
                      <span className="text-gray-600">{channel}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-3">Quick links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Track your order', href: '/order-status' },
                  { label: 'Start a return', href: '/returns' },
                  { label: 'Help Center', href: '/help' },
                  { label: 'Shipping info', href: '/shipping' },
                ].map(({ label, href }) => (
                  <a key={label} href={href}
                    className="block text-sm text-primary-600 hover:underline py-0.5">{label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
