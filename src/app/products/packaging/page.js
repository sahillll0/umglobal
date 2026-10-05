'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { PackageCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const PACKAGING_ITEMS = [
  {
    name: 'Retail Packaging',
    specs: 'Custom weights from 500g to 5kg',
    desc: 'Consumer-ready packaging customized with your brand language and labeling requirements.',
    packaging: 'Pouches, Jars, and Cartons'
  },
  {
    name: 'Bulk Packaging',
    specs: 'Standard 10kg, 25kg, 50kg, and Jumbo Bags',
    desc: 'Durable, export-grade bulk packaging for wholesale, distribution, and manufacturing needs.',
    packaging: 'PP Bags, Jute Bags, Mesh Bags, Paper Sacks'
  },
  {
    name: 'Private Label Packaging',
    specs: 'Full-service OEM/White-labeling',
    desc: 'Comprehensive private label solutions ensuring your brand identity is professionally presented.',
    packaging: 'Custom Printed Materials'
  },
  {
    name: 'Freight & Logistics Solutions',
    specs: 'Air Freight & Sea Freight',
    desc: 'End-to-end logistics support including Full Container Loads (FCL) and Less than Container Loads (LCL).',
    packaging: 'Palletized and Non-palletized Shipments'
  }
];

export default function PackagingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Packaging & Logistics"
        subtitle="Custom Retail, Bulk, and Private Label Packaging Solutions for Worldwide Export."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Packaging & Logistics' }
        ]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Export Grade Packaging
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Reliable Packaging & Global Supply Chain
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              At UM Global Exim, we understand that secure packaging is critical for agricultural products. We offer customized packaging solutions according to buyer requirements, ensuring freshness, safety, and compliance across global markets.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Container Load Shipments</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Air Freight Solutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Sea Freight Solutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Private Label Support</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
            <Image
              src="/images/umglobal_packaging.jpg"
              alt="Packaging & Logistics UM Global Exim"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Our Packaging & Logistics Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PACKAGING_ITEMS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-[#0F5132]">{item.name}</h4>
                  <PackageCheck className="w-5 h-5 text-[#C9A227]" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                  <div><strong className="text-slate-800">Options:</strong> {item.specs}</div>
                  <div><strong className="text-slate-800">Formats:</strong> {item.packaging}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0F5132] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl font-bold">Request a Custom Packaging Quote</h3>
          <p className="text-emerald-100 text-xs">Share your branding and logistics requirements with our export team.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
