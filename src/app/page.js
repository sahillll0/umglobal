'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import { 
  ArrowRight, 
  Flame,
  Sun,
  Wheat,
  Sprout,
  Apple,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';

const CATEGORIES = [
  { 
    id: 'spices',
    name: 'Spices', 
    icon: Flame, 
    desc: 'High Curcumin Turmeric, Teja Chili & Cardamom', 
    count: '12+ Varieties',
    bgImage: '/images/cat_spices.png',
    href: '/products#spices'
  },
  { 
    id: 'dehydrated',
    name: 'Dehydrated Products', 
    icon: Sun, 
    desc: 'Dehydrated Onion Flakes & Garlic Powder', 
    count: '8+ Varieties',
    bgImage: '/images/cat_dehydrated.png',
    href: '/products#dehydrated'
  },
  { 
    id: 'pulses',
    name: 'Pulses', 
    icon: Wheat, 
    desc: 'Sortex Cleaned Chickpeas, Lentils & Moong', 
    count: '15+ Varieties',
    bgImage: '/images/hero_turmeric.png',
    href: '/products#pulses'
  },
  { 
    id: 'millets',
    name: 'Millets', 
    icon: Sprout, 
    desc: 'Organic Sorghum, Pearl Millet & Finger Millet', 
    count: '6+ Varieties',
    bgImage: '/images/hero_shipping.png',
    href: '/products#millets'
  },
  { 
    id: 'fresh-produce',
    name: 'Fresh Produce', 
    icon: Apple, 
    desc: 'Export Quality Onions, Potatoes & Grapes', 
    count: '10+ Varieties',
    bgImage: '/images/hero_produce.png',
    href: '/products#fresh-produce'
  }
];

export default function Home() {
  const handleOpenQuoteModal = () => {
    const contactSection = document.getElementById('contact-cta');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <Hero onOpenQuoteModal={handleOpenQuoteModal} />

      {/* 2. About Us & Why Choose Us Section */}
      <AboutUs />

      {/* 3. Featured Premium Export Categories Showcase with Background Images */}
      <section id="categories" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-[#C9A227]/10 px-3.5 py-1.5 rounded-full border border-[#C9A227]/30 backdrop-blur-sm">
              Visual Portfolio Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Our Premium Export Categories
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Explore our export-ready agricultural commodities processed & packaged to meet international B2B buyer standards.
            </p>
          </div>

          {/* Cards Grid with Background Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={cat.id}
                  className="group relative rounded-3xl overflow-hidden aspect-[3/4] border border-slate-700/80 shadow-2xl flex flex-col justify-between p-6 transform hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Background Image with Zoom on Hover */}
                  <Image
                    src={cat.bgImage}
                    alt={`${cat.name} Indian Export Portfolio`}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/30 group-hover:from-slate-950 group-hover:via-slate-950/80 transition-colors duration-500" />

                  {/* Top Badge & Icon */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#C9A227] group-hover:bg-[#0F5132] group-hover:text-white group-hover:border-emerald-500/50 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider text-emerald-300 uppercase bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 backdrop-blur-sm">
                      {cat.count}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-xl font-extrabold text-white group-hover:text-[#C9A227] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>

                    <Link 
                      href={cat.href}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#C9A227] pt-2 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Global Trade Call to Action */}
      <section id="contact-cta" className="py-24 bg-gradient-to-r from-[#0F5132] to-[#093822] text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <span>Direct Agro Export Operations</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Partner with India&apos;s Trusted Agricultural Exporter
          </h2>

          <p className="text-emerald-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Get FOB/CIF prices, lab certificates, moisture report specs & private label packing options tailored for your market.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link 
              href="/contact"
              className="px-8 py-4 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-base shadow-xl hover:bg-[#d5ac2b] transition-all transform hover:-translate-y-0.5"
            >
              Contact Export Desk
            </Link>
            <Link 
              href="/quality"
              className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-base shadow-sm hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Quality Assurance Standards
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
