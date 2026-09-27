'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { Apple, CheckCircle2, ArrowRight } from 'lucide-react';

const FRESH_ITEMS = [
  {
    name: 'Fresh Red & Yellow Onions',
    specs: 'Sizes 45mm+, 55mm+, 60mm+, Mesh Bag / Jute Bag Packing',
    desc: 'Export-grade Nashik red onions with thick skin and high pungency, packed in ventilated mesh bags for ocean transit.',
    packaging: '5kg, 10kg, 20kg, 25kg Mesh Bags'
  },
  {
    name: 'Fresh Table Potatoes (Jyoti & LR)',
    specs: 'Size 45mm-60mm, Free from Greenish/Sprouts, Firm Skin',
    desc: 'Cleaned and sorted table potatoes from Gujarat and Punjab belts, suitable for retail and processing.',
    packaging: '25kg / 50kg Mesh or Jute Bags'
  },
  {
    name: 'Fresh Table Grapes (Thompson Seedless)',
    specs: 'Berry Size 18mm+, Brix > 16°, SO2 Pad Treated',
    desc: 'Sweet seedless white table grapes from Nashik farms shipped under controlled reefer container atmospheres.',
    packaging: '4.5kg / 8kg Master Cartons with Punnets'
  },
  {
    name: 'Fresh Bhagwa Pomegranates',
    specs: 'Fruit Weight 250g - 400g+, Deep Red Arils, High Juice Content',
    desc: 'Glossy red Bhagwa pomegranates known for soft seeds and sweet taste, packaged in protective foam nets.',
    packaging: '3.5kg / 4kg Corrugated Boxes'
  }
];

export default function FreshProducePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Fresh Produce Export Portfolio"
        subtitle="Cold-Chain Packaged Fresh Onions, Table Potatoes, Nashik Grapes & Bhagwa Pomegranates."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Fresh Produce' }
        ]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Reefer Container Ready
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Farm-Fresh Indian Produce Harvested for Export
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              UM Global Exim maintains strict cold-chain management from farm harvest to port container loading. Our fresh produce is graded for size, skin quality, and shelf life to ensure zero spoilage during sea transit.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Cold Chain Preserved</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Phytosanitary Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Ventilated Export Bags</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Fast Port Clearance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/images/hero_produce.png"
              alt="Fresh Produce Export UM Global Exim"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Fresh Produce Varieties & Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FRESH_ITEMS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-[#0F5132]">{item.name}</h4>
                  <Apple className="w-5 h-5 text-[#C9A227]" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                  <div><strong className="text-slate-800">Specifications:</strong> {item.specs}</div>
                  <div><strong className="text-slate-800">Packaging:</strong> {item.packaging}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0F5132] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl font-bold">Request Fresh Produce Schedules & Reefer Container Rates</h3>
          <p className="text-emerald-100 text-xs">Direct export quotes for Middle East, Europe & Asian ports.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
