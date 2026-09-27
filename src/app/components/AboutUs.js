'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Award,
  Users,
  PackageCheck,
  TrendingUp,
  Truck,
  Tag,
  Globe2,
  Headphones,
  Target,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

// "Why Choose Us" 8 Cards Data
const WHY_CHOOSE_US_CARDS = [
  {
    id: 1,
    title: 'Premium Quality Products',
    description: 'Carefully selected products that meet international quality standards and regulatory compliance.',
    icon: Award,
    bgColor: 'bg-emerald-100/70',
    iconColor: 'text-[#0F5132]',
    borderColor: 'hover:border-emerald-300'
  },
  {
    id: 2,
    title: 'Reliable Sourcing Network',
    description: 'Source directly from trusted farmers and certified manufacturers across agricultural hubs in India.',
    icon: Users,
    bgColor: 'bg-amber-100/70',
    iconColor: 'text-[#C9A227]',
    borderColor: 'hover:border-amber-300'
  },
  {
    id: 3,
    title: 'Export Standard Packaging',
    description: 'Secure, moisture-controlled, and customized vacuum/PP/Jute packaging for global maritime shipments.',
    icon: PackageCheck,
    bgColor: 'bg-emerald-100/70',
    iconColor: 'text-[#0F5132]',
    borderColor: 'hover:border-emerald-300'
  },
  {
    id: 4,
    title: 'Competitive Pricing',
    description: 'Best value and transparent wholesale pricing without compromising on product grade or quality.',
    icon: TrendingUp,
    bgColor: 'bg-amber-100/70',
    iconColor: 'text-[#C9A227]',
    borderColor: 'hover:border-amber-300'
  },
  {
    id: 5,
    title: 'Timely Deliveries',
    description: 'Efficient supply chain logistics, port clearance, and on-time FOB/CIF export solutions.',
    icon: Truck,
    bgColor: 'bg-emerald-100/70',
    iconColor: 'text-[#0F5132]',
    borderColor: 'hover:border-emerald-300'
  },
  {
    id: 6,
    title: 'Private Label Solutions',
    description: 'Customized buyer branding, OEM packaging, bag sizes, and customized label printing.',
    icon: Tag,
    bgColor: 'bg-amber-100/70',
    iconColor: 'text-[#C9A227]',
    borderColor: 'hover:border-amber-300'
  },
  {
    id: 7,
    title: 'Worldwide Export Capability',
    description: 'Serving international importers, distributors, and retail chains across global markets.',
    icon: Globe2,
    bgColor: 'bg-emerald-100/70',
    iconColor: 'text-[#0F5132]',
    borderColor: 'hover:border-emerald-300'
  },
  {
    id: 8,
    title: 'Customer-Focused Service',
    description: 'Dedicated export manager support, fast response times, and long-term business partnerships.',
    icon: Headphones,
    bgColor: 'bg-amber-100/70',
    iconColor: 'text-[#C9A227]',
    borderColor: 'hover:border-amber-300'
  }
];

export default function AboutUs() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white text-slate-800 relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* SECTION 1: ABOUT US HEADER & TWO-COLUMN LAYOUT */}
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#0F5132] text-xs font-bold tracking-wider uppercase border border-emerald-200/60 shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Government Registered Agro Exporter</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
            >
              About <span className="text-[#0F5132]">UM Global Exim</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-medium"
            >
              Trusted Indian Export Partner for Premium Agricultural Products
            </motion.p>
          </div>

          {/* Two-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Side: Premium Image Showcase */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <Image
                  src="/images/about_hero.png"
                  alt="UM Global Exim Indian Agricultural Export Warehouse & Quality Sourcing"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Badge on Image */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-[#0F5132] text-[#C9A227]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">APEDA & ISO Certified</div>
                      <div className="text-xs text-slate-500">Global Standard Export Sourcing</div>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-[#093822]">
                    India Origin
                  </span>
                </div>
              </div>

              {/* Decorative Accent Card */}
              <div className="absolute -bottom-6 -right-4 w-48 p-3.5 rounded-2xl bg-white shadow-xl border border-slate-100 hidden sm:block">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#0F5132]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                  <span>100% Traceability</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Direct Farm Sourcing</div>
              </div>
            </motion.div>

            {/* Right Side: Company Overview & Mission/Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                <p>
                  <strong className="text-slate-900 font-semibold">UM Global Exim</strong> is a trusted Indian export company specializing in premium-quality <strong className="text-[#0F5132]">Spices, Dehydrated Products, Pulses, Millets, and Fresh Produce</strong>. We source our products from reliable farmers and manufacturers across India to ensure exceptional quality and consistency.
                </p>
                <p className="text-slate-600 text-sm sm:text-base">
                  We proudly serve importers, wholesalers, distributors, retailers, and food processing companies worldwide by providing export-standard products, competitive pricing, timely deliveries, and long-term business partnerships.
                </p>
              </div>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                
                {/* Mission Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-emerald-100 text-[#0F5132]">
                      <Target className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Our Mission</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Deliver premium agricultural products from India to global markets while building long-term relationships based on trust, quality, and reliability.
                  </p>
                </motion.div>

                {/* Vision Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-amber-100 text-[#C9A227]">
                      <Eye className="w-5 h-5 text-[#093822]" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Our Vision</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Become one of the most trusted global exporters of Indian agricultural products by maintaining world-class quality and customer satisfaction.
                  </p>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>

        {/* SECTION 2: WHY CHOOSE US GRID */}
        <div className="space-y-12 pt-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
              Core Strengths
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose UM Global Exim
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              Why international importers & wholesale buyers rely on us for seamless agricultural sourcing.
            </p>
          </div>

          {/* 8 Feature Cards Grid (Clean hover without Learn More text) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US_CARDS.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={`p-6 rounded-2xl bg-white border border-slate-200/70 shadow-sm hover:shadow-xl ${card.borderColor} transition-all duration-300 flex flex-col justify-between group h-full`}
                >
                  <div className="space-y-4">
                    {/* Icon inside colored circular background */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComp className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-[#C9A227] transition-colors">
                        0{card.id}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0F5132] transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
