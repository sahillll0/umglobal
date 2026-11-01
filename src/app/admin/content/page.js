'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Save, Loader2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';

const SECTIONS = [
  { key: 'homepage_hero',   label: 'Homepage Hero',    icon: '🏠' },
  { key: 'homepage_about',  label: 'Homepage About',   icon: '🏢' },
  { key: 'homepage_cta',    label: 'Homepage CTA',     icon: '📣' },
  { key: 'about_page',      label: 'About Us Page',    icon: '📄' },
  { key: 'contact_info',    label: 'Contact Info',     icon: '📞' },
  { key: 'global_settings', label: 'Global Settings',  icon: '⚙️' },
  { key: 'footer_content',  label: 'Footer',           icon: '🔗' },
];

const DEFAULTS = {
  homepage_hero: {
    heading:     'Premium Agricultural Products Exporter From India to the World',
    subheading:  'UM Global Exim supplies premium Spices, Dehydrated Vegetables, Pulses, Millets, and Fresh Produce to international importers.',
    ctaText:     'Request a Quote',
    ctaLink:     '/contact',
    ctaSecondaryText: 'Explore Products',
    ctaSecondaryLink: '/products',
    stat1Value: '100', stat1Label: 'Products Portfolio', stat1Suffix: '+',
    stat2Value: '20',  stat2Label: 'Countries Served',   stat2Suffix: '+',
    stat3Value: '100', stat3Label: 'Quality Checked',    stat3Suffix: '%',
    stat4Value: '24',  stat4Label: 'Export Support',     stat4Suffix: '/7',
  },
  homepage_about: {
    badge:       'Why Choose Us',
    heading:     'Trusted Indian Agricultural Exporter',
    description: 'We source directly from farmers and deliver export-quality commodities worldwide.',
    point1:      'Direct Farm Sourcing',
    point2:      'Government Recognized',
    point3:      '100% Quality Tested',
    point4:      'FOB / CIF Shipping',
  },
  homepage_cta: {
    heading:     "Partner with India's Trusted Agricultural Exporter",
    description: 'Get FOB/CIF prices, lab certificates, moisture report specs & private label packing options.',
    ctaText:     'Contact Export Desk',
    ctaLink:     '/contact',
    ctaSecondaryText: 'Quality Assurance Standards',
    ctaSecondaryLink: '/quality-assurance',
  },
  about_page: {
    heading:     'About UM Global Exim',
    subtitle:    'Trusted Indian Export Partner for Premium Agricultural Products.',
    mission:     'To deliver premium quality Indian agricultural products to global markets with integrity, reliability, and excellence.',
    vision:      'To become the most trusted Indian agricultural export company worldwide.',
    description: 'UM Global Exim is a government-recognized Indian export company specializing in premium agricultural commodities.',
    value1:      'Quality First', value2: 'Customer Focus', value3: 'Transparency', value4: 'Sustainability',
  },
  contact_info: {
    email:      'sales@umglobalexim.com',
    phone:      '+91 7304305372',
    whatsapp:   '+91 7304305372',
    address:    'UM Global Exim Private Limited, Export Processing Hub, India',
    mapLink:    '',
    instagram:  '',
    linkedin:   '',
    twitter:    '',
  },
  global_settings: {
    companyName: 'UM Global Exim',
    tagline:     'Premium Agricultural Products Exporter From India to the World',
    metaTitle:   'UM Global Exim | Premium Agro Product Exporter India',
    metaDesc:    'Government Recognized Export House from India specializing in Spices, Dehydrated Products, Pulses, Millets & Fresh Produce.',
  },
  footer_content: {
    description:  'Government Recognized Indian Export House supplying premium agricultural products worldwide.',
    copyright:    '© 2024 UM Global Exim Private Limited. All rights reserved.',
    quickLinks:   'Home,About,Products,Quality,Certifications,Contact',
    certText:     'Certified Export House',
  },
};

