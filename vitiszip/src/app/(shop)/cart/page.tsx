'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Truck, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = cart.totalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const couponDiscount = appliedCoupon ? subtotal * (appliedCoupon.discount / 100) : 0;
  const tax = (subtotal - couponDiscount) * 0.08;
  const total = subtotal - couponDiscount + shipping + tax;

  const applyCoupon = () => {
    const COUPONS: Record<string, number> = { WELCOME10: 10, SAVE20: 20, SUMMER15: 15 };
    const upper = coupon.toUpperCase();
    if (COUPONS[upper]) {
      setAppliedCoupon({ code: upper, discount: COUPONS[upper] });
      toast.success(`Coupon applied! ${COUPONS[upper]}% off`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add items to your cart to get started.</p>
        <Link href="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingCart className="w-7 h-7" /> Shopping Cart
        <span className="text-lg font-normal text-gray-400">({cart.totalItems()} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div key={item.productId + (item.variant || '')}
                layout exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="card p-4 flex gap-4">
                <Link href={`/product/${item.productId}`} className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  <Image src={item.image || `https://picsum.photos/seed/${item.productId}/200`} alt={item.name}
                    fill className="object-cover" sizes="96px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.productId}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 text-sm">
                    {item.name}
                  </Link>
                  {item.variant && <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>}
                  {item.vendorName && <p className="text-xs text-primary-600 mt-0.5">{item.vendorName}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                      <button onClick={() => cart.updateQuantity(item.productId, item.quantity - 1, item.variant)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.productId, item.quantity + 1, item.variant)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        {item.quantity > 1 && <p className="text-xs text-gray-400">{formatCurrency(item.price)} each</p>}
                      </div>
                      <button onClick={() => { cart.removeItem(item.productId, item.variant); toast.success('Item removed'); }}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={() => { cart.clearCart(); toast.success('Cart cleared'); }}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.totalItems()} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {appliedCoupon.code} ({appliedCoupon.discount}%)</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                placeholder="Coupon code"
                className="flex-1 input text-sm py-2.5"
              />
              <button onClick={applyCoupon} className="btn-secondary py-2.5 px-4 text-sm">Apply</button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Try: WELCOME10, SAVE20, SUMMER15</p>

            <button
              onClick={async () => {
                const res = await fetch('/api/auth/me');
                const json = await res.json();
                if (json.success) {
                  router.push('/checkout');
                } else {
                  router.push('/auth/login?redirect=/checkout');
                }
              }}
              className="btn-primary w-full mt-4 justify-center py-3.5 text-base"
            >
              Checkout <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure 256-bit SSL checkout
            </div>
          </div>

          {subtotal < 50 && (
            <div className="card p-4 bg-primary-50 border-primary-100">
              <p className="text-sm text-primary-700 font-medium text-center">
                Add {formatCurrency(50 - subtotal)} more for <strong>FREE shipping</strong> 🎉
              </p>
              <div className="mt-2 h-2 bg-primary-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
