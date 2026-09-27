'use client';

import React from 'react';
import Logo from './components/Logo';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white space-y-4">
      <div className="animate-pulse">
        <Logo variant="original" size="lg" />
      </div>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
        Loading Premium Agro Data...
      </span>
    </div>
  );
}
