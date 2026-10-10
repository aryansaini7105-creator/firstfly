import React, { useState } from 'react';
import { Phone, MessageSquare, CheckCircle2, Sparkles, Car, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';
import { submitInquiry } from '../lib/firebase';

export const EasyBookingBox: React.FC = () => {
  const { language, t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCabType, setSelectedCabType] = useState('7 Seater Innova');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.length < 10) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया सही 10 अंकों का मोबाइल नंबर डालें'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 1. Save directly to Firebase Firestore "inquiries" collection
      const result = await submitInquiry({
        name: `Callback Request (${selectedCabType})`,
        phone: cleanNumber,
        vehicleName: selectedCabType,
        message: `Customer requested instant callback for ${selectedCabType} cab category.`,
        inquiryType: 'callback',
      });

      // 2. Also inform server for WhatsApp dispatch link
      try {
        await fetch('/api/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanNumber,
            name: `Quick Web Request (${selectedCabType})`,
          }),
        });
      } catch {}

      setCallbackSuccess(result.id || 'CB-OK');
      setPhoneNumber('');
    } catch (err: any) {
      console.error('Failed to save callback request to database:', err);
      setErrorMessage(
        err?.message ||
          (language === 'hi'
            ? 'कॉल अनुरोध भेजने में समस्या हुई। कृपया सीधा कॉल करें।'
            : 'Could not submit callback request to database. Please call directly.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4 sm:p-6 rounded-3xl bg-slate-900/95 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 backdrop-blur-md">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('quickTab')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            {t('heroQuickHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('heroQuickSub')}
          </p>
        </div>

        {/* 24x7 Verified Badge */}
        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3.5 py-1.5 rounded-2xl text-emerald-300 text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('service247')}</span>
        </div>
      </div>

      {/* Main 3 Quick Booking Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
        {/* Option 1: Direct Phone Call */}
        <a
          href={`tel:${COMPANY_DETAILS.phone}`}
          aria-label={`Call directly: ${COMPANY_DETAILS.phone}`}
          className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-blue-900/40 to-blue-950/80 border-2 border-blue-600/60 hover:border-blue-400 text-white transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-950/50"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white mb-2 shadow-md shadow-blue-500/30 transition-colors">
            <Phone className="w-6 h-6 animate-bounce" />
          </div>
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">{t('opt1Tag')}</span>
          <span className="text-base sm:text-lg font-black text-white">{t('opt1Title')}</span>
          <span className="text-xs text-amber-300 font-bold mt-0.5">{COMPANY_DETAILS.phone}</span>
          <span className="text-[11px] text-slate-400 mt-1">{t('opt1Sub')}</span>
        </a>

        {/* Option 2: WhatsApp Chat */}
        <a
          href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(
            language === 'hi'
              ? 'नमस्ते FirstFly! मुझे तुरंत टैक्सी / कैब बुक करनी है। कृपया रेट और गाड़ी भेजें।'
              : 'Hello FirstFly! I want to book a taxi/cab. Please share rates and car options.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Book on WhatsApp: ${COMPANY_DETAILS.phone}`}
          className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-emerald-900/40 to-emerald-950/80 border-2 border-emerald-600/60 hover:border-emerald-400 text-white transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-emerald-950/50"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center text-white mb-2 shadow-md shadow-emerald-500/30 transition-colors">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{t('opt2Tag')}</span>
          <span className="text-base sm:text-lg font-black text-white">{t('opt2Title')}</span>
          <span className="text-xs text-emerald-300 font-bold mt-0.5">WhatsApp Chat</span>
          <span className="text-[11px] text-slate-400 mt-1">{t('opt2Sub')}</span>
        </a>

        {/* Option 3: 5-Min Callback */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-950 border-2 border-amber-500/50 text-white">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">{t('opt3Tag')}</span>
            <p className="text-base font-black text-white">{t('opt3Title')}</p>
            <p className="text-[11px] text-slate-300">{t('opt3Sub')}</p>
          </div>

          {callbackSuccess ? (
            <div className="my-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-600 text-center animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-emerald-200">
                {t('callbackRegistered')}
              </p>
              <button
                type="button"
                onClick={() => setCallbackSuccess(null)}
                className="mt-2 text-[11px] text-slate-400 underline hover:text-white"
              >
                {t('enterAnotherNum')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitCallback} className="mt-3 space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9877124650"
                  required
                  aria-label="10-digit mobile number"
                  className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {errorMessage && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Clock className="w-4 h-4 text-slate-950" />
                <span>{isSubmitting ? t('sending') : t('callMeBtn')}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Recommended vehicle selector */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-amber-400" /> {t('chooseCar')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '4-Seater (Dzire / Etios)', value: 'Sedan 4-Seater' },
            { label: '6-7 Seater (Ertiga Hybrid)', value: 'Ertiga 7-Seater' },
            { label: '7-8 Seater (Innova Crysta)', value: '7 Seater Innova' },
            { label: '12-17 Seater (Urbania / Traveller)', value: 'Force Urbania 17' },
          ].map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setSelectedCabType(v.value)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                selectedCabType === v.value
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
