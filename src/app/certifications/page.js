'use client';

import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle2, 
  FileText, 
  Building2, 
  MapPin, 
  User, 
  Calendar,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import Image from 'next/image';

export default function CertificationsPage() {
  const [imgError, setImgError] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Official Certifications"
        subtitle="Government Recognized & Certified Export House in India. Ensuring trust, quality, and global compliance."
        breadcrumbs={[{ label: 'Certifications' }]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Text */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 inline-block">
            Verified & Trusted Exporter
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Commitment to Global Standards
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            At UM GLOBAL EXIM, we adhere to the highest international trade standards. Our government-issued certifications reflect our dedication to transparent, legal, and reliable export operations worldwide.
          </p>
        </div>

        {/* Certificate Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Certificate Document Viewer / Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F5132] to-[#146c43] transform -skew-y-2 rounded-3xl -z-10 group-hover:skew-y-0 transition-transform duration-500 shadow-xl"></div>
            
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 h-full flex flex-col">
              <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#C9A227]" />
                  <h3 className="font-bold text-slate-800 text-sm">IEC Certificate</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  Verified Active
                </span>
              </div>
              
              {/* Document Image */}
              <div className="bg-slate-100 rounded-xl flex-1 min-h-[400px] border border-slate-200 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden group-hover:border-emerald-300 transition-colors">
                {!imgError && (
                  <Image
                    src="/images/iec-certificate.png" 
                    alt="IEC Certificate - UM Global Exim" 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain rounded-lg shadow-sm"
                    onError={() => setImgError(true)}
                  />
                )}
                
                {/* Fallback if image is not found */}
                {imgError && (
                  <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
                    <Award className="w-16 h-16 text-slate-300 mb-4 group-hover:text-[#C9A227] transition-colors duration-500" />
                    <p className="text-sm font-semibold text-slate-500 mb-2">
                      Government of India
                    </p>
                    <p className="text-xs text-slate-400 max-w-[200px] mb-4">
                      Ministry of Commerce and Industry Directorate General of Foreign Trade
                    </p>
                    <div className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                      Image not found! Please place your certificate image at: <br/> 
                      <code className="text-slate-800 bg-white px-1 py-0.5 mt-1 block">public/images/iec-certificate.png</code>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 bg-white/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-200 shadow-sm z-10">
                  Official IEC Document
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Company Details extracted from Certificate */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Globe2 className="w-32 h-32 text-[#0F5132]" />
              </div>

              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-[#0F5132]" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Importer-Exporter Code (IEC)</h3>
                  <p className="text-sm text-slate-500 font-medium">Issued by Directorate General of Foreign Trade</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* IEC Number */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">IEC Number</span>
                  </div>
                  <div className="text-lg font-black text-[#0F5132]">AAJFU5102G</div>
                </div>

                {/* Firm Name */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Firm Name</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">UM GLOBAL EXIM</div>
                </div>

                {/* Nature of Concern */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Nature of Concern</span>
                  </div>
                  <div className="text-base font-bold text-slate-800">Partnership</div>
                  <div className="text-xs text-slate-500 mt-1">Signatory: Ujwala Dinesh Kadam</div>
                </div>

                {/* Date of Issue */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Valid Till</span>
                  </div>
                  <div className="text-base font-bold text-slate-800">11/09/2026</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1 bg-emerald-100 px-2 py-0.5 rounded inline-block">Active Status</div>
                </div>

                {/* Registered Address */}
                <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-2 text-slate-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Registered Address</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    Mumbai, MAHARASHTRA, 400010
                  </p>
                </div>

              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Authenticity can be checked at the official <a href="https://dgft.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#C9A227] hover:underline font-bold">DGFT website</a>.
                </p>
                <div className="flex items-center space-x-1 text-[#0F5132]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Verified</span>
                </div>
              </div>
            </div>

            {/* Why Trust Us Banner */}
            <div className="bg-[#093822] rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-[#C9A227] mb-1">Global Trade Ready</h4>
                <p className="text-sm text-emerald-100/80 max-w-sm">
                  Our official IEC certification ensures seamless customs clearance and compliant B2B bulk transactions globally.
                </p>
              </div>
              <div className="hidden sm:block p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Award className="w-10 h-10 text-[#C9A227]" />
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
