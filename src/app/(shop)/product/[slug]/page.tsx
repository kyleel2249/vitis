import { notFound } from 'next/navigation';
import { queryOne, query } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await queryOne(
    'SELECT name, short_description FROM products WHERE slug = $1 AND is_active = true',
    [slug]
  );
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.short_description || product.name,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await queryOne(`
    SELECT p.*, 
      c.name as category_name, 
      v.store_name as vendor_name,
      COALESCE(AVG(r.rating), 0)::numeric(3,1) as rating,
      COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN vendors v ON v.id = p.vendor_id
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE p.slug = $1 AND p.is_active = true
    GROUP BY p.id, c.name, v.store_name
  `, [slug]);

  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    query(`
      SELECT r.*, u.name as user_name, u.avatar_url as user_avatar
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC LIMIT 10
    `, [product.id]),
    query(`
      SELECT p.*, 
        COALESCE(AVG(r.rating), 0)::numeric(3,1) as rating,
        COUNT(r.id) as review_count,
        v.store_name as vendor_name
      FROM products p
      LEFT JOIN reviews r ON r.product_id = p.id
      LEFT JOIN vendors v ON v.id = p.vendor_id
      WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = true
      GROUP BY p.id, v.store_name
      ORDER BY RANDOM() LIMIT 8
    `, [product.category_id, product.id]),
  ]);

  return <ProductDetailClient product={product} reviews={reviews} related={related} />;
}
