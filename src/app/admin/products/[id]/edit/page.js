'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setProduct(d.product);
        else           setError(d.error || 'Failed to load product.');
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AdminShell title="Edit Product">
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[#0F5132] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (error || !product) {
    return (
      <AdminShell title="Edit Product">
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found.'}</p>
          <Link href="/admin/products" className="text-[#0F5132] underline text-sm">← Back to Products</Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={`Edit: ${product.name}`}
      subtitle="Update product details"
      actions={
        <Link href="/admin/products"
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
          ← Back to Products
        </Link>
      }
    >
      <ProductForm
        initialData={{
          ...product,
          category: product.category?._id || product.category,
        }}
        productId={id}
      />
    </AdminShell>
  );
}
