'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { 
  Sun, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

const DEHYDRATED_ITEMS = [
  {
    name: 'Dehydrated White & Red Onion Flakes',
    specs: 'Flake Size 8-15mm, Low Moisture (<6%), Free from SO2',
    desc: 'Crisp dehydrated onion flakes manufactured from select Indian onions. Excellent rehydration ratio and natural pungency.',
    packaging: '14kg to 20kg Poly-lined Cartons or Paper Bags'
  },
  {
    name: 'Dehydrated Garlic Powder & Granules',
    specs: 'Mesh Size 40-80 (Powder), 8-16 / 16-26 (Granules), 100% Pure',
    desc: 'Dehydrated garlic produced from premium garlic cloves. Free from artificial preservatives, retaining natural allicin.',
    packaging: '20kg Cartons with Inner Poly Bag'
  },
  {
    name: 'Dehydrated Tomato Powder',
    specs: 'Hot Break / Cold Break, Fine 60 Mesh, Zero Added Sugar',
    desc: 'Rich red tomato powder widely used in soup mixes, seasonings, and processed food formulations.',
    packaging: '25kg Aluminum Foil Lined Drums/Cartons'
  },
  {
    name: 'Toasted Onion Powder',
    specs: 'Golden Brown Hue, Roasted Aroma, Low Moisture (<5%)',
    desc: 'Gently roasted dehydrated onion powder adding rich umami flavor to snacks, gravies, and spice rubs.',
    packaging: '20kg Sealed Moisture-Proof Cartons'
  }
];

export default function DehydratedProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Dehydrated Products Export Portfolio"
        subtitle="Export-Grade Dehydrated White & Red Onion Flakes, Garlic Powders, Granules & Tomato Powders."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Dehydrated Products' }
        ]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Low Moisture & Long Shelf-Life
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              High-Grade Dehydrated Vegetables & Powders
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              UM Global Exim processes dehydrated onion and garlic in Mahuva and Gujarat hubs under strict HACCP sanitary protocols. Our products feature low moisture, zero micro-contamination, and uniform cut sizes.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Zero SO2 / Chemical Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Custom Mesh Sizes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>High Rehydration Yield</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Export Standard Cartons</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/images/cat_dehydrated.png"
              alt="Dehydrated Onion Flakes & Garlic Powder Exporter"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Product Specifications & Packaging
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEHYDRATED_ITEMS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-[#0F5132]">{item.name}</h4>
                  <Sun className="w-5 h-5 text-[#C9A227]" />
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
          <h3 className="text-2xl font-bold">Request Dehydrated Product Samples & CIF Rates</h3>
          <p className="text-emerald-100 text-xs">Contact our team for specifications and container loads.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Contact Export Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
