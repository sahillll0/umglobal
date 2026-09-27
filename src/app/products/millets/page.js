'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { Sprout, CheckCircle2, ArrowRight } from 'lucide-react';

const MILLET_ITEMS = [
  {
    name: 'Sorghum Grains (White & Yellow Jowar)',
    specs: 'Bold White Grains, Purity 99%, Moisture <11%',
    desc: 'Gluten-free white sorghum suitable for food milling, bakery applications, and health food manufacturing.',
    packaging: '25kg / 50kg PP Bags'
  },
  {
    name: 'Pearl Millet (Bajra)',
    specs: 'Machine Cleaned Greenish Grains, Free from Ergot',
    desc: 'Nutrient-packed pearl millet harvested from dryland farming regions, rich in iron, zinc, and dietary fiber.',
    packaging: '25kg / 50kg Heavy-Duty Bags'
  },
  {
    name: 'Finger Millet (Ragi)',
    specs: 'Reddish-Brown Grains, High Calcium Content',
    desc: 'Ancient super grain extensively used in baby food formulations and gluten-free flour mixes.',
    packaging: '25kg Poly Bags or Paper Sacks'
  },
  {
    name: 'Foxtail & Barnyard Millets',
    specs: 'Hulled / Dehusked Grains, 99.5% Machine Cleaned',
    desc: 'Small grain superfoods growing rapidly in popularity among global health-conscious consumers.',
    packaging: '10kg / 25kg Retail / Bulk Packing'
  }
];

export default function MilletsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Millets Export Portfolio"
        subtitle="Sustainably Harvested Gluten-Free Sorghum, Pearl Millet, Finger Millet & Super grains."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Millets' }
        ]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              100% Organic Superfoods
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Nutrient-Dense Indian Millets & Ancient Grains
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              India is the world&apos;s leading producer of millets. At UM Global Exim, we supply premium hulled and unhulled millets machine-cleaned to export standards for international food processors.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>100% Gluten-Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>High Dietary Fiber</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Non-GMO Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Custom Dehusking</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/images/hero_shipping.png"
              alt="Millets Export UM Global Exim"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Millets Portfolio & Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MILLET_ITEMS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-[#0F5132]">{item.name}</h4>
                  <Sprout className="w-5 h-5 text-[#C9A227]" />
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
          <h3 className="text-2xl font-bold">Inquire for Millet Container Shipments & Samples</h3>
          <p className="text-emerald-100 text-xs">Direct FOB/CIF export pricing available for wholesale buyers.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
