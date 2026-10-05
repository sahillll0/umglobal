'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import { motion } from 'framer-motion';
import { 
  Flame, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  ArrowRight,
  Award,
  FileText
} from 'lucide-react';

const SPICE_ITEMS = [
  {
    name: 'Turmeric (High Curcumin)',
    specs: 'Curcumin 3% to 5.5%+, Low Moisture (<10%), Whole & Powder',
    desc: 'Golden Indian turmeric sourced from Nizamabad & Salem. High aroma and intense natural pigmentation.',
    packaging: '25kg / 50kg PP Bags or Vacuum Pack'
  },
  {
    name: 'Red Chili (Teja & S17)',
    specs: 'SHU 20,000 to 90,000+, ASTA Color 40-100, Stemmed & Stemless',
    desc: 'Pungent red chili peppers sourced from Guntur. Available as whole dried pods, crushed flakes, and fine powder.',
    packaging: '25kg Jute Bags or Moisture Barrier Bags'
  },
  {
    name: 'Green Cardamom (8mm+)',
    specs: 'Bold 8mm+ Extra Green, Oil Content > 3.5%, Zero Artificial Color',
    desc: 'Handpicked aromatic green cardamom pods from Idukki, Kerala. Intense fragrance and vibrant green hue.',
    packaging: '5kg Master Cartons or Vacuum Foil Bags'
  },
  {
    name: 'Black Pepper & Cumin',
    specs: 'Malabar Extra Bold 550g/L - 570g/L, Cumin Purity 99.5% Machine Cleaned',
    desc: 'Sun-dried black pepper corns and sortex cleaned cumin seeds rich in natural essential oils.',
    packaging: '25kg / 50kg Heavy-Duty Bags'
  }
];

export default function SpicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Spices Export Portfolio"
        subtitle="Authentic Indian Turmeric, Red Chili, Cardamom, Black Pepper & Cumin Processed for International Standards."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Spices' }
        ]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Premium Quality Spices
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Premium Grade Indian Whole & Ground Spices
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              India is world-renowned as the spice capital of the world. At UM Global Exim, we supply premium whole and steam-sterilized spice powders directly from certified growing regions. Every batch undergoes rigorous pesticide testing, aflatoxin analysis, and moisture control.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Pesticide & ETO Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>ASTA Color Standard</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Steam Sterilized Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span>Private Labeling Ready</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/images/cat_spices.png"
              alt="Indian Spices Export UM Global Exim"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Spice Varieties Grid */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Key Spice Varieties & Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPICE_ITEMS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-[#0F5132]">{item.name}</h4>
                  <Flame className="w-5 h-5 text-[#C9A227]" />
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

      {/* CTA */}
      <section className="py-16 bg-[#0F5132] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl font-bold">Request Spice Samples or Container FOB Pricing</h3>
          <p className="text-emerald-100 text-xs">Our export manager will email lab certificates and pricing within 12 hours.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