export default function ContentPage() {
  const [activeSection, setActiveSection] = useState('homepage_hero');
  const [allContent, setAllContent]       = useState({});
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [saveMsg, setSaveMsg]             = useState('');
  const [localData, setLocalData]         = useState({});
  const [uploading, setUploading]         = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          // Merge DB content with defaults so all fields are present
          const merged = {};
          SECTIONS.forEach(s => {
            merged[s.key] = { ...(DEFAULTS[s.key] || {}), ...(d.content[s.key] || {}) };
          });
          setAllContent(merged);
          setLocalData(merged[activeSection] || DEFAULTS[activeSection] || {});
        }
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  // Sync localData when switching sections
  useEffect(() => {
    setLocalData(allContent[activeSection] || DEFAULTS[activeSection] || {});
    setSaveMsg('');
  }, [activeSection, allContent]);

  const setField = (key, val) => setLocalData(d => ({ ...d, [key]: val }));

  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const res  = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activeSection, content: localData }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setAllContent(prev => ({ ...prev, [activeSection]: localData }));
      setSaveMsg('Saved successfully!');
    } catch (err) { setSaveMsg('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const uploadImage = async (e, fieldKey) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('folder', 'umglobal-content');
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setField(fieldKey, data.url);
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  };

  const F = ({ label, field, type = 'text', rows, placeholder }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={rows || 3} value={localData[field] || ''} onChange={e => setField(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]" />
      ) : (
        <input type={type} value={localData[field] || ''} onChange={e => setField(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]" />
      )}
    </div>
  );

  const ImgField = ({ label, field }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {localData[field] ? (
        <div className="relative">
          <Image src={localData[field]} alt={label} width={400} height={200}
            className="w-full aspect-video object-cover rounded-xl border border-slate-100" />
          <button onClick={() => setField(field, '')}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#0F5132] hover:bg-slate-50">
          {uploading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : <Upload className="w-6 h-6 text-slate-300" />}
          <span className="text-xs text-slate-400 mt-2">{uploading ? 'Uploading…' : 'Upload image'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, field)} />
        </label>
      )}
    </div>
  );

  const renderFields = () => {
    switch (activeSection) {
      case 'homepage_hero': return (
        <div className="space-y-4">
          <F label="Main Heading"    field="heading"    type="textarea" rows={2} />
          <F label="Sub-heading"     field="subheading" type="textarea" rows={3} />
          <ImgField label="Hero Background Image" field="heroImage" />
          <div className="grid grid-cols-2 gap-4">
            <F label="Primary CTA Text"       field="ctaText"          />
            <F label="Primary CTA Link"       field="ctaLink"          />
            <F label="Secondary CTA Text"     field="ctaSecondaryText" />
            <F label="Secondary CTA Link"     field="ctaSecondaryLink" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase pt-2 pb-1 border-b border-slate-100">Statistics</p>
          <div className="grid grid-cols-2 gap-4">
            <F label="Stat 1 Value"  field="stat1Value"  /><F label="Stat 1 Label" field="stat1Label" />
            <F label="Stat 1 Suffix" field="stat1Suffix" /><F label="Stat 2 Value" field="stat2Value" />
            <F label="Stat 2 Label"  field="stat2Label"  /><F label="Stat 2 Suffix" field="stat2Suffix" />
            <F label="Stat 3 Value"  field="stat3Value"  /><F label="Stat 3 Label" field="stat3Label" />
            <F label="Stat 4 Value"  field="stat4Value"  /><F label="Stat 4 Label" field="stat4Label" />
          </div>
        </div>
      );
      case 'homepage_about': return (
        <div className="space-y-4">
          <F label="Badge Text"  field="badge"       />
          <F label="Heading"     field="heading"     />
          <F label="Description" field="description" type="textarea" />
          <ImgField label="About Section Image" field="image" />
          <div className="grid grid-cols-2 gap-4">
            <F label="Point 1" field="point1" /><F label="Point 2" field="point2" />
            <F label="Point 3" field="point3" /><F label="Point 4" field="point4" />
          </div>
        </div>
      );
      case 'homepage_cta': return (
        <div className="space-y-4">
          <F label="Heading"               field="heading"          type="textarea" rows={2} />
          <F label="Description"           field="description"      type="textarea" />
          <div className="grid grid-cols-2 gap-4">
            <F label="Primary CTA Text"    field="ctaText"          />
            <F label="Primary CTA Link"    field="ctaLink"          />
            <F label="Secondary CTA Text"  field="ctaSecondaryText" />
            <F label="Secondary CTA Link"  field="ctaSecondaryLink" />
          </div>
        </div>
      );
      case 'about_page': return (
        <div className="space-y-4">
          <F label="Page Heading"  field="heading"     />
          <F label="Subtitle"      field="subtitle"    />
          <F label="Description"   field="description" type="textarea" rows={5} />
          <F label="Mission"       field="mission"     type="textarea" />
          <F label="Vision"        field="vision"      type="textarea" />
          <ImgField label="About Hero Image" field="heroImage" />
          <div className="grid grid-cols-2 gap-4">
            <F label="Value 1" field="value1" /><F label="Value 2" field="value2" />
            <F label="Value 3" field="value3" /><F label="Value 4" field="value4" />
          </div>
        </div>
      );
      case 'contact_info': return (
        <div className="space-y-4">
          <F label="Email Address"       field="email"    type="email"  placeholder="sales@umglobalexim.com" />
          <F label="Phone Number"        field="phone"                  placeholder="+91 7304305372" />
          <F label="WhatsApp Number"     field="whatsapp"               placeholder="+91 7304305372" />
          <F label="Office Address"      field="address"  type="textarea" rows={2} />
          <F label="Google Maps Link"    field="mapLink"  type="url" />
          <div className="grid grid-cols-2 gap-4">
            <F label="Instagram URL"     field="instagram" type="url" />
            <F label="LinkedIn URL"      field="linkedin"  type="url" />
            <F label="Twitter / X URL"   field="twitter"   type="url" />
          </div>
        </div>
      );
      case 'global_settings': return (
        <div className="space-y-4">
          <F label="Company Name"        field="companyName"  />
          <F label="Tagline"             field="tagline"      />
          <ImgField label="Company Logo" field="logoUrl" />
          <F label="Default Meta Title"  field="metaTitle"    />
          <F label="Default Meta Description" field="metaDesc" type="textarea" />
        </div>
      );
      case 'footer_content': return (
        <div className="space-y-4">
          <F label="Company Description" field="description"  type="textarea" />
          <F label="Copyright Text"      field="copyright"    />
          <F label="Quick Links (comma-separated labels)" field="quickLinks" />
          <F label="Certification Text"  field="certText"     />
        </div>
      );
      default: return <p className="text-slate-500 text-sm">Select a section to edit.</p>;
    }
  };

  return (
    <AdminShell title="Website Content" subtitle="Edit website sections without changing source code">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-left border-b border-slate-50 last:border-0 transition-colors ${
                  activeSection === s.key
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">
                {SECTIONS.find(s => s.key === activeSection)?.label}
              </h2>
              <button onClick={handleSave} disabled={saving || loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F5132] text-white text-sm font-semibold hover:bg-[#093822] disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

            <div className="p-6">
              {saveMsg && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold mb-4 ${
                  saveMsg.startsWith('Error')
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  {saveMsg.startsWith('Error') ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {saveMsg}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0F5132]" />
                </div>
              ) : renderFields()}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
