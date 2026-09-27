'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Flame, 
  Sun, 
  Wheat, 
  Sprout, 
  Apple,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

const CATEGORY_CARDS = [
  {
    id: 'spices',
    title: 'Spices',
    subtitle: 'Indian Turmeric, Red Chili, Cardamom & Pepper',
    description: 'Authentic Indian whole and ground spices sourced directly from Nizamabad, Guntur & Malabar regions. Rich in natural essential oils, aroma, and high curcumin content.',
    image: '/images/cat_spices.png',
    href: '/products/spices',
    icon: Flame,
    badge: 'APEDA Certified',
    varieties: ['High Curcumin Turmeric', 'Teja & S17 Red Chili', 'Green Cardamom (8mm+)', 'Black Pepper & Cumin']
  },
  {
    id: 'dehydrated-products',
    title: 'Dehydrated Products',
    subtitle: 'White & Red Onion Flakes, Garlic Powders & Granules',
    description: 'High-grade dehydrated vegetables processed under hygienic, low-temperature conditions to preserve natural flavor, aroma, and extended shelf-life.',
    image: '/images/cat_dehydrated.png',
    href: '/products/dehydrated-products',
    icon: Sun,
    badge: 'Low Moisture Standard',
    varieties: ['Dehydrated White Onion Flakes', 'Garlic Powder & Granules', 'Dehydrated Tomato Powder', 'Toasted Onion Flakes']
  },
  {
    id: 'pulses',
    title: 'Pulses',
    href: '/products/pulses',
    subtitle: 'Sortex Cleaned Chickpeas, Red Lentils & Moong',
    description: 'High-protein legumes and pulses machine sorted and cleaned using advanced laser sortex technology to eliminate impurities and damaged seeds.',
    image: '/images/hero_turmeric.png',
    icon: Wheat,
    badge: 'Sortex Machine Cleaned',
    varieties: ['Kabuli Chickpeas (40-42 to 75-80)', 'Red Split Lentils (Masoor)', 'Moong Dal (Whole & Split)', 'Desi Chickpeas & Toor Dal']
  },
  {
    id: 'millets',
    title: 'Millets',
    href: '/products/millets',
    subtitle: 'Gluten-Free Sorghum, Pearl Millet & Finger Millet',
    description: 'Nutrient-dense ancient grains and superfoods rich in dietary fiber, minerals, and proteins grown under sustainable rainfed farming.',
    image: '/images/hero_shipping.png',
    icon: Sprout,
    badge: '100% Organic Superfood',
    varieties: ['Sorghum Grains (Jowar)', 'Pearl Millet (Bajra)', 'Finger Millet (Ragi)', 'Foxtail & Barnyard Millet']
  },
  {
    id: 'fresh-produce',
    title: 'Fresh Produce',
    href: '/products/fresh-produce',
    subtitle: 'Fresh Red Onions, Potatoes, Grapes & Pomegranates',
    description: 'Farm-fresh fruits and vegetables harvested at peak maturity, graded, cold-stored, and packaged for long-distance maritime transit.',
    image: '/images/hero_produce.png',
    icon: Apple,
    badge: 'Cold Chain Packaged',
    varieties: ['Fresh Red & Yellow Onions', 'Fresh Potatoes (Jyoti/LR)', 'Fresh Table Grapes (Nashik)', 'Bhagwa Pomegranates']
  }
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner & Breadcrumbs */}
      <PageHeader 
        title="All Product Categories"
        subtitle="Explore UM Global Exim's export portfolio of premium Indian Spices, Dehydrated Vegetables, Pulses, Millets & Fresh Produce."
        breadcrumbs={[{ label: 'Products' }]}
      />

      {/* Main Categories Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/60">
            Export Portfolios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Export-Grade Agricultural Products
          </h2>
          <p className="text-slate-600 text-base">
            Select a product category below to view detailed specifications, available grades, lab reports, and packaging options.
          </p>
        </div>

        {/* Category Cards Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORY_CARDS.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={cat.image}
                      alt={`${cat.title} UM Global Exim`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <span className="absolute top-4 left-4 text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-white/90 text-[#0F5132] shadow-sm backdrop-blur-md">
                      {cat.badge}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-2 text-white">
                      <div className="p-2 rounded-xl bg-[#0F5132] text-[#C9A227]">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white drop-shadow-sm">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs font-semibold text-[#0F5132]">
                      {cat.subtitle}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Popular Varieties */}
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Key Export Varieties:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {cat.varieties.map((v, i) => (
                          <div key={i} className="flex items-center space-x-1 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3 h-3 text-[#C9A227] shrink-0" />
                            <span className="truncate">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action: Learn More Button */}
                <div className="p-6 pt-0">
                  <Link
                    href={cat.href}
                    className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs group-hover:bg-[#0F5132] group-hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0F5132] to-[#093822] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold">Need Custom Packaging or Bulk Container Rates?</h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Our export managers assist with private labeling, bag sizes (10kg, 25kg, 50kg, Jumbo Bags), and port destination quotes.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#C9A227] text-[#093822] font-bold text-sm shadow-xl hover:bg-[#d5ac2b] transition-all"
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
