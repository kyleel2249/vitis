'use client';
import useSWR from 'swr';
import { DollarSign, ShoppingCart, Package, Star, TrendingUp, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

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
  return `${Math.floor(hrs / 24)}d ago`;
}

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json()).then((d) => (d.success ? d.data : null));

export default function VendorDashboard() {
  const { data, isLoading: loading, mutate } = useSWR('/api/vendor/stats', fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
  });

  const stats = data?.stats;
  const earningsByWeek = data?.earningsByWeek || [];
  const topProducts = data?.topProducts || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {data?.vendor ? `Welcome back, ${data.vendor.name}!` : "Here's your store performance."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => mutate()} className="btn-icon" title="Refresh data">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/vendor/products/new" className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Earnings',
            value: loading ? '—' : formatCurrency(parseFloat(stats?.total_earnings || '0')),
            icon: DollarSign, bg: 'bg-green-50', color: 'text-green-600',
          },
          {
            label: 'Total Orders',
            value: loading ? '—' : String(stats?.total_orders ?? 0),
            icon: ShoppingCart, bg: 'bg-blue-50', color: 'text-blue-600',
          },
          {
            label: 'Active Products',
            value: loading ? '—' : String(stats?.product_count ?? 0),
            icon: Package, bg: 'bg-purple-50', color: 'text-purple-600',
          },
          {
            label: 'Average Rating',
            value: loading ? '—' : `${parseFloat(stats?.avg_rating || '0').toFixed(1)} ★`,
            icon: Star, bg: 'bg-yellow-50', color: 'text-yellow-600',
          },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-500">{label}</p>
              <TrendingUp className="w-3 h-3 text-green-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Earnings Overview</h3>
              <p className="text-sm text-gray-500">Last 8 weeks</p>
            </div>
          </div>
          {earningsByWeek.length === 0 && !loading ? (
            <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
              No earnings data yet — start selling to see your chart!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={earningsByWeek}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b5bf5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b5bf5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                <Tooltip formatter={(v: any) => [formatCurrency(v), 'Earnings']} />
                <Area type="monotone" dataKey="earnings" stroke="#3b5bf5" strokeWidth={2} fill="url(#earningsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Top Products</h3>
            <Link href="/vendor/products" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}</div>
          ) : topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No products yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.sold} sold · ★ {parseFloat(p.rating).toFixed(1)}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(parseFloat(p.revenue))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <Link href="/vendor/orders" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders yet. Share your store to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Order', 'Product', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.slice(0, 8).map((o: any) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-sm font-semibold text-primary-600">{o.order_number}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-900 max-w-[180px] truncate">{o.product_name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{o.customer_name}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatCurrency(parseFloat(o.vendor_total))}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={STATUS_VARIANTS[o.status] || 'gray'} dot className="capitalize">{o.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{timeAgo(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
