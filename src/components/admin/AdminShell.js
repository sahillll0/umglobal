'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * Shared wrapper used by every admin page.
 * Usage:
 *   <AdminShell title="Page Title" subtitle="Optional sub-text">
 *     ...page content...
 *   </AdminShell>
 */
export default function AdminShell({ children, title, subtitle, actions }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6 lg:p-8">
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              {title && (
                <div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">{title}</h1>
                  {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
                </div>
              )}
              {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
