import React, { useState } from 'react';
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  MessageSquare,
  ArrowUp,
  Lock,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { COMPANY_DETAILS, POPULAR_ROUTES, FLEET_DATA } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';
import { submitInquiry } from '../lib/firebase';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  // Quick Contact Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim() || cleanPhone.length < 10) {
      setErrorMessage('Please provide your name and a valid 10-digit mobile number.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await submitInquiry({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim(),
        message: message.trim() || 'General inquiry submitted via footer contact form.',
        inquiryType: 'general_contact',
      });

      setSuccessMessage(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact form error:', err);
      setErrorMessage(err?.message || 'Failed to submit inquiry to database. Please call directly.');
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Quick Links: Fleet */}
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

          {/* Popular Corridors */}
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

          {/* Direct 24/7 Contacts & Quick Inquiry Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Contact & Inquiry Desk
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`tel:${COMPANY_DETAILS.phone}`}
                    className="font-bold text-white hover:text-amber-400"
                  >
                    {COMPANY_DETAILS.phone}
                  </a>
                  <p className="text-[10px] text-slate-500">24/7 Dispatch Team</p>
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
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-400 text-[11px]">Dispatch Response: &lt; 15 mins</p>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="pt-2">
              <form onSubmit={handleContactSubmit} className="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Quick Message / Inquire
                </span>

                {errorMessage && (
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-[10px]">
                    {errorMessage}
                  </div>
                )}

                {successMessage ? (
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-center text-[11px] text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
                    <p className="font-bold">Inquiry Received!</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">We will call or WhatsApp shortly.</p>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Phone (+91)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-amber-400"
                    />
                    <textarea
                      rows={2}
                      placeholder="Trip requirements / questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Portal Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FirstFly Tours & Travels. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-400 text-[11px]">
              Commercial Tourist Fleet PB 01 B 0051 / PB 01 G 3601
            </span>

            {/* Owner Admin Portal Access Link */}
            <a
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800/80 transition-colors text-[11px] font-semibold"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin Portal</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
