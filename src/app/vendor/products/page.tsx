'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Eye, Package, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function VendorProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    // Use the vendor-scoped endpoint — returns all products including inactive ones,
    // and derives vendor identity server-side from the auth session.
    fetch('/api/vendor/products?limit=100')
      .then((r) => r.json())
      .then((json) => { if (json.success) setProducts(json.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = async (product: any) => {
    if (!confirm(`Delete "${product.name}"? This will hide it from the store.`)) return;
    const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success('Product removed from store');
    } else {
      toast.error('Failed to delete product');
    }
  };

  const toggleActive = async (product: any) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    const json = await res.json();
    if (json.success) {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
      toast.success(`Product ${!product.is_active ? 'activated' : 'deactivated'}`);
    } else {
      toast.error('Failed to update product');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''} in your store</p>
        </div>
        <Link href="/vendor/products/new" className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or SKU…"
          className="input pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-4 h-20 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No products yet</p>
          <p className="text-sm mb-6">Add your first product to start selling.</p>
          <Link href="/vendor/products/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Product</th>
                <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">SKU</th>
                <th className="px-5 py-3 text-left font-semibold">Price</th>
                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Stock</th>
                <th className="px-5 py-3 text-left font-semibold hidden lg:table-cell">Sold</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => {
                const img = product.images?.[0] || `https://picsum.photos/seed/${product.id}/80`;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={img} alt={product.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden sm:table-cell font-mono">{product.sku}</td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</p>
                        {product.compare_price && (
                          <p className="text-xs text-gray-400 line-through">{formatCurrency(product.compare_price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`text-sm font-semibold ${product.stock_quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden lg:table-cell">{product.sold_count}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={product.is_active ? 'success' : 'gray'} dot>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/product/${product.slug}`} target="_blank"
                          className="btn-icon text-gray-400 hover:text-gray-600" title="View in store">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/vendor/products/${product.id}/edit`}
                          className="btn-icon text-gray-400 hover:text-primary-600" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => toggleActive(product)}
                          className="btn-icon text-gray-400 hover:text-gray-600" title={product.is_active ? 'Deactivate' : 'Activate'}>
                          {product.is_active
                            ? <ToggleRight className="w-4 h-4 text-green-500" />
                            : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => deleteProduct(product)}
                          className="btn-icon text-gray-400 hover:text-red-500" title="Delete product">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
