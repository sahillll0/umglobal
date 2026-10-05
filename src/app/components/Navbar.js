'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import {
  Globe,
  ChevronDown,
  Search,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
  Flame,
  Sun,
  Wheat,
  Sprout,
  Apple,
  PhoneCall,
  Mail,
  CheckCircle2,
  Award,
  PackageCheck
} from 'lucide-react';

// Product Categories for the Mega Dropdown
const PRODUCT_CATEGORIES = [
  {
    id: 'spices',
    title: 'Spices',
    href: '/products/spices',
    icon: Flame,
    
    description: 'Authentic Indian whole & ground spices processed with high curcumin & aroma retention.',
    items: [
      'Turmeric (High Curcumin)',
      'Red Chili (Teja & S17)',
      'Green Cardamom (8mm+)',
      'Black Pepper & Cumin Seeds'
    ]
  },
  {
    id: 'dehydrated',
    title: 'Dehydrated Products',
    href: '/products/dehydrated-products',
    icon: Sun,
    badge: 'Export Standard',
    description: 'Premium quality dehydrated onion, garlic, and vegetable powders with low moisture.',
    items: [
      'White Onion Flakes',
      'Garlic Granules & Powder',
      'Dehydrated Tomato Powder',
      'Toasted Onion Powder'
    ]
  },
  {
    id: 'pulses',
    title: 'Pulses',
    href: '/products/pulses',
    icon: Wheat,
    badge: 'Sortex Cleaned',
    description: 'Nutrient-rich legumes and pulses machine cleaned and sorted for export.',
    items: [
      'Kabuli Chickpeas (40-42 to 75-80)',
      'Red Split Lentils (Masoor)',
      'Moong Dal (Whole & Split)',
      'Desi Chickpeas & Toor Dal'
    ]
  },
  {
    id: 'millets',
    title: 'Millets',
    href: '/products/millets',
    icon: Sprout,
    badge: 'Superfood',
    description: 'Sustainably sourced gluten-free millets packed with essential minerals & fiber.',
    items: [
      'Sorghum (Jowar Grains)',
      'Pearl Millet (Bajra)',
      'Finger Millet (Ragi)',
      'Foxtail & Barnyard Millet'
    ]
  },
  {
    id: 'fresh-produce',
    title: 'Fresh Produce',
    href: '/products/fresh-produce',
    icon: Apple,
    badge: 'Cold-Chain Ready',
    description: 'Hand-picked fresh agricultural produce packaged for long sea & air transit.',
    items: [
      'Fresh Red ',
      'Fresh Potatoes (Jyoti/LR)',
      'Fresh Table Grapes (Nashik)',
      'Bhagwa Pomegranates'
    ]
  },
  {
    id: 'packaging',
    title: 'Packaging Solutions',
    href: '/products/packaging',
    icon: PackageCheck,
    badge: 'Custom Export Packaging',
    description: 'We offer customized packaging solutions according to buyer requirements.',
    items: [
      'Retail & Bulk Packaging',
      'Private Label Packaging',
      'Container Load Shipments',
      'Air & Sea Freight Solutions'
    ]
  }
];

