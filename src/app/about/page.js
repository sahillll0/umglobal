'use client';

import React from 'react';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import AboutUs from '../components/AboutUs';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Award, 
  Globe2, 
  Truck, 
  ArrowRight,
  CheckCircle2,
  Building2,
  FileCheck
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner & Breadcrumbs */}
      <PageHeader 
        title="About UM Global Exim"
        subtitle="Trusted Indian Export Partner for Premium Spices, Dehydrated Vegetables, Pulses, Millets & Fresh Produce."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* About Company Overview & Why Choose Us */}
      <AboutUs />

      {/* Corporate Certifications & Global Infrastructure */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-[#C9A227]/10 px-3.5 py-1.5 rounded-full border border-[#C9A227]/30">
              Government Recognized
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Certifications & Export Infrastructure
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Committed to international phytosanitary standards, batch lab testing, and direct port dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950 text-[#C9A227] w-fit">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">International Quality Standards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our products are carefully selected, processed, and packed to meet international quality standards and customer requirements.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950 text-[#C9A227] w-fit">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Consistent Product Quality</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adhering to strict Quality Management Systems (QMS) ensuring complete moisture standards and zero contamination.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950 text-[#C9A227] w-fit">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">FOB / CIF Maritime Logistics</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strategic connectivity with Mundra, JNPT, and Chennai ports for seamless ocean container shipments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#0F5132] to-[#093822] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Looking for a Long-Term Agro Sourcing Partner?
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto">
            Contact our export sales department for custom product specifications, pricing, and sample kits.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-base shadow-xl hover:bg-[#d5ac2b] transition-all"
            >
              <span>Contact Export Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
