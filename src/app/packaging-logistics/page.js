'use client';

import React from 'react';
import PageHeader from '../components/PageHeader';
import Link from 'next/link';
import { 
  Truck, 
  PackageCheck, 
  Globe2, 
  Box, 
  CheckCircle2, 
  ArrowRight,
  Anchor,
  ShieldAlert
} from 'lucide-react';

const PACKAGING_TYPES = [
  {
    title: 'Multi-Wall Polypropylene (PP) Bags',
    specs: 'Available in 10kg, 25kg & 50kg capacities with inner poly liners for moisture defense.',
    ideal: 'Pulses, Chickpeas, Whole Spices, Sorghum & Millets'
  },
  {
    title: 'Moisture Barrier Vacuum Packaging',
    specs: 'High-barrier foil and nitrogen flushed vacuum pouches preserving aroma & freshness.',
    ideal: 'Turmeric Powder, Chili Flakes, Green Cardamom & Dehydrated Garlic'
  },
  {
    title: 'Traditional Jute & Hessian Bags',
    specs: 'Food-grade breathable jute bags ideal for natural temperature regulation during long sea transit.',
    ideal: 'Red Chili Pods, Sesame Seeds & Raw Agricultural Commodities'
  },
  {
    title: 'Corrugated Master Cartons & Punnets',
    specs: 'Heavy-duty 5-ply / 7-ply export cartons with inner foam mesh nets and punnets.',
    ideal: 'Dehydrated Onion Flakes, Fresh Grapes & Pomegranates'
  }
];

export default function PackagingLogisticsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Packaging & Global Logistics"
        subtitle="Export Standard Packaging Solutions, Private Labeling & Seamless Maritime Logistics."
        breadcrumbs={[{ label: 'Packaging & Logistics' }]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            FOB • CIF • CFR Terms
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Customized B2B Packaging & Export Shipping
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Proper packaging and temperature-controlled logistics are critical to preserving product freshness from Indian farmlands to international destination ports. We offer customized buyer branding, private labeling, and flexible container loading.
          </p>
        </div>

        {/* Packaging Types Grid */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Export Packaging Solutions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PACKAGING_TYPES.map((pkg, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2">
                  <PackageCheck className="w-5 h-5 text-[#0F5132]" />
                  <h4 className="text-lg font-bold text-slate-900">{pkg.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{pkg.specs}</p>
                <div className="p-3 rounded-xl bg-emerald-50 text-xs font-semibold text-[#0F5132]">
                  <strong>Recommended For:</strong> {pkg.ideal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Logistics Highlights */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Strategic Indian Port Access
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              We ship via major Indian maritime gateways ensuring direct shipping lines and minimum transit times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Anchor className="w-8 h-8 text-[#C9A227] mx-auto" />
              <h4 className="text-base font-bold">Mundra Port (Gujarat)</h4>
              <p className="text-xs text-slate-300">Fastest transit for Middle East, Europe & Africa for Spices, Dehydrated Products & Pulses.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Anchor className="w-8 h-8 text-[#C9A227] mx-auto" />
              <h4 className="text-base font-bold">JNPT / Nhava Sheva (Mumbai)</h4>
              <p className="text-xs text-slate-300">Premier container port with regular sailings for fresh produce, cold-chain reefer containers.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Anchor className="w-8 h-8 text-[#C9A227] mx-auto" />
              <h4 className="text-base font-bold">Chennai / Tuticorin Port</h4>
              <p className="text-xs text-slate-300">Strategic departure gateway for Far East Asia, Singapore, Malaysia & Gulf markets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F5132] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl font-bold">Inquire for Private Labeling & Port Destination CIF Rates</h3>
          <p className="text-emerald-100 text-xs">Customized bag printing with your brand logo and barcode.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Contact Logistics Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
