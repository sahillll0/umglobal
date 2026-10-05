'use client';

import React from 'react';
import PageHeader from '../components/PageHeader';
import Link from 'next/link';
import { 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Ship
} from 'lucide-react';

const MARKETS = [
  {
    region: 'Middle East & GCC Countries',
    countries: 'UAE (Dubai/Jebel Ali), Saudi Arabia, Qatar, Oman, Kuwait, Bahrain',
    demand: 'High Curcumin Turmeric, Red Chili, Kabuli Chickpeas, Cardamom, Fresh Red Onions',
    standards: 'International Quality Standards'
  },
  {
    region: 'European Union & United Kingdom',
    countries: 'Germany, Netherlands (Rotterdam), UK (Felixtowe), Italy, Spain, Poland',
    demand: 'Dehydrated Garlic, Onion Flakes, Millets, Whole Spices',
    standards: 'EU MRL Compliance, ETO-Free Certification, Aflatoxin Analysis'
  },
  {
    region: 'Southeast Asia & Far East',
    countries: 'Malaysia, Singapore, Vietnam, Indonesia, Thailand, Philippines',
    demand: 'Red Chili S17, Kabuli Chickpeas, Whole Spices, Fresh Table Grapes',
    standards: 'Phytosanitary Certification, Fumigation & Form E CO'
  },
  {
    region: 'North America',
    countries: 'United States (New York/Los Angeles), Canada (Toronto/Vancouver)',
    demand: 'Spices, Pulses, Dehydrated Vegetables, Millets',
    standards: 'Export Grade Packaging'
  }
];

export default function ExportMarketsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Global Export Markets"
        subtitle="Serving Importers, Wholesalers & Food Processors Across 35+ International Markets."
        breadcrumbs={[{ label: 'Export Markets' }]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            Worldwide Footprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Export Destination Standards & Compliance
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            UM Global Exim has established long-standing trade relationships with international B2B importers. We ensure strict adherence to destination-specific customs clearance, phytosanitary requirements, and pesticide residue limits.
          </p>
        </div>

        {/* Region Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MARKETS.map((m, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl transition-all space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-100 text-[#0F5132]">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{m.region}</h3>
                  <p className="text-xs font-semibold text-[#0F5132]">{m.countries}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div><strong className="text-slate-800">Primary Demand:</strong> {m.demand}</div>
                <div><strong className="text-slate-800">Regulatory Standards:</strong> {m.standards}</div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold text-[#C9A227]">
                <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
                <span>100% Pre-Shipment Document Readiness</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F5132] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl font-bold">Inquire for Destination Port FOB / CIF Rates</h3>
          <p className="text-emerald-100 text-xs">Our export managers provide custom port quotes within 12 hours.</p>
          <Link href="/contact" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-xs shadow-lg">
            <span>Contact Export Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