// Main Navigation Items
const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products', isMega: true },
  { name: 'Quality', href: '/quality-assurance' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Logistics', href: '/packaging-logistics' },
  { name: 'Export Markets', href: '/export-markets' },
  { name: 'Contact', href: '/contact' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownTimeoutRef = useRef(null);

  // Quote form state
  const [quoteFormData, setQuoteFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: 'Spices',
    quantity: '',
    message: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [isQuoteSubmitting, setIsQuoteSubmitting] = useState(false);
  const [quoteErrorMessage, setQuoteErrorMessage] = useState('');

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu or modal is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen || isQuoteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen, isSearchOpen, isQuoteModalOpen]);

  // Handle ESC key press to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsQuoteModalOpen(false);
        setIsMegaMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse hover handlers for Desktop Mega Menu with smooth delay
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  // Check active link helper
  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Handle quote submission to Resend API
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsQuoteSubmitting(true);
    setQuoteErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quoteFormData,
          formType: 'quote'
        })
      });

      const data = await response.json();

      if (data.success) {
        setQuoteSubmitted(true);
        setTimeout(() => {
          setQuoteSubmitted(false);
          setIsQuoteModalOpen(false);
          setQuoteFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            product: 'Spices',
            quantity: '',
            message: ''
          });
        }, 3000);
      } else {
        setQuoteErrorMessage(data.error || 'Failed to submit quote inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Quote submit error:', err);
      setQuoteErrorMessage('Network error occurred. Please check your internet connection.');
    } finally {
      setIsQuoteSubmitting(false);
    }
  };

  // Filtered search products
  const filteredProducts = PRODUCT_CATEGORIES.flatMap(cat => 
    cat.items.map(item => ({ name: item, category: cat.title, href: cat.href }))
  ).filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* Top Bar for Trust & Global Trade Info */}
      <div className="bg-[#072718] text-white text-xs py-2 border-b border-emerald-800/40 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-emerald-200">
              <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Leading Government Recognized Export House (India)</span>
            </span>
            {/* <span className="text-emerald-500/60">•</span> */}
            {/* <span className="flex items-center space-x-1.5 text-emerald-100">
              <Award className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Premium Quality Products</span>
            </span> */}
          </div>

          <div className="flex items-center space-x-6">
            <a 
              href="mailto:sales@umglobalexim.com" 
              className="flex items-center space-x-1.5 text-emerald-200 hover:text-[#C9A227] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>+91 7304305372</span>
            </a>
            <span className="text-emerald-500/60">•</span>
            <a 
              href="mailto:sales@umglobalexim.com" 
              className="flex items-center space-x-1.5 text-emerald-200 hover:text-[#C9A227] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>sales@umglobalexim.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Component - Deep Forest Green (#0F5132) */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 h-[80px] flex items-center shadow-lg ${
          isScrolled
            ? 'bg-[#093822]/98 backdrop-blur-md border-b border-emerald-800/60 shadow-2xl'
            : 'bg-[#0F5132]/95 backdrop-blur-md border-b border-emerald-800/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logo */}
            <Link 
              href="/" 
              className="group focus:outline-none focus:ring-2 focus:ring-[#C9A227] rounded-xl p-1 -ml-1 transition-all shrink-0"
              aria-label="UM Global Exim Home Page"
            >
              <Logo variant="default" size="md" />
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);

                if (item.isMega) {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                        onFocus={handleMouseEnter}
                        aria-expanded={isMegaMenuOpen}
                        aria-haspopup="true"
                        className={`relative px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer focus:outline-none whitespace-nowrap ${
                          active || isMegaMenuOpen
                            ? 'text-white font-bold bg-white/10'
                            : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#C9A227] transition-transform duration-200 ${
                            isMegaMenuOpen ? 'rotate-180' : ''
                          }`}
                        />

                        {/* Gold underline animation for Active Menu */}
                        {active && (
                          <motion.span
                            layoutId="activeGoldUnderline"
                            className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#C9A227] rounded-full shadow-sm"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Desktop Mega Dropdown Menu (White Background with Green Headings & Gold Accents) */}
                      <AnimatePresence>
                        {isMegaMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[880px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-50 text-slate-800"
                          >
                            <div className="grid grid-cols-12 gap-6">
                              {/* Left Columns: Categories */}
                              <div className="col-span-8 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <span className="text-[11px] font-extrabold tracking-wider text-[#0F5132] uppercase">
                                    Export Product Divisions
                                  </span>
                                  <span className="text-[10px] font-medium text-slate-400">
                                    Select a category to view varieties & specs
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3.5">
                                {PRODUCT_CATEGORIES.map((cat) => {
                                  const IconComponent = cat.icon;
                                  return (
                                    <Link
                                      key={cat.id}
                                      href={cat.href}
                                      onClick={() => setIsMegaMenuOpen(false)}
                                      className="group/item p-3.5 rounded-xl hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                          <div className="flex items-center space-x-2">
                                            <div className="p-2 rounded-lg bg-emerald-100 text-[#0F5132] group-hover/item:bg-[#0F5132] group-hover/item:text-white transition-colors duration-200">
                                              <IconComponent className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-extrabold text-[#0F5132] group-hover/item:text-[#093822] transition-colors">
                                              {cat.title}
                                            </h3>
                                          </div>
                                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-[#C9A227] border border-amber-200">
                                            {cat.badge}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
                                          {cat.description}
                                        </p>
                                      </div>

                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {cat.items.slice(0, 2).map((sub, idx) => (
                                          <span
                                            key={idx}
                                            className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded group-hover/item:bg-white group-hover/item:text-[#0F5132] transition-colors"
                                          >
                                            {sub}
                                          </span>
                                        ))}
                                      </div>
                                    </Link>
                                  );
                                })}
                                </div>
                              </div>

                              {/* Right Column: Featured Banner */}
                              <div className="col-span-4 bg-gradient-to-br from-[#0F5132] to-[#093822] rounded-xl p-5 text-white flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                                  <Globe className="w-40 h-40 text-white" />
                                </div>

                                <div>
                                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                                    <span>2026 Export Catalog</span>
                                  </div>
                                  <h4 className="text-base font-bold text-white mb-2 leading-snug">
                                    Direct Indian Farm Sourcing
                                  </h4>
                                  <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
                                    Customized private labeling, moisture-controlled vacuum packaging & FOB/CIF terms.
                                  </p>
                                </div>

                                <div>
                                  <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center text-[11px] text-emerald-200">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] mr-1.5 shrink-0" />
                                      <span>100% Quality Tested Batch Lots</span>
                                    </div>
                                    <div className="flex items-center text-[11px] text-emerald-200">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] mr-1.5 shrink-0" />
                                      <span>Worldwide Logistics & Clearance</span>
                                    </div>
                                  </div>

                                  <Link
                                    href="/products"
                                    onClick={() => setIsMegaMenuOpen(false)}
                                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#C9A227] text-[#093822] font-bold text-xs hover:bg-white hover:text-[#0F5132] transition-colors shadow-md group"
                                  >
                                    <span>View All 5 Categories</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none whitespace-nowrap ${
                      active
                        ? 'text-white font-bold bg-white/10'
                        : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.name}</span>

                    {/* Gold underline animation for Active Menu */}
                    {active && (
                      <motion.span
                        layoutId="activeGoldUnderline"
                        className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#C9A227] rounded-full shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search Pill + Gold CTA Button + Mobile Toggle) */}
            <div className="flex items-center gap-2.5">
              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-all focus:outline-none border border-emerald-700/50 bg-white/5 group"
                aria-label="Search Products & Categories"
              >
                <Search className="w-4 h-4 text-[#C9A227] group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-xs font-medium text-emerald-100/90">Search</span>
              </button>

              {/* CTA Button: Gold Background (#C9A227) with Dark Green text */}
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#e0b428] text-[#093822] text-sm font-extrabold shadow-md hover:from-white hover:to-white hover:text-[#0F5132] transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap group shrink-0"
              >
                <FileText className="w-4 h-4 text-[#093822] group-hover:text-[#0F5132] transition-colors" />
                <span>Request Quote</span>
                <ArrowRight className="w-4 h-4 text-[#093822] group-hover:text-[#0F5132] group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle Mobile Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#C9A227]" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation - Dark Green Background (#093822) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative ml-auto w-full max-w-sm bg-[#093822] text-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-l border-emerald-800/60"
            >
              <div>
                {/* Mobile Drawer Header */}
                <div className="p-4 border-b border-emerald-800/60 flex items-center justify-between bg-[#072718]">
                  <Link 
                    href="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group"
                  >
                    <Logo variant="default" size="sm" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5 text-[#C9A227]" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="p-4 space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);

                    if (item.isMega) {
                      return (
                        <div key={item.name} className="border-b border-emerald-800/40 py-1">
                          <button
                            type="button"
                            onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold text-white hover:bg-white/10"
                          >
                            <span className="flex items-center space-x-2">
                              <span>Products</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A227] text-[#093822] font-bold">
                                5 Categories
                              </span>
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-[#C9A227] transition-transform duration-200 ${
                                mobileProductsOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {mobileProductsOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-4 pr-2 space-y-1 my-1"
                              >
                                {PRODUCT_CATEGORIES.map((cat) => {
                                  const IconComponent = cat.icon;
                                  return (
                                    <Link
                                      key={cat.id}
                                      href={cat.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="flex items-center justify-between p-2.5 rounded-lg text-sm text-emerald-100 hover:bg-[#0F5132] hover:text-[#C9A227] transition-colors"
                                    >
                                      <div className="flex items-center space-x-2.5">
                                        <div className="p-1.5 rounded-md bg-white/10 text-[#C9A227]">
                                          <IconComponent className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium">{cat.title}</span>
                                      </div>
                                      <span className="text-[10px] text-[#093822] bg-[#C9A227] px-2 py-0.5 rounded font-bold">
                                        {cat.badge}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                          active
                            ? 'bg-[#0F5132] text-[#C9A227] font-bold border-l-4 border-[#C9A227]'
                            : 'text-white hover:bg-white/10 hover:text-[#C9A227]'
                        }`}
                      >
                        <span>{item.name}</span>
                        {active && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Drawer Footer CTA */}
              <div className="p-4 border-t border-emerald-800/60 bg-[#072718] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsQuoteModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-[#C9A227] text-[#093822] font-extrabold text-sm shadow-md hover:bg-white transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#093822]" />
                  <span>Request Export Quote</span>
                </button>

                <div className="pt-2 text-xs text-emerald-200 space-y-1 text-center">
                  <p className="flex items-center justify-center space-x-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Worldwide Export Solutions from India</span>
                  </p>
                  <p className="text-[11px] text-emerald-400/80">Government Registered Export House</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50">
                <Search className="w-5 h-5 text-[#0F5132] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agricultural products (e.g. Turmeric, Chickpeas, Garlic)..."
                  className="w-full bg-transparent text-slate-800 text-base placeholder-slate-400 focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                {searchQuery ? (
                  filteredProducts.length > 0 ? (
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Products & Varieties ({filteredProducts.length})
                      </div>
                      <div className="space-y-1">
                        {filteredProducts.map((p, index) => (
                          <Link
                            key={index}
                            href={p.href}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0F5132] flex items-center justify-center font-bold text-xs">
                                {p.category.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#0F5132]">
                                  {p.name}
                                </h4>
                                <span className="text-xs text-slate-500">{p.category}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#C9A227] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p className="text-sm">No products found matching &quot;{searchQuery}&quot;</p>
                      <p className="text-xs text-slate-400 mt-1">Try searching for Spices, Chickpeas, Garlic Flakes, or Millets.</p>
                    </div>
                  )
                ) : (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Popular Export Categories
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCT_CATEGORIES.map((cat) => {
                        const IconComp = cat.icon;
                        return (
                          <Link
                            key={cat.id}
                            href={cat.href}
                            onClick={() => setIsSearchOpen(false)}
                            className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 flex items-center space-x-3 transition-all"
                          >
                            <div className="p-2 rounded-lg bg-emerald-100 text-[#0F5132]">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">{cat.title}</div>
                              <div className="text-[10px] text-slate-500">{cat.items.length} items</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Request Quote Modal Drawer */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuoteModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100"
            >
              <div className="bg-gradient-to-r from-[#0F5132] to-[#093822] p-6 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
                    <h3 className="text-lg font-bold">Request Official B2B Quote</h3>
                  </div>
                  <p className="text-xs text-emerald-100 mt-1">
                    Get FOB/CIF pricing, specs & sample kit info directly from our export team.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {quoteSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F5132] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-[#0F5132]" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">Quote Request Submitted!</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Thank you for reaching out to UM Global Exim. Our international export manager will email your customized pricing & specs within 12 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteFormData.name}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteFormData.company}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, company: e.target.value })}
                          placeholder="Global Imports LLC"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
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
                          value={quoteFormData.email}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                          placeholder="buyer@company.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={quoteFormData.phone}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                          placeholder="Your Phone Number"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Product Category *
                        </label>
                        <select
                          value={quoteFormData.product}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, product: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132] bg-white"
                        >
                          {PRODUCT_CATEGORIES.map(c => (
                            <option key={c.id} value={c.title}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Estimated Quantity (Metric Tons)
                        </label>
                        <input
                          type="text"
                          value={quoteFormData.quantity}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, quantity: e.target.value })}
                          placeholder="e.g. 24 MT (1x20' FCL)"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Specific Requirements / Destination Port
                      </label>
                      <textarea
                        rows={3}
                        value={quoteFormData.message}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, message: e.target.value })}
                        placeholder="Mention required grade, moisture content, packaging preference, and port of destination..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>

                    {quoteErrorMessage && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                        {quoteErrorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isQuoteSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[#0F5132] text-white font-bold text-sm hover:bg-[#093822] disabled:opacity-70 transition-colors shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {isQuoteSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Inquiry to Export Desk...</span>
                        </div>
                      ) : (
                        <>
                          <span>Submit Inquiry to Export Desk</span>
                          <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
