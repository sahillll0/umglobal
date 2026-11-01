'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminShell from '@/components/admin/AdminShell';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow]   = useState({ curr: false, new: false, conf: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]     = useState('');
  const [isError, setIsError] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setIsError(false);

    if (form.newPassword !== form.confirmPassword) {
      setMsg('New passwords do not match.'); setIsError(true); return;
    }
    if (form.newPassword.length < 8) {
      setMsg('New password must be at least 8 characters.'); setIsError(true); return;
    }

    setSaving(true);
    try {
      const res  = await fetch('/api/admin/settings/password', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!data.success) { setMsg(data.error); setIsError(true); }
      else { setMsg('Password updated successfully!'); setForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    } catch (err) { setMsg('Network error.'); setIsError(true); }
    finally { setSaving(false); }
  };

  const PwField = ({ label, field, showKey }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type={show[showKey] ? 'text' : 'password'}
          value={form[field]}
          onChange={e => set(field, e.target.value)}
          required
          className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
        />
        <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <AdminShell title="Settings" subtitle="Manage your admin account">
      <div className="max-w-lg space-y-6">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Account Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Name</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{session?.user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{session?.user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Role</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5 capitalize">{session?.user?.role?.replace('_', ' ') || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Change Password</h3>

          {msg && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold mb-4 ${isError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
              {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <PwField label="Current Password"  field="currentPassword" showKey="curr" />
            <PwField label="New Password"       field="newPassword"     showKey="new"  />
            <PwField label="Confirm New Password" field="confirmPassword" showKey="conf" />
            <button type="submit" disabled={saving}
              className="w-full py-2.5 rounded-xl bg-[#0F5132] text-white font-semibold text-sm hover:bg-[#093822] disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
