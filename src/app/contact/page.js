'use client';

import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Globe2,
  Building2
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: 'Spices',
    quantity: '',
    port: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [customerConfirmationSent, setCustomerConfirmationSent] = useState(false);
  const [submissionWarning, setSubmissionWarning] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType: 'contact'
        })
      });

      const data = await response.json();

      if (data.success) {
        setCustomerConfirmationSent(Boolean(data.customerConfirmationSent));
        setSubmissionWarning(data.warning || '');
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setCustomerConfirmationSent(false);
          setSubmissionWarning('');
          setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            product: 'Spices',
            quantity: '',
            port: '',
            message: ''
          });
        }, 5000);
      } else {
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrorMessage('Network error. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader 
        title="Contact Export Desk"
        subtitle="Connect with UM Global Exim for B2B Wholesale Inquiries, FOB/CIF Quotations & Product Sample Kits."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Office info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                Direct B2B Communication
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Get in Touch with Our Agro Export Managers
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you require container FOB pricing, customized private labeling, lab reports, or sample kits, our team is available 24/7 to assist international buyers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-[#0F5132] shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Export Helpline</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Worldwide Export Solutions from India</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">Instant Response Available</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-amber-100 text-[#C9A227] shrink-0">
                  <Mail className="w-5 h-5 text-[#093822]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Official Business Email</h4>
                  <p className="text-xs text-slate-600 mt-0.5">sales@umglobalexim.com</p>
                  <span className="text-[10px] text-slate-400">Response within 12 business hours</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-[#0F5132] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Corporate Registered Office</h4>
                  <p className="text-xs text-slate-600 mt-0.5">UM Global Exim Private Limited, Export Processing Hub, India</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-slate-800 text-[#C9A227] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Export Hours</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Monday - Saturday: 9:00 AM - 8:00 PM (IST)</p>
                  <p className="text-[11px] text-emerald-300 mt-1">24/7 International Desk for Container Dispatch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Request Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F5132] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-[#0F5132]" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Inquiry Received Successfully!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to UM Global Exim. {customerConfirmationSent ? <>We have also sent a thank-you email to <strong className="text-[#0F5132]">{formData.email}</strong>, and our export team will get back to you soon.</> : <>Our international trade manager will review your request and reply to <strong className="text-[#0F5132]">{formData.email}</strong> soon.</>}
                </p>
                {submissionWarning && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-xl mx-auto">
                    {submissionWarning}
                  </p>
                )}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Request Official B2B Quotation</h3>
                  <p className="text-xs text-slate-500 mt-1">Fill out the form below for fast pricing, lab reports, or sample shipments.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Global Food Imports LLC"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="purchasing@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Your Phone Number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Product Interest *
                    </label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] bg-white"
                    >
                      <option value="Spices">Spices (Turmeric, Chili, Cardamom)</option>
                      <option value="Dehydrated Products">Dehydrated Onion & Garlic</option>
                      <option value="Pulses">Pulses & Kabuli Chickpeas</option>
                      <option value="Millets">Millets & Sorghum</option>
                      <option value="Fresh Produce">Fresh Produce (Onions, Potatoes, Grapes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Estimated Quantity (Metric Tons)
                    </label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g. 24 MT (1x20' FCL)"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Destination Port / Country
                  </label>
                  <input
                    type="text"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    placeholder="e.g. Jebel Ali (Dubai), Rotterdam (Netherlands), Felixstowe (UK)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Specific Specifications / Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify required grade, moisture limits, packaging preference (25kg PP, Vacuum, Jute), and preferred shipping terms (FOB/CIF)..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#0F5132] text-white font-bold text-sm hover:bg-[#093822] disabled:opacity-70 transition-colors shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message to Export Desk...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C9A227]" />
                      <span>Submit Inquiry to Export Desk</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
