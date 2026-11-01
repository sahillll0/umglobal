'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { BarChart3, TrendingUp, Globe, Package, RefreshCw, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  new:'#3b82f6', contacted:'#f59e0b', in_progress:'#8b5cf6',
  quoted:'#6366f1', converted:'#22c55e', closed:'#94a3b8', spam:'#ef4444',
};

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-xs text-slate-600 truncate shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color || '#0F5132' }} />
      </div>
      <span className="w-8 text-xs font-bold text-slate-700 text-right">{value}</span>
    </div>
  );
}

export default function ReportsPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays]     = useState(30);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?days=${days}`);
      const d   = await res.json();
      if (d.success) setData(d);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [days]); // eslint-disable-line

  const maxStatus  = data?.byStatus?.reduce((m, x) => Math.max(m, x.count), 0) || 1;
  const maxProduct = data?.byProduct?.reduce((m, x) => Math.max(m, x.count), 0) || 1;
  const maxCountry = data?.byCountry?.reduce((m, x) => Math.max(m, x.count), 0) || 1;
  const maxDaily   = data?.daily?.reduce((m, x) => Math.max(m, x.count), 0) || 1;
  const totalPeriod = data?.daily?.reduce((s, x) => s + x.count, 0) || 0;

  const actions = (
    <div className="flex items-center gap-3">
      <select value={days} onChange={e => setDays(Number(e.target.value))}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]">
        {[7,14,30,60,90,180,365].map(d => <option key={d} value={d}>Last {d} days</option>)}
      </select>
      <button onClick={load} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50">
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );

  return (
    <AdminShell title="Reports & Analytics" subtitle="Real data from your MongoDB database" actions={actions}>
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#0F5132]" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary card */}
          <div className="bg-gradient-to-r from-[#0F5132] to-[#093822] rounded-2xl p-6 text-white">
            <p className="text-sm font-medium text-emerald-200 mb-1">Enquiries in last {days} days</p>
            <p className="text-5xl font-extrabold">{totalPeriod}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Daily chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-[#0F5132]" />
                <h3 className="font-bold text-slate-900">Daily Enquiries ({days}d)</h3>
              </div>
              {data?.daily?.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No enquiries in this period</p>
              ) : (
                <div className="space-y-2">
                  {(data?.daily || []).slice(-14).map(d => (
                    <Bar key={d._id} label={d._id} value={d.count} max={maxDaily} />
                  ))}
                  {(data?.daily?.length || 0) > 14 && (
                    <p className="text-xs text-slate-400 text-center">Showing last 14 days of {data.daily.length}</p>
                  )}
                </div>
              )}
            </div>

            {/* By status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5 text-[#0F5132]" />
                <h3 className="font-bold text-slate-900">Enquiries by Status</h3>
              </div>
              {data?.byStatus?.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No data</p>
              ) : (
                <div className="space-y-2">
                  {(data?.byStatus || []).map(s => (
                    <Bar key={s._id} label={s._id.replace('_', ' ')} value={s.count} max={maxStatus}
                      color={STATUS_COLORS[s._id] || '#0F5132'} />
                  ))}
                </div>
              )}
            </div>

            {/* By product */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-5 h-5 text-[#0F5132]" />
                <h3 className="font-bold text-slate-900">Top Products (All Time)</h3>
              </div>
              {data?.byProduct?.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No product data yet</p>
              ) : (
                <div className="space-y-2">
                  {(data?.byProduct || []).map(p => (
                    <Bar key={p._id} label={p._id} value={p.count} max={maxProduct} />
                  ))}
                </div>
              )}
            </div>

            {/* By country */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Globe className="w-5 h-5 text-[#0F5132]" />
                <h3 className="font-bold text-slate-900">Top Countries (All Time)</h3>
              </div>
              {data?.byCountry?.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No country data yet</p>
              ) : (
                <div className="space-y-2">
                  {(data?.byCountry || []).map(c => (
                    <Bar key={c._id} label={c._id} value={c.count} max={maxCountry} color="#C9A227" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
