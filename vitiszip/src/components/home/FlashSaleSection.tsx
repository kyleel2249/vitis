'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';

type FlashDeal = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  sold: number;
  total: number;
  slug: string;
};

const FLASH_DEALS: FlashDeal[] = [
  { id: '1', name: 'Wireless Noise-Cancelling Headphones', image: 'https://picsum.photos/seed/headphones/300', price: 49.99, originalPrice: 149.99, sold: 234, total: 300, slug: 'wireless-headphones' },
  { id: '2', name: 'Smart Watch Series X Pro', image: 'https://picsum.photos/seed/watch/300', price: 89.99, originalPrice: 299.99, sold: 156, total: 200, slug: 'smartwatch-x' },
  { id: '3', name: 'Premium Leather Jacket', image: 'https://picsum.photos/seed/jacket/300', price: 79.99, originalPrice: 220.00, sold: 89, total: 100, slug: 'leather-jacket' },
  { id: '4', name: 'Gaming Mechanical Keyboard', image: 'https://picsum.photos/seed/keyboard/300', price: 39.99, originalPrice: 120.00, sold: 310, total: 400, slug: 'gaming-keyboard' },
];

function useCountdown(end: Date) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, end.getTime() - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [end]);
  return time;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xl font-bold tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-gray-400 mt-1 font-medium">{label}</span>
    </div>
  );
}

export default function FlashSaleSection() {
  const cart = useCart();
  const [endTime] = useState(() => new Date(Date.now() + 4 * 3600000 + 32 * 60000));
  const { h, m, s } = useCountdown(endTime);

  return (
    <section className="section bg-gray-950 text-white">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-lg">
              <Zap className="w-5 h-5" />
              Flash Sale
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm font-medium">Ends in:</span>
            </div>
            <div className="flex items-center gap-2">
              <TimeUnit value={h} label="Hours" />
              <span className="text-gray-400 text-xl font-bold pb-4">:</span>
              <TimeUnit value={m} label="Mins" />
              <span className="text-gray-400 text-xl font-bold pb-4">:</span>
              <TimeUnit value={s} label="Secs" />
            </div>
          </div>
          <Link href="/flash-sales" className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FLASH_DEALS.map((deal) => {
            const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
            const pct = Math.round((deal.sold / deal.total) * 100);
            return (
              <div key={deal.id} className="bg-gray-900 rounded-2xl overflow-hidden group hover:ring-1 hover:ring-primary-500/50 transition-all">
                <Link href={`/product/${deal.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-800">
                    <Image src={deal.image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 25vw" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
                  </div>
                </Link>
                <div className="p-3">
                  <Link href={`/product/${deal.slug}`}>
                    <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors leading-snug mb-2">{deal.name}</p>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-white">{formatCurrency(deal.price)}</span>
                    <span className="text-xs text-gray-500 line-through">{formatCurrency(deal.originalPrice)}</span>
                  </div>

                  {/* Stock bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Sold: {deal.sold}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      cart.addItem({ id: deal.id, productId: deal.id, name: deal.name, price: deal.price, originalPrice: deal.originalPrice, image: deal.image, quantity: 1 });
                      toast.success('Added to cart!');
                    }}
                    className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
