'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Globe2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Award,
  Truck,
  FileText
} from 'lucide-react';

// Animated Counter Component for Statistics
function AnimatedCounter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    const numericEnd = parseInt(end, 10) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * numericEnd));

      if (progress < 1) {
        countRef.current = window.requestAnimationFrame(step);
      }
    };

    countRef.current = window.requestAnimationFrame(step);
    return () => {
      if (countRef.current) window.cancelAnimationFrame(countRef.current);
    };
  }, [end, duration]);

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// Statistics Data
const STATS = [
  { value: 100, suffix: '+', label: 'Products Portfolio' },
  { value: 20, suffix: '+', label: 'Countries Served' },
  { value: 100, suffix: '%', label: 'Quality Checked' },
  { value: 24, suffix: '/7', label: 'Export Support' }
];

export default function Hero({ onOpenQuoteModal }) {
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0.5]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-[#F8F9FA] via-white to-[#F8F9FA] pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden"
    >
      {/* Soft Background Grid Pattern & Ambient Glow */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0F5132_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Main 2-Column Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Essential Copywriting & Actions */}
          <motion.div 
            style={{ opacity: opacityFade }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-50 text-[#0F5132] text-xs font-bold tracking-wide uppercase border border-emerald-200/80 shadow-xs"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#0F5132] animate-ping" />
              <span>🌍</span>
              <span>Exporting Premium Agricultural Products Worldwide</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              Premium Agricultural Products Exporter From{' '}
              <span className="text-[#0F5132] relative inline-block">
                India
                <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-[#C9A227]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>{' '}
              to the{' '}
              <span className="text-[#C9A227] italic font-serif">
                World
              </span>
            </motion.h1>

            {/* Clear, Professional Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl"
            >
              UM Global Exim supplies premium Spices, Dehydrated Vegetables, Pulses, Millets, and Fresh Produce to international importers, wholesalers, and food processors with guaranteed quality and on-time shipment.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              {/* Primary Quote CTA Button */}
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="group inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-[#0F5132] text-white font-extrabold text-base shadow-lg hover:bg-[#C9A227] hover:text-[#093822] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-5 h-5 text-[#C9A227] group-hover:text-[#093822] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Secondary Explore Button */}
              <Link
                href="/products"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-base shadow-xs hover:bg-slate-50 hover:border-[#0F5132] hover:text-[#0F5132] transition-all duration-300"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Clean Trust Signals Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200/80 text-xs font-semibold text-slate-700"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>APEDA & ISO Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>100% Quality Tested</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>FOB / CIF Logistics</span>
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT COLUMN: Ultra-Sleek Single Hero Showcase Artwork */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/4.5] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              
              {/* Featured High Quality Agro Image */}
              <Image
                src="/images/hero_turmeric.png"
                alt="UM Global Exim Premium Indian Spices & Agricultural Export"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Top Glassmorphism Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/95 text-[#0F5132] text-xs font-bold shadow-md backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Indian Export Quality</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#0F5132] text-white text-[10px] font-bold">
                  Origin: India
                </span>
              </div>

              {/* Bottom Card Information */}
              <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0F5132] uppercase tracking-wider">
                    Government Recognized
                  </span>
                  <Award className="w-4 h-4 text-[#C9A227]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  Spices • Dehydrated • Pulses • Millets • Produce
                </h3>
                <p className="text-xs text-slate-500 flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                  <span>Worldwide Maritime Port Shipping</span>
                </p>
              </div>

            </div>
          </motion.div>

        </div>

        {/* BOTTOM SECTION: Clean Statistics Bar across full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80"
        >
          {STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all text-center space-y-1"
            >
              <div className="text-3xl font-extrabold text-[#0F5132]">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs font-bold text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
