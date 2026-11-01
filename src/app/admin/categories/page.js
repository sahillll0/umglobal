'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';
import {
  Plus, Pencil, Trash2, X, Loader2, ImageIcon,
  CheckCircle2, AlertCircle, Upload,
} from 'lucide-react';

const ICON_OPTIONS = [
  'Package','Flame','Sun','Wheat','Sprout','Apple',
  'Leaf','ShoppingBag','Globe','Star',
];

const EMPTY = {
  name:'', slug:'', description:'', subtitle:'', badge:'',
  icon:'Package', sortOrder:0, isPublished:true,
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoriesPage() {
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState(null);   // null = new, id = edit
  const [form, setForm]                 = useState(EMPTY);
  const [catImage, setCatImage]         = useState(null);
  const [saving, setSaving]             = useState(false);
  const [saveMsg, setSaveMsg]           = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [uploading, setUploading]       = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/admin/categories?all=true');
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setCategories(data.categories);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openNew = () => {
    setEditing(null); setForm(EMPTY); setCatImage(null); setSaveMsg('');
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat._id);
    setForm({
      name: cat.name, slug: cat.slug, description: cat.description || '',
      subtitle: cat.subtitle || '', badge: cat.badge || '',
      icon: cat.icon || 'Package', sortOrder: cat.sortOrder ?? 0,
      isPublished: cat.isPublished !== false,
    });
    setCatImage(cat.image || null);
    setSaveMsg('');
    setModalOpen(true);
  };

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-slug when creating new
  useEffect(() => {
    if (!editing && form.name) setF('slug', slugify(form.name));
  }, [form.name, editing]); // eslint-disable-line

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'umglobal-categories');
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setCatImage({ url: data.url, publicId: data.publicId, alt: form.name });
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setSaveMsg('Name is required.'); return; }
    setSaving(true); setSaveMsg('');
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name), image: catImage };
      const url    = editing ? `/api/admin/categories/${editing}` : '/api/admin/categories';
      const method = editing ? 'PATCH' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data   = await res.json();
      if (!data.success) throw new Error(data.error);
      setSaveMsg(editing ? 'Updated!' : 'Created!');
      await fetch_();
      setTimeout(() => setModalOpen(false), 800);
    } catch (err) { setSaveMsg('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res  = await fetch(`/api/admin/categories/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      await fetch_();
      setDeleteTarget(null);
    } catch (err) { alert('Delete failed: ' + err.message); }
    finally { setDeleting(false); }
  };

  const togglePublish = async (cat) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !cat.isPublished }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isPublished: !c.isPublished } : c));
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const addBtn = (
    <button onClick={openNew}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F5132] text-white font-semibold hover:bg-[#093822] transition-colors text-sm">
      <Plus className="w-4 h-4" /> Add Category
    </button>
  );

  return (
    <AdminShell title="Categories" subtitle={`${categories.length} categories`} actions={addBtn}>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" /><p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F5132]" />
            <p className="text-sm text-slate-400">Loading categories…</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 flex flex-col items-center gap-3 text-center">
            <p className="font-semibold text-slate-700">No categories yet</p>
            <button onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F5132] text-white text-sm font-semibold">
              <Plus className="w-4 h-4" /> Add First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Category','Description','Status','Products','Sort','Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                          {cat.image?.url
                            ? <Image src={cat.image.url} alt={cat.name} width={40} height={40} className="w-full h-full object-cover" />
                            : <ImageIcon className="w-5 h-5 text-slate-300" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{cat.name}</p>
                          <p className="text-xs text-slate-400 font-mono">/{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => togglePublish(cat)}>
                        {cat.isPublished
                          ? <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Published</span>
                          : <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">Hidden</span>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{cat.productCount ?? 0}</td>
                    <td className="px-5 py-3.5 text-slate-600">{cat.sortOrder ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(cat)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0F5132] hover:text-white text-slate-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(cat)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {saveMsg && (
                <div className={`p-3 rounded-xl text-sm font-semibold ${saveMsg.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {saveMsg}
                </div>
              )}

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Image</label>
                {catImage?.url ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-100">
                    <Image src={catImage.url} alt={form.name} fill className="object-cover" />
                    <button onClick={() => setCatImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#0F5132] hover:bg-slate-50 transition-colors">
                    {uploading ? <Loader2 className="w-6 h-6 text-slate-400 animate-spin" /> : <Upload className="w-6 h-6 text-slate-300" />}
                    <span className="text-xs text-slate-400 mt-2">{uploading ? 'Uploading…' : 'Click to upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <LF label="Name *">
                <input className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Spices" />
              </LF>
              <LF label="Slug">
                <input className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  value={form.slug} onChange={e => setF('slug', slugify(e.target.value))} placeholder="auto-generated" />
              </LF>
              <LF label="Subtitle">
                <input className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  value={form.subtitle} onChange={e => setF('subtitle', e.target.value)} />
              </LF>
              <LF label="Description">
                <textarea rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  value={form.description} onChange={e => setF('description', e.target.value)} />
              </LF>
              <LF label="Badge Text">
                <input className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  value={form.badge} onChange={e => setF('badge', e.target.value)} placeholder="e.g. Export Standard" />
              </LF>
              <div className="grid grid-cols-2 gap-4">
                <LF label="Icon">
                  <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    value={form.icon} onChange={e => setF('icon', e.target.value)}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </LF>
                <LF label="Sort Order">
                  <input type="number" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    value={form.sortOrder} onChange={e => setF('sortOrder', Number(e.target.value))} />
                </LF>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="catPub" checked={form.isPublished}
                  onChange={e => setF('isPublished', e.target.checked)} className="w-4 h-4 accent-[#0F5132]" />
                <label htmlFor="catPub" className="text-sm font-medium text-slate-700">Published (visible on website)</label>
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-[#0F5132] text-white font-semibold text-sm hover:bg-[#093822] disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Category?</h3>
            <p className="text-sm text-slate-600 mb-6">
              <span className="font-semibold">{deleteTarget.name}</span> will be permanently deleted. Products in this category must be re-assigned first.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function LF({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
