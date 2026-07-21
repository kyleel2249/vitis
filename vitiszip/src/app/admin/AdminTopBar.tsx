'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Shield, ChevronRight } from 'lucide-react';

interface AdminTopBarProps {
  session: { name: string; email: string; role: string };
}

export default function AdminTopBar({ session }: AdminTopBarProps) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 hidden lg:block">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Store</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium capitalize">
            {pathname.replace('/admin/', '').replace('/admin', 'Dashboard')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-icon relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="btn-icon"><Shield className="w-5 h-5" /></button>
          <div className="text-sm text-gray-600 ml-2">
            <span className="font-medium">{session.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
