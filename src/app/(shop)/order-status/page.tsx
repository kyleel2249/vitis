'use client';
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, desc: 'We received your order and payment.' },
  { key: 'processing', label: 'Processing', icon: Package, desc: 'The vendor is preparing your items.' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'Your order is on its way.' },
  { key: 'delivered', label: 'Delivered', icon: MapPin, desc: 'Your order was delivered.' },
];

// Demo order data for display
const DEMO_ORDERS: Record<string, any> = {
  'VIT-001234': {
    number: 'VIT-001234',
    status: 'shipped',
    date: '2026-07-18',
    estimatedDelivery: '2026-07-22',
    items: [{ name: 'Wireless Noise-Cancelling Headphones', qty: 1, price: 79.99 }],
    shipping: { carrier: 'FedEx', tracking: '7489234789234', address: '123 Main St, New York, NY 10001' },
  },
  'VIT-005678': {
    number: 'VIT-005678',
    status: 'delivered',
    date: '2026-07-10',
    estimatedDelivery: '2026-07-15',
    items: [
      { name: 'Yoga Mat Premium Non-Slip', qty: 1, price: 44.99 },
      { name: 'Fitness Resistance Bands Set', qty: 1, price: 24.99 },
    ],
    shipping: { carrier: 'UPS', tracking: '1Z9999W99999999999', address: '456 Oak Ave, Los Angeles, CA 90001' },
  },
};

const STEP_ORDER = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    // Simulate lookup delay
    await new Promise((r) => setTimeout(r, 900));

    const found = DEMO_ORDERS[orderNumber.trim().toUpperCase()];
    if (found) {
      setOrder(found);
    } else {
      setError('No order found with that number and email combination. Please double-check and try again.');
    }
    setSearched(true);
    setLoading(false);
  };

  const currentStepIdx = order ? STEP_ORDER.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
            <Truck className="w-3.5 h-3.5 text-yellow-400" />
            Real-time tracking
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Order Status</h1>
          <p className="text-white/70 text-lg">
            Enter your order number and email address to track your delivery.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {/* Search form */}
        <div className="card p-7">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Track your order</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order number *</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. VIT-001234"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Found in your order confirmation email.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email you ordered with"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Looking up order…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Track Order
                </span>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            Try demo order numbers: <button onClick={() => setOrderNumber('VIT-001234')} className="text-primary-500 underline">VIT-001234</button> or <button onClick={() => setOrderNumber('VIT-005678')} className="text-primary-500 underline">VIT-005678</button>
          </p>
        </div>

        {/* Error */}
        {searched && error && (
          <div className="card p-5 border-red-100 bg-red-50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">{error}</p>
              <p className="text-xs text-red-600 mt-1">
                If you're still having trouble, <Link href="/contact" className="underline">contact support</Link>.
              </p>
            </div>
          </div>
        )}

        {/* Order result */}
        {order && (
          <div className="space-y-5">
            {/* Header */}
            <div className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Order number</p>
                  <p className="text-lg font-black text-gray-900">{order.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium mb-1">Placed on</p>
                  <p className="font-semibold text-gray-900">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl">
                <Clock className="w-4 h-4 text-primary-600" />
                <p className="text-sm text-primary-700 font-medium">
                  Estimated delivery: <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
                </p>
              </div>
            </div>

            {/* Progress tracker */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-6">Shipping progress</h3>
              <div className="relative">
                {/* Progress bar */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-primary-500 transition-all duration-500"
                    style={{ width: `${(currentStepIdx / (STEP_ORDER.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="relative grid grid-cols-4 gap-2">
                  {STATUS_STEPS.map(({ key, label, icon: Icon, desc }, i) => {
                    const done = i <= currentStepIdx;
                    const active = i === currentStepIdx;
                    return (
                      <div key={key} className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 z-10 transition-all ${
                          done ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                        } ${active ? 'ring-4 ring-primary-100' : ''}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className={`text-xs font-bold mb-1 ${done ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
                        <p className="text-xs text-gray-400 hidden sm:block">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carrier info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Carrier & tracking</p>
                <p className="font-bold text-gray-900">{order.shipping.carrier} · {order.shipping.tracking}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {order.shipping.address}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-4">Items in this order</h3>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">
              Need help? <Link href="/contact" className="text-primary-600 hover:underline">Contact our support team</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
