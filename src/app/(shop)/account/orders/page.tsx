'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Search, ChevronDown, ChevronUp, LogIn } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

const STATUS_VARIANTS: Record<string, any> = {
  pending: 'warning', confirmed: 'primary', processing: 'primary',
  shipped: 'purple', delivered: 'success', cancelled: 'danger', refunded: 'gray',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    // Check session first
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((json) => {
        setLoggedIn(json.success);
        if (!json.success) { setLoading(false); return; }
        return fetch('/api/orders?limit=50')
          .then((r) => r.json())
          .then((json) => { if (json.success) setOrders(json.data); });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  if (!loading && loggedIn === false) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <LogIn className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view orders</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to see your order history.</p>
        <Link href="/auth/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Package className="w-7 h-7" /> My Orders
      </h1>

      {/* Search + filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number…" className="input pl-9" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="input w-auto py-2.5 text-sm">
          <option value="all">All Status</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">
            {orders.length === 0 ? "You haven't placed any orders yet" : 'No orders match your search'}
          </p>
          {orders.length === 0 && (
            <Link href="/products" className="btn-primary mt-6 inline-flex">Browse Products</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              {/* Header row */}
              <div
                className="flex flex-wrap items-start justify-between gap-3 p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div>
                  <p className="font-bold text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANTS[order.status] || 'gray'} dot className="capitalize">
                    {order.status}
                  </Badge>
                  <span className="font-bold text-gray-900">{formatCurrency(parseFloat(order.total))}</span>
                  {expanded === order.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {/* Items (expanded) */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 space-y-2">
                  {(order.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product_name} <span className="text-gray-400">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(parseFloat(item.unit_price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                    <span>Order Total</span>
                    <span>{formatCurrency(parseFloat(order.total))}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-gray-100 px-5 py-3">
                {order.status === 'shipped' && (
                  <button className="btn-secondary py-2 px-4 text-sm">Track Package</button>
                )}
                {order.status === 'delivered' && (
                  <button className="btn-secondary py-2 px-4 text-sm">Write Review</button>
                )}
                {order.status === 'pending' && (
                  <button className="text-red-500 hover:text-red-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                    Cancel Order
                  </button>
                )}
                {!order.status || order.status === 'confirmed' || order.status === 'processing' ? null : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
