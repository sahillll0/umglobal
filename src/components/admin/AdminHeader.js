'use client';

import { Menu, Bell, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminHeader({ onMenuClick }) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-slate-900">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100">
          <User className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">
            {session?.user?.email}
          </span>
        </div>
      </div>
    </header>
  );
}
