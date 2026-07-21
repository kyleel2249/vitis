'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Settings,
  MessageSquare, Zap, Menu, X, LogOut, Star, DollarSign,
  Tag, Truck, Users, Globe, Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendor/products', label: 'My Products', icon: Package },
  { href: '/vendor/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/vendor/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/vendor/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/vendor/customers', label: 'Customers', icon: Users },
  { href: '/vendor/reviews', label: 'Reviews', icon: Star },
  { href: '/vendor/shipping', label: 'Shipping', icon: Truck },
  { href: '/vendor/coupons', label: 'Coupons', icon: Tag },
  { href: '/vendor/messages', label: 'Messages', icon: MessageSquare },
  { href: '/vendor/store', label: 'My Store', icon: Globe },
  { href: '/vendor/settings', label: 'Settings', icon: Settings },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && ['vendor', 'admin', 'super_admin'].includes(json.user.role)) {
          setUser(json.user);
        } else {
          router.replace('/auth/login?redirect=/vendor/dashboard');
        }
      })
      .catch(() => router.replace('/auth/login?redirect=/vendor/dashboard'));
  }, [router]);

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'V';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/vendor/dashboard" className="flex items-center gap-2">
            <div>
              <p className="text-gray-900 font-bold text-sm">Vitis</p>
              <p className="text-gray-400 text-xs">Vendor Portal</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/vendor/dashboard' && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}>
                  <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600' : 'text-gray-400')} />
                  <span className="flex-1">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium truncate">{user?.name || '…'}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl text-sm transition-all">
            <LogOut className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-icon"><Menu className="w-5 h-5" /></button>
            <div className="flex items-center gap-1 ml-auto">
              <button className="btn-icon relative">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
