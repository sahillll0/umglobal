'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';
import { Upload, Copy, CheckCircle2, Loader2, ImageIcon, X } from 'lucide-react';

export default function MediaPage() {
  const [files, setFiles]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied]     = useState('');
  const [preview, setPreview]   = useState(null);
  const inputRef                = useRef(null);

  const handleUpload = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setUploading(true);
    try {
      for (const file of selected) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'umglobal-media');
        const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) {
          setFiles(prev => [{ url: data.url, publicId: data.publicId, name: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString() }, ...prev]);
        }
      }
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1024/1024).toFixed(1)} MB`;
  };

  const addBtn = (
    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F5132] text-white font-semibold hover:bg-[#093822] cursor-pointer text-sm">
      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
      {uploading ? 'Uploading…' : 'Upload Images'}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
    </label>
  );

  return (
    <AdminShell title="Media Library" subtitle="Upload and manage website images" actions={addBtn}>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <ImageIcon className="w-16 h-16 text-slate-200 mb-4" />
          <p className="font-semibold text-slate-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-slate-400 mb-6">Images you upload during this session will appear here</p>
          <label className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F5132] text-white font-semibold cursor-pointer hover:bg-[#093822] text-sm">
            <Upload className="w-4 h-4" /> Upload First Image
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          </label>
          <p className="text-xs text-slate-400 mt-4">Note: For persistent media management, images uploaded via Products or Categories are stored in Cloudinary.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
              <button onClick={() => setPreview(file)} className="w-full block">
                <div className="relative aspect-square">
                  <Image src={file.url} alt={file.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              </button>
              <div className="p-3">
                <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatSize(file.size)}</p>
                <button onClick={() => copyUrl(file.url)}
                  className={`mt-2 w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    copied === file.url ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-[#0F5132] hover:text-white'
                  }`}>
                  {copied === file.url ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === file.url ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <Image src={preview.url} alt={preview.name} width={800} height={600}
              className="w-full h-auto rounded-2xl shadow-2xl" />
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => copyUrl(preview.url)}
                className="p-2 bg-white/90 rounded-xl shadow text-slate-700 hover:bg-white">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={() => setPreview(null)}
                className="p-2 bg-white/90 rounded-xl shadow text-slate-700 hover:bg-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs">
              {preview.name} {preview.size ? `· ${formatSize(preview.size)}` : ''}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}
