'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';
import { useCart } from '@/lib/cart';
import ProductCard from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wishlist.items.length === 0) { setProducts([]); return; }
    setLoading(true);
    // Fetch products by IDs
    Promise.all(
      wishlist.items.slice(0, 20).map((id) =>
        fetch(`/api/products/${id}`).then(r => r.json()).then(d => d.data).catch(() => null)
      )
    ).then((results) => {
      setProducts(results.filter(Boolean));
      setLoading(false);
    });
  }, [wishlist.items.length]);

  if (wishlist.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-red-200" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save items you love by clicking the heart icon.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          My Wishlist
          <span className="text-lg font-normal text-gray-400">({wishlist.items.length} items)</span>
        </h1>
        <button onClick={() => { wishlist.clear(); toast.success('Wishlist cleared'); }}
          className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" /> Clear all
        </button>
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.items.map((id) => (
            <div key={id} className="card p-4 text-center text-sm text-gray-400">
              <div className="aspect-square bg-gray-50 rounded-xl mb-3" />
              <button onClick={() => wishlist.toggle(id)} className="text-red-400 hover:text-red-600 flex items-center gap-1 mx-auto text-xs">
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
