import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Menu, X, ShieldCheck, Compass, Car, MapPin, Sparkles, Clock, Globe } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenChat }) => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('navFleet'), href: '#fleet' },
    { name: t('navPackages'), href: '#packages' },
    { name: t('navAirports'), href: '#airports' },
    { name: t('navReviews'), href: '#reviews' },
    { name: t('navFaqs'), href: '#faqs' },
  ];

  return (
    <>
      {/* Top Notification / Trust Bar with Language Switcher */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs font-semibold py-1.5 px-3 sm:px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left Live Status */}
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE FLEET
            </span>
            <span className="hidden md:inline font-medium">
              {t('liveFleet')}
            </span>
            <span className="md:hidden text-[11px] font-medium truncate">
              All-India Tourist Cabs
            </span>
          </div>

          {/* Right Phone & Prominent Language Selector */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] shrink-0">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="hidden sm:flex items-center gap-1 font-bold hover:underline"
            >
              <Phone className="w-3 h-3 text-slate-950" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>

            {/* ═══ CHOOSE LANGUAGE TOGGLE (English / हिन्दी) ═══ */}
            <div className="flex items-center gap-1.5 bg-slate-950 text-white px-2.5 py-1 rounded-full border border-slate-800 shadow-sm font-bold">
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] text-slate-300 font-semibold mr-0.5">Choose Language:</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label="Switch to English language"
                className={`px-2 py-0.5 rounded-full text-[11px] transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <span className="text-slate-600 font-bold">|</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                aria-label="हिन्दी भाषा चुनें"
                className={`px-2 py-0.5 rounded-full text-[11px] transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-panel-elevated py-3 border-b border-slate-800 shadow-xl shadow-slate-950/40'
            : 'bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Compass className="w-6 h-6 text-slate-950 font-black animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                    FIRST<span className="text-amber-400">FLY</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-800/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                    INDIA
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Tours & Travels • All India Cab Fleet
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-amber-400 transition-colors py-1 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-200"></span>
                </a>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 text-amber-300 border border-amber-500/30 hover:bg-slate-800 hover:border-amber-400 transition-all shadow-sm group"
                title="Open 24/7 AI Concierge"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>AI Travel Desk</span>
              </button>

              <a
                href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20would%20like%20to%20inquire%20about%20a%20cab%20booking.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30 hover:border-emerald-400 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <Car className="w-3.5 h-3.5 text-slate-950" />
                <span>Book Vehicle</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onOpenBooking}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 sm:hidden"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel-elevated border-b border-slate-800 px-4 pt-3 pb-6 mt-2 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Language:</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    language === 'en' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    language === 'hi' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-400'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-amber-400 transition-colors border border-slate-800/80"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Car className="w-4 h-4" /> Book Cab / Tour Vehicle Now
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${COMPANY_DETAILS.phone}`}
                  className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" /> Call {COMPANY_DETAILS.phone}
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenChat();
                  }}
                  className="py-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-400 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> 24/7 AI Concierge
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
