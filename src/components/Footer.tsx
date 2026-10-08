import React from 'react';
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  MessageSquare,
  ArrowUp
} from 'lucide-react';
import { COMPANY_DETAILS, POPULAR_ROUTES, FLEET_DATA } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                <Compass className="w-6 h-6 font-black" />
              </div>
              <span className="text-2xl font-black text-white font-heading tracking-tight">
                FIRST<span className="text-amber-400">FLY</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footerAbout')}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={`tel:${COMPANY_DETAILS.phone}`}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-colors"
                title="Call 24/7 Helpline"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20would%20like%20to%20inquire%20about%20a%20cab%20booking.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 transition-colors"
                title="WhatsApp Dispatch"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${COMPANY_DETAILS.email}`}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 transition-colors"
                title="Email Desk"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Commercial Yellow-Plate Vehicles</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Our Fleet
            </h4>
            <ul className="space-y-2 text-xs">
              {FLEET_DATA.map((v) => (
                <li key={v.id}>
                  <a href="#fleet" className="hover:text-amber-400 transition-colors">
                    {v.name} ({v.seats} Seater)
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tourist Corridors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-xs">
              {POPULAR_ROUTES.slice(0, 6).map((r) => (
                <li key={r.id}>
                  <a href="#calculator" className="hover:text-amber-400 transition-colors">
                    {r.from} ➔ {r.to}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct 24/7 Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              24/7 Dispatch Desk
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`tel:${COMPANY_DETAILS.phone}`}
                    className="font-bold text-white hover:text-amber-400"
                  >
                    {COMPANY_DETAILS.phone}
                  </a>
                  <p className="text-[10px] text-slate-500">24 Hours / 7 Days</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`mailto:${COMPANY_DETAILS.email}`}
                    className="text-slate-300 hover:text-amber-400 break-all"
                  >
                    {COMPANY_DETAILS.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-slate-400 text-[11px] leading-snug">
                  Punjab, Chandigarh, Delhi NCR & All-India Highway Network
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-400 text-[11px]">Instant Dispatch: &lt; 15 mins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FirstFly Tours & Travels. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Commercial Tourist Fleet PB 01 B 0051 / PB 01 G 3601
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
