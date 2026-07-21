'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, DollarSign, Eye, ArrowUpRight, Clock, Star } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

const REVENUE_DATA = [
  { date: 'Jun 25', revenue: 12400, orders: 89 },
  { date: 'Jun 26', revenue: 18200, orders: 134 },
  { date: 'Jun 27', revenue: 14800, orders: 98 },
  { date: 'Jun 28', revenue: 22100, orders: 156 },
  { date: 'Jun 29', revenue: 19500, orders: 142 },
  { date: 'Jun 30', revenue: 25800, orders: 189 },
  { date: 'Jul 1',  revenue: 31200, orders: 234 },
  { date: 'Jul 2',  revenue: 28900, orders: 212 },
  { date: 'Jul 3',  revenue: 35100, orders: 267 },
  { date: 'Jul 4',  revenue: 42300, orders: 312 },
  { date: 'Jul 5',  revenue: 38700, orders: 284 },
  { date: 'Jul 6',  revenue: 44500, orders: 334 },
  { date: 'Jul 7',  revenue: 51200, orders: 387 },
  { date: 'Jul 8',  revenue: 47800, orders: 356 },
];

const CATEGORY_DATA = [
  { name: 'Electronics', value: 34, color: '#3b5bf5' },
  { name: 'Fashion', value: 28, color: '#ff24c2' },
  { name: 'Home', value: 18, color: '#10b981' },
  { name: 'Sports', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#6b7280' },
];

const RECENT_ORDERS = [
  { id: 'COS-001', customer: 'Sarah Mitchell', amount: 189.99, status: 'delivered', items: 3, date: '2m ago' },
  { id: 'COS-002', customer: 'David Chen', amount: 74.50, status: 'shipped', items: 1, date: '8m ago' },
  { id: 'COS-003', customer: 'Emma Williams', amount: 399.00, status: 'processing', items: 2, date: '15m ago' },
  { id: 'COS-004', customer: 'Marco Rossi', amount: 55.00, status: 'pending', items: 1, date: '23m ago' },
  { id: 'COS-005', customer: 'Aisha Rahman', amount: 128.75, status: 'delivered', items: 4, date: '31m ago' },
];

const STATUS_VARIANTS: Record<string, any> = { delivered: 'success', shipped: 'purple', processing: 'primary', pending: 'warning', cancelled: 'danger' };

type StatCard = { label: string; value: string; change: number; icon: React.ElementType; color: string; bg: string };

const STATS: StatCard[] = [
  { label: 'Total Revenue', value: '$284,392', change: 18.2, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Total Orders', value: '12,847', change: 12.5, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Active Customers', value: '48,291', change: 8.1, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Products Listed', value: '10,482', change: -2.3, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
  { label: 'Page Views', value: '2.4M', change: 24.7, icon: Eye, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  { label: 'Avg. Rating', value: '4.8 ★', change: 0.3, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, Admin — here's what's happening today.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          {['24h', '7d', '30d', '90d'].map((r) => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === r ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(change)}%
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Revenue & Orders</h3>
              <p className="text-sm text-gray-500">Last 14 days performance</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1 text-primary-600"><span className="w-3 h-0.5 bg-primary-600 rounded inline-block" /> Revenue</span>
              <span className="flex items-center gap-1 text-accent-500"><span className="w-3 h-0.5 bg-accent-500 rounded inline-block" /> Orders</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b5bf5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b5bf5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any, n) => [n === 'revenue' ? formatCurrency(v) : v, n === 'revenue' ? 'Revenue' : 'Orders']} />
              <Area type="monotone" dataKey="revenue" stroke="#3b5bf5" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-1">Sales by Category</h3>
          <p className="text-sm text-gray-500 mb-4">Revenue distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {CATEGORY_DATA.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <a href="/admin/orders" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Time'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-primary-600">{order.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{order.items} items</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatCurrency(order.amount)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={STATUS_VARIANTS[order.status]} dot className="capitalize">{order.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />{order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
