'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { Wheat, CheckCircle2, ArrowRight } from 'lucide-react';

const PULSE_ITEMS = [
  {
    name: 'Kabuli Chickpeas (Garbanzo Beans)',
    specs: 'Counts 40-42, 42-44, 58-60 to 75-80, Moisture <10%, Sortex 99.9%',
    desc: 'Large creamy white chickpeas processed and machine sorted for international hummus factories and retail canning.',
    packaging: '25kg / 50kg PP Bags or Jumbo Bags'
  },
  {
    name: 'Red Split Lentils (Masoor Dal)',
    specs: 'Football / Split 0.5-1% Foreign Matter, Purity 99.5%, Bright Red',
    desc: 'High-protein red split lentils processed with zero artificial polished colors.',
    packaging: '25kg / 50kg Brand Printed PP Bags'
  },
  {
    name: 'Moong Dal (Whole & Split)',
    specs: 'Green Moong Whole 3.5mm-4mm, Yellow Split Moong Sortex Cleaned',
    desc: 'Nutritious green mung beans and polished/unpolished yellow moong dal for wholesale distribution.',
    packaging: '25kg / 50kg Heavy-Duty Bags'
  },
  {
    name: 'Desi Chickpeas & Toor Dal',
    specs: 'Brown Desi Chickpeas 7mm+, Arhar / Toor Dal Machine Cleaned',
    desc: 'Sustainably grown Indian legumes sorted to guarantee zero weeviled or split grains.',
    packaging: '25kg Moisture Barrier Bags'
  }
];

export default function PulsesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Pulses Export Portfolio"
        subtitle="Sortex Cleaned Kabuli Chickpeas, Red Split Lentils, Mung Beans & Toor Dal."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Pulses' }
        ]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Laser Sortex Cleaned
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              High-Protein Sortex Cleaned Indian Pulses
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              UM Global Exim supplies premium quality Indian pulses. We utilize multi-stage gravity separators and optical color sorters to ensure exact count size, uniform color, and zero foreign seed contamination.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>99.9% Sortex Purity</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Zero Weeviled Seeds</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>FUMIGATION Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Custom Bag Branding</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/images/hero_turmeric.png"
              alt="Pulses Export UM Global Exim"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Pulses Specifications & Counts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PULSE_ITEMS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-[#0F5132]">{item.name}</h4>
                  <Wheat className="w-5 h-5 text-[#C9A227]" />
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
          <h3 className="text-2xl font-bold">Request Pulses FOB/CIF Quotes & Grain Specs</h3>
          <p className="text-emerald-100 text-xs">Direct container shipping from Indian ports.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
