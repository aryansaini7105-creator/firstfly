import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  KeyRound,
  Radio,
  UserCheck,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';

export const SecurityAndSafety: React.FC = () => {
  const { t } = useLanguage();
  const securityPillars = [
    {
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      title: '256-Bit SSL End-to-End Encryption',
      category: 'Cybersecurity Defense',
      desc: 'All customer booking requests, phone numbers, and travel schedules are encrypted using military-grade TLS 1.3 / AES-256 protocols. No eavesdropping or man-in-the-middle attacks.',
    },
    {
      icon: <Server className="w-6 h-6 text-sky-400" />,
      title: 'WAF & Anti-DDoS Rate Limiting',
      category: 'Infrastructure Protection',
      desc: 'Our servers run automated sliding-window rate limiters and payload inspection firewalls to instantly throttle automated scrapers, brute-force bots, and DDoS flooding attempts.',
    },
    {
      icon: <KeyRound className="w-6 h-6 text-emerald-400" />,
      title: 'Anti-Bot Honeypots & Input Sanitization',
      category: 'Data Integrity & Anti-Hack',
      desc: 'All booking forms and chat prompts undergo strict sanitization to strip cross-site scripting (XSS), script injections, and SQL manipulation before entering backend queues.',
    },
    {
      icon: <Radio className="w-6 h-6 text-purple-400" />,
      title: 'Live GPS Family Location Link',
      category: 'Passenger Journey Safety',
      desc: 'Upon trip start, your family receives a secure real-time GPS tracking link. They can monitor the vehicle’s exact highway location, speed, and ETA with zero app installation needed.',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-rose-400" />,
      title: 'Police-Verified Chauffeurs',
      category: 'Driver Credentials',
      desc: 'Every FirstFly driver undergoes background police verification, valid commercial badge certification, driving history audit, and regular health & sobriety checks.',
    },
    {
      icon: <EyeOff className="w-6 h-6 text-indigo-400" />,
      title: 'Zero Third-Party Data Selling',
      category: 'Privacy Guarantee',
      desc: 'Your travel schedule and phone number are strictly confidential. We never sell your details to insurance telemarketers, credit card sellers, or spam networks.',
    },
  ];

  return (
    <section id="safety" className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" /> {t('safetyTag')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
            {t('safetyTitle')}
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            {t('safetySub')}
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {securityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {pillar.category}
                </span>
                <h3 className="text-lg font-bold text-white font-heading mt-1 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active & Enforced 24/7</span>
              </div>
            </div>
          ))}
        </div>

        {/* SOS Emergency Callout Strip */}
        <div className="mt-12 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-heading">
                FirstFly 24/7 Roadside Assistance & SOS Emergency Hotline
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Every vehicle has 24/7 pan-India breakdown replacement coverage. In the rare event of a
                puncture or mechanical delay, our dispatch desk routes a backup vehicle immediately.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs text-center transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Emergency Helpline: {COMPANY_DETAILS.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
