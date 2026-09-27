'use client';

import React from 'react';
import PageHeader from '../components/PageHeader';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Award, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  FlaskConical,
  Microscope,
  BoxCheck,
  Scale
} from 'lucide-react';

const QUALITY_STEPS = [
  {
    step: '01',
    title: 'Farm & Raw Material Selection',
    desc: 'Direct farm sourcing from certified agricultural belts with strict pre-harvest pesticide screening.'
  },
  {
    step: '02',
    title: 'Sortex Cleaning & Grading',
    desc: 'Advanced optical color sorters and gravity separators to eliminate broken, discolored, or foreign grains.'
  },
  {
    step: '03',
    title: 'Lab Analysis & Moisture Control',
    desc: 'Comprehensive testing for moisture content, curcumin levels, ETO residue, heavy metals, and aflatoxin.'
  },
  {
    step: '04',
    title: 'Hygienic Packaging & Container Loading',
    desc: 'Sealed vacuum, PP, or jute packaging loaded under strict inspection with container temperature monitoring.'
  }
];

export default function QualityAssurancePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Quality Assurance & Certifications"
        subtitle="Uncompromising Quality Standards, APEDA Accreditation & ISO 9001:2015 Tested Agro Products."
        breadcrumbs={[{ label: 'Quality Assurance' }]}
      />

      {/* Main Quality Overview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            Zero Defect Commitment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            World-Class Testing & Phytosanitary Compliance
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Quality is the backbone of UM Global Exim. Every consignment exported to Europe, North America, Middle East, and Asia complies strictly with the importing nation&apos;s food safety standards.
          </p>
        </div>

        {/* Quality Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-emerald-100 text-[#0F5132] w-fit">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pesticide & ETO Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Third-party NABL accredited laboratory batch testing ensuring compliance with EU MRL standards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-amber-100 text-[#C9A227] w-fit">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Moisture Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict moisture parameters maintained to prevent mold, fungal growth, or clump formation during long sea transit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-emerald-100 text-[#0F5132] w-fit">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Sortex Machine Purity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optical sorting technology guaranteeing 99.5% - 99.9% grain purity with zero foreign matter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-amber-100 text-[#C9A227] w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Phytosanitary Certification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official Indian Plant Quarantine Phytosanitary certificate issued for every outgoing container shipment.
            </p>
          </div>
        </div>

        {/* 4-Step Quality Control Workflow */}
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            Our 4-Stage Quality Control Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUALITY_STEPS.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 relative overflow-hidden">
                <span className="text-3xl font-extrabold text-[#C9A227] opacity-60">
                  {s.step}
                </span>
                <h4 className="text-base font-bold text-white">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F5132] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl font-bold">Request Batch Lab Reports or Certificate Copies</h3>
          <p className="text-emerald-100 text-xs">We provide SGS, GEO-CHEM, or NABL accredited pre-shipment inspection reports.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Contact Quality Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
