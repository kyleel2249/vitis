'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { formatCurrency, cn } from '@/lib/utils';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

type Props = {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
};

export default function ProductCard({ product, variant = 'default' }: Props) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);

  const inCart = cart.isInCart(product.id);
  const inWishlist = wishlist.isWishlisted(product.id);
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart.addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price,
      image: product.images[0] || '',
      vendorId: product.vendor_id,
      vendorName: product.vendor_name,
    });
    toast.success(`Added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  if (variant === 'horizontal') {
    return (
      <Link href={`/product/${product.slug}`} className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all group">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <Image src={product.images[0] || 'https://picsum.photos/200'} alt={product.name}
            fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{product.name}</p>
          <StarRating rating={product.rating} count={product.review_count} size="sm" className="mt-1" />
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.compare_price && <span className="text-xs text-gray-400 line-through">{formatCurrency(product.compare_price)}</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="card-hover overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            {!imgLoaded && <div className="skeleton absolute inset-0" />}
            <Image
              src={product.images[0] || `https://picsum.photos/seed/${product.id}/400`}
              alt={product.name}
              fill
              className={cn('object-cover transition-all duration-500 group-hover:scale-105', imgLoaded ? 'opacity-100' : 'opacity-0')}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImgLoaded(true)}
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <span className="badge bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  -{discount}%
                </span>
              )}
              {product.is_featured && (
                <span className="badge bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  Featured
                </span>
              )}
              {product.stock_quantity === 0 && (
                <span className="badge bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  Sold Out
                </span>
              )}
            </div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovering ? 1 : 0 }}
              className="absolute top-2 right-2 flex flex-col gap-1.5"
            >
              <button onClick={handleWishlist}
                className={cn(
                  'w-8 h-8 rounded-lg shadow-sm flex items-center justify-center transition-all',
                  inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                )}>
                <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
              </button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/product/${product.slug}`; }}
                className="w-8 h-8 rounded-lg shadow-sm bg-white/90 text-gray-600 hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all">
                <Eye className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Add to cart */}
            <motion.button
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: hovering ? 0 : 16, opacity: hovering ? 1 : 0 }}
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="absolute bottom-2 left-2 right-2 btn-primary py-2 text-sm gap-1.5 disabled:opacity-50"
            >
              {inCart ? <><Zap className="w-4 h-4" />In Cart</> : <><ShoppingCart className="w-4 h-4" />Add to Cart</>}
            </motion.button>
          </div>

          {/* Info */}
          <div className="p-3">
            {product.vendor_name && (
              <p className="text-xs text-primary-600 font-medium mb-0.5">{product.vendor_name}</p>
            )}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
              {product.name}
            </h3>
            <StarRating rating={product.rating} count={product.review_count} size="sm" className="mt-1.5" />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
              {product.compare_price && (
                <>
                  <span className="text-xs text-gray-400 line-through">{formatCurrency(product.compare_price)}</span>
                  <span className="text-xs font-semibold text-green-600">-{discount}%</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
