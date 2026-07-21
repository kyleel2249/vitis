'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  shop: {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=best_sellers' },
      { label: 'Deals & Offers', href: '/deals' },
      { label: 'Flash Sales', href: '/flash-sales' },
      { label: 'Gift Cards', href: '/gift-cards' },
      { label: 'All Categories', href: '/categories' },
    ],
  },
  sell: {
    title: 'Sell',
    links: [
      { label: 'Start Selling', href: '/vendor/register' },
      { label: 'Vendor Dashboard', href: '/vendor/dashboard' },
      { label: 'Vendor Resources', href: '/vendor/resources' },
      { label: 'Commission Rates', href: '/vendor/commissions' },
      { label: 'Affiliate Program', href: '/affiliates' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Order Status', href: '/account/orders' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Size Guide', href: '/size-guide' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Investors', href: '/investors' },
    ],
  },
};

const SOCIAL_LINKS = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const PAYMENT_METHODS = ['Visa', 'MC', 'AmEx', 'PayPal', 'ApplePay', 'GPay', 'Crypto'];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Stay in the loop</h3>
              <p className="text-gray-400 mt-1">Get exclusive deals, new arrivals, and AI-powered recommendations.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image src="/vitis-logo.png" alt="Vitis" width={120} height={37} className="h-9 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              The world's most advanced AI-powered commerce operating system. Connecting millions of buyers and sellers globally.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>support@commerceos.app</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>1-800-COMMERCE</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>© 2026 Vitis. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-gray-300 transition-colors">Accessibility</Link>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-gray-500">Secure payments:</span>
            {PAYMENT_METHODS.map((m) => (
              <span key={m} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-medium">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
