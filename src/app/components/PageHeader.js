'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';

export default function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-[#0F5132] to-[#093822] text-white overflow-hidden">
      {/* Ambient Decorative Background Gradients & Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Breadcrumb Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center space-x-2 text-xs font-semibold text-emerald-200/90 tracking-wide"
          aria-label="Breadcrumb Navigation"
        >
          <Link href="/" className="flex items-center space-x-1 hover:text-[#C9A227] transition-colors">
            <HomeIcon className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Home</span>
          </Link>

          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
              {item.href ? (
                <Link href={item.href} className="hover:text-[#C9A227] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#C9A227] font-bold">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </motion.nav>

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
        >
          {title}
        </motion.h1>

        {/* Professional Subtitle / Description */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-emerald-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {subtitle}
          </motion.p>
        )}

      </div>
    </section>
  );
}
