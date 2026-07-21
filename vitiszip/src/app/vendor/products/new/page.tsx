'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    compare_price: '',
    sku: '',
    stock_quantity: '100',
    category_id: '',
    images: '',
    tags: '',
    is_featured: false,
    weight: '',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/vendor/stats').then((r) => r.json()),
    ]).then(([catJson, statsJson]) => {
      if (catJson.success) setCategories(catJson.data || []);
      if (statsJson.success) setVendorId(statsJson.data.vendor?.id);
    }).catch(console.error);
  }, []);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.sku) {
      toast.error('Name, price, and SKU are required');
      return;
    }
    if (!vendorId) {
      toast.error('Vendor session not found — please log in as a vendor');
      return;
    }
    setLoading(true);

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
      '-' + Date.now().toString(36);

    const images = form.images
      ? form.images.split('\n').map((u) => u.trim()).filter(Boolean)
      : [];
    const tags = form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug,
          description: form.description,
          short_description: form.short_description || form.description.slice(0, 120),
          price: parseFloat(form.price),
          compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
          sku: form.sku,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          category_id: form.category_id || null,
          vendor_id: vendorId,
          images,
          tags,
          is_featured: form.is_featured,
          weight: form.weight ? parseFloat(form.weight) : null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Product created!');
        router.push('/vendor/products');
      } else {
        toast.error(json.error || 'Failed to create product');
      }
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/products" className="btn-icon text-gray-400 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-0.5">Fill in the details below to list your product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-600" /> Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Wireless Noise-Canceling Headphones" className="input" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (USD) *</label>
              <input value={form.price} onChange={(e) => set('price', e.target.value)}
                type="number" step="0.01" min="0" placeholder="29.99" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Compare Price</label>
              <input value={form.compare_price} onChange={(e) => set('compare_price', e.target.value)}
                type="number" step="0.01" min="0" placeholder="49.99" className="input" />
              <p className="text-xs text-gray-400 mt-1">Original price (shown as strikethrough)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU *</label>
              <input value={form.sku} onChange={(e) => set('sku', e.target.value)}
                placeholder="SKU-HEADPHONES-01" className="input font-mono" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
              <input value={form.stock_quantity} onChange={(e) => set('stock_quantity', e.target.value)}
                type="number" min="0" placeholder="100" className="input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)} className="input">
              <option value="">— Select a category —</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={4} placeholder="Describe your product in detail…" className="input resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
            <input value={form.short_description} onChange={(e) => set('short_description', e.target.value)}
              placeholder="One-line summary (auto-filled from description if blank)" className="input" />
          </div>
        </div>

        {/* Images & Tags */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Images & Tags</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URLs</label>
            <textarea value={form.images} onChange={(e) => set('images', e.target.value)}
              rows={3} placeholder="https://images.unsplash.com/photo-…&#10;(one URL per line)"
              className="input resize-none font-mono text-sm" />
            <p className="text-xs text-gray-400 mt-1">One URL per line. Use images from Unsplash (images.unsplash.com).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)}
              placeholder="electronics, wireless, headphones" className="input" />
            <p className="text-xs text-gray-400 mt-1">Comma-separated tags to improve discoverability.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
              <input value={form.weight} onChange={(e) => set('weight', e.target.value)}
                type="number" step="0.01" min="0" placeholder="0.5" className="input" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="featured" checked={form.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)} className="w-4 h-4 text-primary-600" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">Feature this product</label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/vendor/products" className="btn-secondary py-3 px-6">Cancel</Link>
          <button type="submit" disabled={loading}
            className="btn-primary py-3 px-8 gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {loading ? 'Creating…' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
