'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search, ShoppingCart, Heart, User, Menu, X, ChevronDown,
  Package, Bell, LogOut, LogIn, LayoutDashboard,
  Store, Sun, Moon, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { cn } from '@/lib/utils';
import { PRODUCT_CATEGORIES } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'Flash Sales', href: '/flash-sales' },
  { label: 'Deals & Offers', href: '/offers' },
  { label: 'Gift Cards', href: '/gift-cards' },
  { label: 'Brands', href: '/brands' },
  { label: 'Vendors', href: '/vendors' },
];

type CurrentUser = { id: string; name: string; email: string; role: string } | null;

export default function Header() {
  const router = useRouter();
  const cart = useCart();
  const wishlist = useWishlist();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On mount: resolve auth state and sync cart + wishlist with server
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user) return;
        setCurrentUser(data.user);

        const userId = data.user.id;

        // Mark stores as logged-in so future mutations hit the API
        cart.setUserId(userId);
        wishlist.setUserId(userId);

        // Merge local cart with server cart (local qty wins for conflicts,
        // items from other devices are preserved)
        const localCartItems = useCart.getState().items;
        const cartRes = await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: localCartItems }),
        });
        if (cartRes.ok) {
          const { items } = await cartRes.json();
          useCart.getState().setItems(items);
        }

        // Merge local wishlist with server wishlist
        const localWishlistIds = useWishlist.getState().items;
        const wishRes = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: localWishlistIds }),
        });
        if (wishRes.ok) {
          const { productIds } = await wishRes.json();
          useWishlist.getState().setItems(productIds);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    setUserOpen(false);
    await signOut(auth);
    await fetch('/api/auth/logout', { method: 'POST' });
    // Clear local cart and wishlist so the next user on this device starts fresh
    // (their data is safely persisted on the server)
    useCart.getState().setUserId(null);
    useCart.getState().clearCart();
    useWishlist.getState().setUserId(null);
    useWishlist.getState().clear();
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-100'
    )}>
      {/* Top announcement bar */}
      <div className="bg-black text-white text-center py-2 text-xs font-medium">
        <span>🎁 Free shipping on orders over $50 &nbsp;·&nbsp; Use code </span>
        <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded">WELCOME10</span>
        <span> for 10% off your first order</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/vitis-logo.png" alt="Vitis" width={96} height={30} className="h-8 w-auto object-contain" priority />
          </Link>

          {/* Categories dropdown */}
          <div className="relative hidden md:block">
            <button
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <Menu className="w-4 h-4" />
              Categories
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-card border border-gray-100 p-2 z-50"
                  onMouseEnter={() => setCatOpen(true)}
                  onMouseLeave={() => setCatOpen(false)}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium text-gray-700">{cat.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, vendors…"
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
              />
              <button type="button" className="absolute right-3 p-1 text-gray-400 hover:text-primary-600 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button onClick={toggleDark} className="btn-icon hidden sm:flex">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link href="/wishlist" className="btn-icon relative">
              <Heart className="w-4 h-4" />
              {wishlist.items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="btn-icon relative">
              <ShoppingCart className="w-4 h-4" />
              {cart.totalItems() > 0 && (
                <motion.span
                  key={cart.totalItems()}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {cart.totalItems()}
                </motion.span>
              )}
            </Link>

            {/* User menu */}
            <div className="relative">
              <button className="btn-icon" onClick={() => setUserOpen(!userOpen)}>
                <User className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-gray-100 p-2 z-50"
                  >
                    {currentUser ? (
                      <>
                        <div className="px-3 py-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                        </div>
                        <div className="border-t border-gray-100 my-1" />
                        <Link href="/account" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                          <User className="w-4 h-4 text-gray-500" /> My Account
                        </Link>
                        <Link href="/account/orders" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                          <Package className="w-4 h-4 text-gray-500" /> Orders
                        </Link>
                        <Link href="/account/notifications" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                          <Bell className="w-4 h-4 text-gray-500" /> Notifications
                        </Link>
                        {currentUser.role === 'vendor' && (
                          <>
                            <div className="border-t border-gray-100 my-1" />
                            <Link href="/vendor/dashboard" onClick={() => setUserOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                              <Store className="w-4 h-4 text-gray-500" /> Vendor Dashboard
                            </Link>
                          </>
                        )}
                        {['admin', 'super_admin'].includes(currentUser.role) && (
                          <>
                            <div className="border-t border-gray-100 my-1" />
                            <Link href="/admin" onClick={() => setUserOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                              <LayoutDashboard className="w-4 h-4 text-gray-500" /> Admin Panel
                            </Link>
                          </>
                        )}
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-red-600">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-primary-600">
                          <LogIn className="w-4 h-4" /> Sign In
                        </Link>
                        <Link href="/auth/register" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                          <User className="w-4 h-4 text-gray-500" /> Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="md:hidden btn-icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50">
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Categories</p>
                {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                  <Link key={cat.id} href={`/products?category=${cat.id}`} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-gray-50">
                    <span>{cat.icon}</span><span>{cat.name}</span>
                  </Link>
                ))}
              </div>
              {currentUser ? (
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-gray-50">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary-600 rounded-xl hover:bg-gray-50">
                    Sign In
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
