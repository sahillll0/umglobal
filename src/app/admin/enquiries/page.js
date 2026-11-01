'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Search, Filter, Download, Eye, X, ChevronDown,
  Mail, Phone, Building2, Package, MessageSquare,
  AlertCircle, RefreshCw, Send, Clock, Globe, Hash,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'new',         label: 'New',         color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'contacted',   label: 'Contacted',   color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'quoted',      label: 'Quoted',      color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'converted',   label: 'Converted',   color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'closed',      label: 'Closed',      color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'spam',        label: 'Spam',        color: 'bg-red-100 text-red-700 border-red-200' },
];

const DATE_SHORTCUTS = [
  { label: 'Today',      days: 0 },
  { label: 'Yesterday',  days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
];

function statusMeta(value) {
  return STATUS_OPTIONS.find(s => s.value === value) || STATUS_OPTIONS[0];
}

function StatusBadge({ status }) {
  const meta = statusMeta(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.color}`}>
      {meta.label}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function EnquiriesPage() {
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [enquiries, setEnquiries]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [selectedEnquiry, setSelected]    = useState(null);
  const [showFilters, setShowFilters]     = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalCount, setTotalCount]       = useState(0);
  const [exporting, setExporting]         = useState(false);

  // Debounced search — we keep a raw value in state and debounce before querying
  const [searchRaw, setSearchRaw]  = useState('');
  const [search, setSearch]        = useState('');
  const debounceTimer              = useRef(null);

  const [filters, setFilters] = useState({
    status: '', product: '', country: '', dateFrom: '', dateTo: '',
  });

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setSearch(searchRaw), 400);
    return () => clearTimeout(debounceTimer.current);
  }, [searchRaw]);

  // Fetch whenever page, search or filters change
  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, filters]);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page',  String(currentPage));
      params.set('limit', '20');
      if (search)          params.set('search',   search);
      if (filters.status)  params.set('status',   filters.status);
      if (filters.product) params.set('product',  filters.product);
      if (filters.country) params.set('country',  filters.country);
      if (filters.dateFrom)params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo)  params.set('dateTo',   filters.dateTo);

      const res  = await fetch(`/api/admin/enquiries?${params}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setEnquiries(data.enquiries);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (err) {
      console.error('[EnquiriesPage] fetch error:', err);
      setError(err.message || 'Failed to load enquiries. Please try again.');
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filters]);

  // ── Quick date shortcuts ───────────────────────────────────────────────────
  const applyDateShortcut = (days) => {
    const today = new Date();
    const to    = today.toISOString().split('T')[0];

    if (days === 0) {
      setFilters(f => ({ ...f, dateFrom: to, dateTo: to }));
    } else if (days === 1) {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      const y = yest.toISOString().split('T')[0];
      setFilters(f => ({ ...f, dateFrom: y, dateTo: y }));
    } else {
      const from = new Date(today);
      from.setDate(from.getDate() - days);
      setFilters(f => ({ ...f, dateFrom: from.toISOString().split('T')[0], dateTo: to }));
    }
    setCurrentPage(1);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearchRaw('');
    setSearch('');
    setFilters({ status: '', product: '', country: '', dateFrom: '', dateTo: '' });
    setCurrentPage(1);
  };

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchRaw || Object.values(filters).some(v => v);

  // ── Status change (inline in table) ──────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Optimistically update both the list and the open modal
      setEnquiries(prev =>
        prev.map(e => e._id === id ? { ...e, status: newStatus } : e)
      );
      setSelected(prev => prev?._id === id ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      alert('Could not update status: ' + err.message);
    }
  };

  // ── CSV export ────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search)          params.set('search',   search);
      if (filters.status)  params.set('status',   filters.status);
      if (filters.product) params.set('product',  filters.product);
      if (filters.country) params.set('country',  filters.country);
      if (filters.dateFrom)params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo)  params.set('dateTo',   filters.dateTo);

      const res  = await fetch(`/api/admin/enquiries/export?${params}`);
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `enquiries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6 lg:p-8 space-y-6">

          {/* ── Page header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Customer Enquiries</h1>
              <p className="text-slate-500 text-sm mt-1">
                All enquiries submitted via the website contact and quote forms
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchEnquiries}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F5132] text-white font-semibold hover:bg-[#093822] transition-colors text-sm disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Exporting…' : 'Export CSV'}
              </button>
            </div>
          </div>

          {/* ── Search + filters bar ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, company, phone or ID…"
                  value={searchRaw}
                  onChange={e => { setSearchRaw(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              {/* Quick status pills */}
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.slice(0, 3).map(s => (
                  <button
                    key={s.value}
                    onClick={() => updateFilter('status', filters.status === s.value ? '' : s.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      filters.status === s.value
                        ? s.color + ' ring-2 ring-offset-1 ring-current'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                  More filters
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => updateFilter('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Product</label>
                  <input
                    type="text"
                    placeholder="e.g. Spices"
                    value={filters.product}
                    onChange={e => updateFilter('product', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => updateFilter('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={e => updateFilter('dateTo', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                {/* Date shortcuts */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Quick date ranges</p>
                  <div className="flex flex-wrap gap-2">
                    {DATE_SHORTCUTS.map(s => (
                      <button
                        key={s.label}
                        onClick={() => applyDateShortcut(s.days)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium hover:bg-[#0F5132] hover:text-white hover:border-[#0F5132] transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Active filter summary + clear */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">Filters active:</span>
                {searchRaw && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    &ldquo;{searchRaw}&rdquo;
                  </span>
                )}
                {filters.status && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusMeta(filters.status).color}`}>
                    {statusMeta(filters.status).label}
                  </span>
                )}
                {filters.product && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    {filters.product}
                  </span>
                )}
                {(filters.dateFrom || filters.dateTo) && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    {filters.dateFrom || '…'} → {filters.dateTo || '…'}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs font-semibold text-[#0F5132] hover:text-[#093822]"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* ── Results count ── */}
          <p className="text-sm text-slate-500">
            {loading
              ? 'Loading…'
              : `${totalCount} enquir${totalCount === 1 ? 'y' : 'ies'} found`}
          </p>

          {/* ── Error banner ── */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Could not load enquiries</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
              <button onClick={fetchEnquiries} className="ml-auto text-xs font-semibold underline">Retry</button>
            </div>
          )}

          {/* ── Table ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-4 border-[#0F5132] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Loading enquiries…</p>
              </div>
            ) : enquiries.length === 0 && !error ? (
              <div className="p-16 flex flex-col items-center gap-3 text-center">
                <MessageSquare className="w-12 h-12 text-slate-200" />
                <p className="font-semibold text-slate-700">No enquiries found</p>
                <p className="text-sm text-slate-400">
                  {hasActiveFilters
                    ? 'Try clearing your filters'
                    : 'Enquiries submitted via the contact form will appear here'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-sm font-semibold text-[#0F5132] underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {['Enquiry ID','Customer','Product','Status','Received','Actions'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {enquiries.map(enq => (
                        <tr key={enq._id} className="hover:bg-slate-50 transition-colors">
                          {/* ID */}
                          <td className="px-5 py-4">
                            <span className="font-mono font-semibold text-[#0F5132] text-xs">
                              {enq.enquiryId}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">{enq.name}</p>
                            <p className="text-slate-400 text-xs">{enq.email}</p>
                            {enq.company && (
                              <p className="text-slate-400 text-xs">{enq.company}</p>
                            )}
                          </td>

                          {/* Product */}
                          <td className="px-5 py-4 text-slate-600">
                            {enq.product || <span className="text-slate-300">—</span>}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <select
                              value={enq.status}
                              onChange={e => handleStatusChange(enq._id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer ${statusMeta(enq.status).color}`}
                            >
                              {STATUS_OPTIONS.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          </td>

                          {/* Received */}
                          <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                            {formatDistanceToNow(new Date(enq.createdAt), { addSuffix: true })}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setSelected(enq)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F5132] text-white text-xs font-semibold hover:bg-[#093822] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-slate-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* ── Detail modal ── */}
      {selectedEnquiry && (
        <EnquiryModal
          enquiry={selectedEnquiry}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onNoteAdded={(id, updatedEnquiry) => {
            setSelected(updatedEnquiry);
            setEnquiries(prev => prev.map(e => e._id === id ? updatedEnquiry : e));
          }}
        />
      )}
    </div>
  );
}

// ── Enquiry detail modal ──────────────────────────────────────────────────────
function EnquiryModal({ enquiry, onClose, onStatusChange, onNoteAdded }) {
  const [noteText, setNoteText]   = useState('');
  const [savingNote, setSaving]   = useState(false);
  const [noteError, setNoteError] = useState('');

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    setNoteError('');
    try {
      const res  = await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ note: noteText }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onNoteAdded(enquiry._id, data.enquiry);
      setNoteText('');
    } catch (err) {
      setNoteError(err.message || 'Failed to save note.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Enquiry Details</h2>
            <p className="text-xs font-mono text-[#0F5132] mt-0.5">{enquiry.enquiryId}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={enquiry.status} />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Customer */}
          <Section title="Customer">
            <Grid>
              <Field icon={<MessageSquare className="w-4 h-4" />} label="Name"    value={enquiry.name} />
              <Field icon={<Building2     className="w-4 h-4" />} label="Company" value={enquiry.company} />
              <Field
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={
                  <a href={`mailto:${enquiry.email}`} className="text-[#0F5132] hover:underline font-medium">
                    {enquiry.email}
                  </a>
                }
              />
              {enquiry.phone && (
                <Field
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone / WhatsApp"
                  value={
                    <div className="flex items-center gap-2">
                      <a href={`tel:${enquiry.phone}`} className="text-[#0F5132] hover:underline font-medium">
                        {enquiry.phone}
                      </a>
                      <a
                        href={`https://wa.me/${enquiry.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold"
                      >
                        WhatsApp
                      </a>
                    </div>
                  }
                />
              )}
            </Grid>
          </Section>

          {/* Enquiry */}
          <Section title="Enquiry">
            <Grid>
              {enquiry.product  && <Field icon={<Package className="w-4 h-4" />} label="Product of interest" value={enquiry.product} />}
              {enquiry.quantity && <Field icon={<Hash    className="w-4 h-4" />} label="Quantity"            value={enquiry.quantity} />}
              {enquiry.port     && <Field icon={<Globe   className="w-4 h-4" />} label="Destination port"    value={enquiry.port} />}
            </Grid>
            {enquiry.message && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Message</p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {enquiry.message}
                </div>
              </div>
            )}
          </Section>

          {/* Change status */}
          <Section title="Change status">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  onClick={() => onStatusChange(enquiry._id, s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    enquiry.status === s.value
                      ? s.color + ' ring-2 ring-offset-1 ring-current'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Internal notes */}
          <Section title="Internal notes">
            {enquiry.notes?.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {enquiry.notes.map((n, i) => (
                  <li key={i} className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-slate-800">
                    <p>{n.content}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {n.addedAt ? format(new Date(n.addedAt), 'dd MMM yyyy, h:mm a') : ''}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 mb-3">No notes yet.</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                placeholder="Add an internal note…"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              />
              <button
                onClick={handleAddNote}
                disabled={savingNote || !noteText.trim()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F5132] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#093822] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {savingNote ? 'Saving…' : 'Add'}
              </button>
            </div>
            {noteError && <p className="text-xs text-red-600 mt-1">{noteError}</p>}
          </Section>

          {/* Meta */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Received: {format(new Date(enquiry.createdAt), 'dd MMM yyyy, h:mm a')}
            </span>
            <span>Form type: {enquiry.formType}</span>
            {enquiry.sourcePage && <span>Source: {enquiry.sourcePage}</span>}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 p-4 flex items-center gap-3 shrink-0 bg-slate-50 rounded-b-2xl">
          <a
            href={`mailto:${enquiry.email}?subject=RE: Your Enquiry – UM Global Exim`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F5132] text-white text-sm font-semibold hover:bg-[#093822] transition-colors"
          >
            <Mail className="w-4 h-4" />
            Reply via Email
          </a>
          {enquiry.phone && (
            <a
              href={`https://wa.me/${enquiry.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(enquiry.name)}%2C%20this%20is%20UM%20Global%20Exim%20regarding%20your%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          )}
          <button onClick={onClose} className="ml-auto px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Small layout helpers ──────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Field({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-[#0F5132] mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <div className="text-sm font-medium text-slate-800 mt-0.5">{value}</div>
      </div>
    </div>
  );
}
