'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import {
  Globe,
  Mail,
  PhoneCall,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="group shrink-0 inline-block">
              <Logo variant="default" size="md" />
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Government Recognized Indian Export House specializing in premium Spices, Dehydrated Products, Pulses, Millets, and Fresh Produce for global B2B importers & wholesalers.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>APEDA Registered</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>ISO 9001:2015</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#C9A227] transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C9A227] transition-colors">About Company</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#C9A227] transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/quality-assurance" className="hover:text-[#C9A227] transition-colors">Quality Assurance</Link>
              </li>
              <li>
                <Link href="/packaging-logistics" className="hover:text-[#C9A227] transition-colors">Packaging & Logistics</Link>
              </li>
              <li>
                <Link href="/export-markets" className="hover:text-[#C9A227] transition-colors">Export Markets</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9A227] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Export Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product Portfolios</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/products/spices" className="hover:text-[#C9A227] transition-colors">Spices (Turmeric, Chili)</Link>
              </li>
              <li>
                <Link href="/products/dehydrated-products" className="hover:text-[#C9A227] transition-colors">Dehydrated Onion & Garlic</Link>
              </li>
              <li>
                <Link href="/products/pulses" className="hover:text-[#C9A227] transition-colors">Sortex Pulses & Chickpeas</Link>
              </li>
              <li>
                <Link href="/products/millets" className="hover:text-[#C9A227] transition-colors">Organic Millets & Grains</Link>
              </li>
              <li>
                <Link href="/products/fresh-produce" className="hover:text-[#C9A227] transition-colors">Fresh Onions & Produce</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Export Desk</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>UM Global Exim Private Limited, Export Processing Hub, India</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href="mailto:export@umglobalexim.com" className="hover:text-white transition-colors">export@umglobalexim.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Terms */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} UM Global Exim Private Limited. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Quality Guaranteed</span>
            <span>•</span>
            <span>FOB & CIF Terms</span>
            <span>•</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
