'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RefreshCw, ChevronRight, Minus, Plus, Check, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { formatCurrency, cn } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import ProductCard from '@/components/ui/ProductCard';
import toast from 'react-hot-toast';

type Props = { product: any; reviews: any[]; related: any[] };

export default function ProductDetailClient({ product, reviews, related }: Props) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [tab, setTab] = useState<'description' | 'reviews' | 'specs'>('description');

  const images: string[] = product.images?.length
    ? product.images
    : [`https://picsum.photos/seed/${product.id}/600`];

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const inWishlist = wishlist.isWishlisted(product.id);

  const handleAddToCart = () => {
    cart.addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      originalPrice: product.compare_price ? Number(product.compare_price) : undefined,
      image: images[0],
      quantity,
      variant: selectedVariant,
      vendorId: product.vendor_id,
      vendorName: product.vendor_name,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product.category_name && (
          <>
            <Link href={`/products?category=${product.category_id}`} className="hover:text-primary-600">{product.category_name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <Image src={images[selectedImage] || `https://picsum.photos/seed/${product.id}/600`} alt={product.name}
                  fill className="object-contain p-4" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </motion.div>
            </AnimatePresence>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm">
                -{discount}%
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={cn('relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border-2 transition-all',
                    i === selectedImage ? 'border-primary-500 shadow-glow' : 'border-transparent hover:border-gray-300')}>
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-contain p-1" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.vendor_name && (
            <Link href={`/vendor/${product.vendor_id}`} className="text-sm font-semibold text-primary-600 hover:underline mb-1 inline-block">
              {product.vendor_name}
            </Link>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={Number(product.rating)} count={Number(product.review_count)} size="md" />
            {product.stock_quantity > 0 ? (
              <span className="badge-success flex items-center gap-1"><Check className="w-3 h-3" /> In Stock ({product.stock_quantity})</span>
            ) : (
              <span className="badge-danger">Out of Stock</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-gray-900">{formatCurrency(product.price)}</span>
            {product.compare_price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.compare_price)}</span>
                <span className="badge-success font-bold">Save {formatCurrency(product.compare_price - product.price)}</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.short_description || product.description?.slice(0, 200) + '...'}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-gray-700 w-20">Quantity:</span>
            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={product.stock_quantity === 0}
              className="flex-1 btn-primary py-3.5 text-base disabled:opacity-50">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={() => { wishlist.toggle(product.id); toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!'); }}
              className={cn('btn-icon w-12 h-12 border-2 rounded-xl', inWishlist ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200')}>
              <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
            </button>
            <button className="btn-icon w-12 h-12 border-2 border-gray-200 rounded-xl">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'On orders over $50' },
              { icon: Shield, title: 'Secure Checkout', sub: '256-bit SSL' },
              { icon: RefreshCw, title: 'Easy Returns', sub: '30-day policy' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                <Icon className="w-5 h-5 text-primary-600 mb-1.5" />
                <p className="text-xs font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {(['description', 'reviews', 'specs'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('pb-3 text-sm font-semibold capitalize border-b-2 transition-colors',
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-900')}>
              {t}{t === 'reviews' && ` (${reviews.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-16">
        {tab === 'description' && (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((r: any) => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {r.user_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{r.user_name}</p>
                        <StarRating rating={r.rating} showCount={false} size="sm" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.title && <p className="font-semibold text-gray-900 mt-3 mb-1">{r.title}</p>}
                  <p className="text-gray-600 text-sm leading-relaxed">{r.body}</p>
                  {r.is_verified && <span className="badge-success mt-2 inline-flex"><Check className="w-3 h-3" /> Verified Purchase</span>}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'specs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'SKU', value: product.sku },
              { label: 'Category', value: product.category_name },
              { label: 'Stock', value: `${product.stock_quantity} units` },
              { label: 'Vendor', value: product.vendor_name || 'Vitis' },
              { label: 'Digital', value: product.is_digital ? 'Yes' : 'No' },
              { label: 'Weight', value: product.weight ? `${product.weight}kg` : 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{value || 'N/A'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
