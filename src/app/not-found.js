'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ArrowRight, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="max-w-lg w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#0F5132] flex items-center justify-center mx-auto shadow-sm">
          <Globe className="w-8 h-8 text-[#C9A227]" />
        </div>

        <span className="text-xs font-extrabold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The requested export product or page could not be located. Please check the URL or return to our homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#0F5132] text-white font-bold text-xs shadow-md hover:bg-[#093822] transition-colors"
          >
            <Home className="w-4 h-4 text-[#C9A227]" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
