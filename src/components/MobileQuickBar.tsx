import React from 'react';
import { Phone, MessageSquare, Car, Sparkles } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';

interface MobileQuickBarProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onOpenBooking,
  onOpenChat,
}) => {
  const { language, t } = useLanguage();

  return (
    <nav
      aria-label="Mobile Quick Actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 shadow-2xl pb-safe"
    >
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {/* Call Now */}
        <a
          href={`tel:${COMPANY_DETAILS.phone}`}
          aria-label={`Direct Phone Call: ${COMPANY_DETAILS.phone}`}
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-blue-950/70 border border-blue-700/60 text-white hover:bg-blue-900 active:scale-95 transition-all shadow-sm"
        >
          <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-xs font-bold leading-tight">{t('mbCall')}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(
            language === 'hi'
              ? 'नमस्ते FirstFly! मुझे तुरंत टैक्सी / कैब बुक करनी है।'
              : 'Hello FirstFly! I want to book a taxi/cab. Please share rates and car options.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 active:scale-95 transition-all shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span className="text-xs font-bold leading-tight">{t('mbWhatsApp')}</span>
        </a>

        {/* Book Vehicle */}
        <button
          type="button"
          onClick={onOpenBooking}
          aria-label="Book Cab or Check Fare"
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black active:scale-95 transition-all shadow-md shadow-amber-500/20"
        >
          <Car className="w-4 h-4 text-slate-950 mb-0.5" />
          <span className="text-xs font-black leading-tight">{t('mbBook')}</span>
        </button>

        {/* 24/7 Desk */}
        <button
          type="button"
          onClick={onOpenChat}
          aria-label="24/7 Travel Desk"
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-xs font-bold leading-tight">{t('mbAI')}</span>
        </button>
      </div>
    </nav>
  );
};
