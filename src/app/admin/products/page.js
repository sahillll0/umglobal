'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';
import {
  Plus, Search, Filter, ChevronDown, Eye, Pencil, Trash2,
  Copy, Star, StarOff, CheckCircle2, Circle, RefreshCw,
  Package, AlertCircle, ImageIcon,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '',          label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft',     label: 'Draft' },
];

function Badge({ status }) {
  return status === 'published'
    ? <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Published</span>
    : <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Draft</span>;
}

export default function ProductsPage() {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [searchRaw, setSearchRaw] = useState('');
  const [filters, setFilters]     = useState({ status: '', category: '', featured: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const debounce = useRef(null);

  useEffect(() => {
    fetch('/api/admin/categories?all=true')
      .then(r => r.json()).then(d => d.success && setCategories(d.categories));
  }, []);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setSearch(searchRaw), 400);
    return () => clearTimeout(debounce.current);
  }, [searchRaw]);

  useEffect(() => { fetchProducts(); }, [page, search, filters]); // eslint-disable-line

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const p = new URLSearchParams({ page: String(page), limit: '20' });
      if (search)          p.set('search',   search);
      if (filters.status)  p.set('status',   filters.status);
      if (filters.category)p.set('category', filters.category);
      if (filters.featured)p.set('featured', filters.featured);
      const res  = await fetch(`/api/admin/products?${p}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, [page, search, filters]);

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, status: newStatus } : p));
    } catch (e) { alert('Failed to update status: ' + e.message); }
  };

  const toggleFeatured = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: !p.isFeatured } : p));
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (e) { alert('Delete failed: ' + e.message); }
    finally     { setDeleting(false); }
  };

  const addActions = (
    <Link
      href="/admin/products/new"
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F5132] text-white font-semibold hover:bg-[#093822] transition-colors text-sm"
    >
      <Plus className="w-4 h-4" /> Add Product
    </Link>
  );

  return (
    <AdminShell title="Products" subtitle={`${total} product${total !== 1 ? 's' : ''} total`} actions={addActions}>

      {/* Search + filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search products…"
              value={searchRaw}
              onChange={e => { setSearchRaw(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50"
          >
            <Filter className="w-4 h-4" /> Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={fetchProducts} className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Status</label>
              <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]">
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Category</label>
              <select value={filters.category} onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Featured</label>
              <select value={filters.featured} onChange={e => { setFilters(f => ({ ...f, featured: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]">
                <option value="">All</option>
                <option value="true">Featured only</option>
                <option value="false">Not featured</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
          <button onClick={fetchProducts} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#0F5132] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading products…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 flex flex-col items-center gap-3 text-center">
            <Package className="w-14 h-14 text-slate-200" />
            <p className="font-semibold text-slate-700">No products found</p>
            <p className="text-sm text-slate-400">Add your first product to get started</p>
            <Link href="/admin/products/new"
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F5132] text-white text-sm font-semibold">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Product','Category','Status','Featured','Updated','Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                            {p.mainImage?.url
                              ? <Image src={p.mainImage.url} alt={p.mainImage.alt || p.name} width={48} height={48} className="w-full h-full object-cover" />
                              : <ImageIcon className="w-5 h-5 text-slate-300" />
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{p.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5 font-mono">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-5 py-3.5 text-slate-600">
                        {p.category?.name || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleStatus(p)} title="Click to toggle">
                          <Badge status={p.status} />
                        </button>
                      </td>
                      {/* Featured */}
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleFeatured(p)}
                          className={p.isFeatured ? 'text-amber-500' : 'text-slate-300'} title="Toggle featured">
                          {p.isFeatured ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                        </button>
                      </td>
                      {/* Updated */}
                      <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(p.updatedAt).toLocaleDateString('en-IN')}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${p._id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0F5132] hover:text-white text-slate-600 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">
                  ← Previous
                </button>
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-slate-600 mb-6">
              <span className="font-semibold text-slate-800">{deleteTarget.name}</span> will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 text-sm">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
