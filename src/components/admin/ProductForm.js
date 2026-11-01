'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Plus, Trash2, ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProductForm({ initialData = null, productId = null }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [categories, setCategories] = useState([]);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');
  const [errors, setErrors]         = useState({});

  // Form state
  const [form, setForm] = useState({
    name: '', slug: '', category: '', shortDescription: '', fullDescription: '',
    origin: '', packagingInfo: '', minimumOrderQuantity: '',
    availablePackagingSizes: [],
    varieties: [],
    status: 'draft', isFeatured: false,
    seo: { title: '', description: '' },
    ...initialData,
  });

  const [mainImage, setMainImage]         = useState(initialData?.mainImage || null);
  const [additionalImages, setAdditional] = useState(initialData?.additionalImages || []);
  const [specs, setSpecs]                 = useState(
    initialData?.specifications
      ? Object.entries(initialData.specifications)
      : []
  );
  const [uploading, setUploading]         = useState(false);

  // Auto-slug from name (only when creating new)
  useEffect(() => {
    if (!isEdit && form.name) {
      setForm(f => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, isEdit]);

  useEffect(() => {
    fetch('/api/admin/categories?all=true')
      .then(r => r.json())
      .then(d => d.success && setCategories(d.categories));
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'umglobal-products');
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return { url: data.url, publicId: data.publicId, alt: form.name };
    } finally { setUploading(false); }
  };

  const handleMainImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setMainImage(await uploadImage(file)); }
    catch (err) { alert('Upload failed: ' + err.message); }
  };

  const handleAdditionalImage = async (e) => {
    const files = Array.from(e.target.files || []);
    try {
      for (const file of files) {
        const img = await uploadImage(file);
        setAdditional(prev => [...prev, img]);
      }
    } catch (err) { alert('Upload failed: ' + err.message); }
  };

  const removeAdditional = (idx) => {
    setAdditional(prev => prev.filter((_, i) => i !== idx));
  };

  const addSpec = () => setSpecs(prev => [...prev, ['', '']]);
  const updateSpec = (idx, col, val) => setSpecs(prev => prev.map((s, i) => i === idx ? (col === 0 ? [val, s[1]] : [s[0], val]) : s));
  const removeSpec = (idx) => setSpecs(prev => prev.filter((_, i) => i !== idx));

  const addVariety    = ()          => setForm(f => ({ ...f, varieties: [...f.varieties, ''] }));
  const updateVariety = (idx, val) => setForm(f => ({ ...f, varieties: f.varieties.map((v, i) => i === idx ? val : v) }));
  const removeVariety = (idx)      => setForm(f => ({ ...f, varieties: f.varieties.filter((_, i) => i !== idx) }));

  const addPackSize    = ()          => setForm(f => ({ ...f, availablePackagingSizes: [...f.availablePackagingSizes, ''] }));
  const updatePackSize = (idx, val) => setForm(f => ({ ...f, availablePackagingSizes: f.availablePackagingSizes.map((s, i) => i === idx ? val : s) }));
  const removePackSize = (idx)      => setForm(f => ({ ...f, availablePackagingSizes: f.availablePackagingSizes.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = 'Product name is required.';
    if (!form.category)        e.category = 'Please select a category.';
    if (!form.slug.trim())     e.slug     = 'Slug is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (asDraft = false) => {
    if (!validate()) return;
    setSaving(true); setSaveMsg('');

    const specsMap = Object.fromEntries(specs.filter(([k]) => k.trim()));

    const payload = {
      ...form,
      slug:     form.slug.trim(),
      status:   asDraft ? 'draft' : form.status,
      mainImage,
      additionalImages,
      specifications: specsMap,
      varieties:             form.varieties.filter(v => v.trim()),
      availablePackagingSizes: form.availablePackagingSizes.filter(s => s.trim()),
    };

    try {
      const url    = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products';
      const method = isEdit ? 'PATCH' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data   = await res.json();
      if (!data.success) throw new Error(data.error);
      setSaveMsg(isEdit ? 'Product updated!' : 'Product created!');
      setTimeout(() => router.push('/admin/products'), 1200);
    } catch (err) {
      setSaveMsg('Error: ' + err.message);
    } finally { setSaving(false); }
  };

  const inputCls = (field) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] ${errors[field] ? 'border-red-400' : 'border-slate-200'}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Success / error banner */}
      {saveMsg && (
        <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-semibold ${saveMsg.startsWith('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" /> {saveMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column (main fields) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic info */}
          <Card title="Basic Information">
            <Field label="Product Name *" error={errors.name}>
              <input className={inputCls('name')} value={form.name}
                onChange={e => set('name', e.target.value)} placeholder="e.g. High Curcumin Turmeric" />
            </Field>
            <Field label="URL Slug *" error={errors.slug}>
              <input className={inputCls('slug')} value={form.slug}
                onChange={e => set('slug', slugify(e.target.value))} placeholder="auto-generated-from-name" />
              <p className="text-xs text-slate-400 mt-1">Public URL: /products/[category]/{form.slug || '…'}</p>
            </Field>
            <Field label="Category *" error={errors.category}>
              <select className={inputCls('category')} value={form.category}
                onChange={e => set('category', e.target.value)}>
                <option value="">Select a category…</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Short Description (max 300 chars)">
              <textarea rows={2} className={inputCls('shortDescription')} value={form.shortDescription}
                onChange={e => set('shortDescription', e.target.value)}
                placeholder="Brief one-liner shown in product listings" />
            </Field>
            <Field label="Full Description">
              <textarea rows={5} className={inputCls('fullDescription')} value={form.fullDescription}
                onChange={e => set('fullDescription', e.target.value)}
                placeholder="Detailed product description, sourcing info, grades…" />
            </Field>
          </Card>

          {/* Specifications */}
          <Card title="Specifications">
            <p className="text-xs text-slate-500 mb-3">Add key-value pairs shown in the product spec table.</p>
            <div className="space-y-2">
              {specs.map(([k, v], idx) => (
                <div key={idx} className="flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    placeholder="Spec name (e.g. Curcumin Content)" value={k}
                    onChange={e => updateSpec(idx, 0, e.target.value)} />
                  <input className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    placeholder="Value (e.g. 3%–5.5%)" value={v}
                    onChange={e => updateSpec(idx, 1, e.target.value)} />
                  <button onClick={() => removeSpec(idx)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addSpec}
              className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#0F5132] hover:text-[#093822]">
              <Plus className="w-4 h-4" /> Add Specification
            </button>
          </Card>

          {/* Varieties */}
          <Card title="Key Export Varieties">
            <div className="space-y-2">
              {form.varieties.map((v, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    placeholder="e.g. Teja S17 Red Chili" value={v}
                    onChange={e => updateVariety(idx, e.target.value)} />
                  <button onClick={() => removeVariety(idx)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addVariety}
              className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#0F5132] hover:text-[#093822]">
              <Plus className="w-4 h-4" /> Add Variety
            </button>
          </Card>

          {/* Packaging */}
          <Card title="Packaging & Logistics">
            <Field label="Origin / Sourcing Region">
              <input className={inputCls('origin')} value={form.origin}
                onChange={e => set('origin', e.target.value)} placeholder="e.g. Nizamabad & Salem, India" />
            </Field>
            <Field label="Packaging Information">
              <input className={inputCls('packagingInfo')} value={form.packagingInfo}
                onChange={e => set('packagingInfo', e.target.value)} placeholder="e.g. 25kg / 50kg PP Bags or Vacuum Pack" />
            </Field>
            <Field label="Minimum Order Quantity">
              <input className={inputCls('minimumOrderQuantity')} value={form.minimumOrderQuantity}
                onChange={e => set('minimumOrderQuantity', e.target.value)} placeholder="e.g. 1 MT (1 x 20' FCL)" />
            </Field>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Available Packaging Sizes</label>
              <div className="space-y-2">
                {form.availablePackagingSizes.map((s, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                      value={s} placeholder="e.g. 25kg Jute Bag" onChange={e => updatePackSize(idx, e.target.value)} />
                    <button onClick={() => removePackSize(idx)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addPackSize}
                className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#0F5132] hover:text-[#093822]">
                <Plus className="w-4 h-4" /> Add Size
              </button>
            </div>
          </Card>

          {/* SEO */}
          <Card title="SEO">
            <Field label="SEO Title">
              <input className={inputCls('seo.title')} value={form.seo?.title || ''}
                onChange={e => set('seo', { ...form.seo, title: e.target.value })} placeholder="Override page title" />
            </Field>
            <Field label="SEO Description">
              <textarea rows={2} className={inputCls('seo.desc')} value={form.seo?.description || ''}
                onChange={e => set('seo', { ...form.seo, description: e.target.value })} placeholder="Meta description" />
            </Field>
          </Card>
        </div>

        {/* ── Right column (images + publish) ── */}
        <div className="space-y-6">

          {/* Publish settings */}
          <Card title="Publish Settings">
            <Field label="Status">
              <select className={inputCls('status')} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <div className="flex items-center gap-3 mt-2">
              <input type="checkbox" id="featured" checked={Boolean(form.isFeatured)}
                onChange={e => set('isFeatured', e.target.checked)}
                className="w-4 h-4 rounded accent-[#0F5132]" />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                Featured product
              </label>
            </div>
          </Card>

          {/* Main image */}
          <Card title="Main Image">
            {mainImage?.url ? (
              <div className="relative">
                <Image src={mainImage.url} alt="Main product" width={400} height={300}
                  className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-100" />
                <button onClick={() => setMainImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[4/3] border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#0F5132] hover:bg-slate-50 transition-colors">
                {uploading ? <Loader2 className="w-8 h-8 text-slate-400 animate-spin" /> : <Upload className="w-8 h-8 text-slate-300" />}
                <span className="text-xs text-slate-400 mt-2">{uploading ? 'Uploading…' : 'Click to upload (JPEG/PNG/WEBP)'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
              </label>
            )}
          </Card>

          {/* Additional images */}
          <Card title="Additional Images">
            <div className="grid grid-cols-2 gap-2">
              {additionalImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100">
                  <Image src={img.url} alt={img.alt || `Image ${idx + 1}`} fill className="object-cover" />
                  <button onClick={() => removeAdditional(idx)}
                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#0F5132] text-slate-300 hover:text-[#0F5132] transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                <span className="text-[10px] mt-1">Add</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleAdditionalImage} />
              </label>
            </div>
          </Card>

        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button onClick={() => router.push('/admin/products')}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
          Cancel
        </button>
        <div className="flex gap-3">
          <button onClick={() => handleSubmit(true)} disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
            Save as Draft
          </button>
          <button onClick={() => handleSubmit(false)} disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#0F5132] text-white text-sm font-semibold hover:bg-[#093822] disabled:opacity-50 flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
