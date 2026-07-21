'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

const STATUS_VARIANTS: Record<string, any> = {
  pending: 'warning', confirmed: 'primary', processing: 'primary',
  shipped: 'purple', delivered: 'success', cancelled: 'danger', refunded: 'gray',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days}d ago`;
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch('/api/vendor/orders?limit=50')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setOrders(json.data);
          setTotal(json.total);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">{total} order{total !== 1 ? 's' : ''} containing your products</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or customer…" className="input pl-9" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto py-2.5 text-sm">
          <option value="all">All Status</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="card p-5 h-20 animate-pulse bg-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center text-gray-400">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm mt-1">Orders containing your products will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              {/* Order header */}
              <div
                className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary-600 text-sm">{order.order_number}</p>
                  <p className="text-xs text-gray-400">{timeAgo(order.created_at)}</p>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{order.customer_name}</span>
                  <span className="text-gray-400 hidden sm:inline"> · {order.customer_email}</span>
                </div>
                <Badge variant={STATUS_VARIANTS[order.status] || 'gray'} dot className="capitalize">
                  {order.status}
                </Badge>
                <span className="font-bold text-gray-900">{formatCurrency(parseFloat(order.vendor_total))}</span>
                {expanded === order.id
                  ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </div>

              {/* Expanded items */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items in this order</p>
                  <div className="space-y-2">
                    {(order.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0" />
                        <span className="flex-1 text-gray-800">
                          {item.product_name} <span className="text-gray-400">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-700">{formatCurrency(parseFloat(item.total_price))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
