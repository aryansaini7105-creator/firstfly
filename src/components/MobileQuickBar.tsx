import React from 'react';
import { Phone, MessageSquare, Car, Sparkles } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';

interface MobileQuickBarProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onOpenBooking,
  onOpenChat,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 shadow-2xl">
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {/* Call Now */}
        <a
          href={`tel:${COMPANY_DETAILS.phone}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-[10px] font-bold">Call Now</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20want%20to%20inquire%20about%20a%20cab.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 active:scale-95 transition-all"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </a>

        {/* Book Vehicle */}
        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold active:scale-95 transition-all shadow-md shadow-amber-500/20"
        >
          <Car className="w-4 h-4 text-slate-950 mb-0.5" />
          <span className="text-[10px] font-black">Book Cab</span>
        </button>

        {/* AI Travel Desk */}
        <button
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">AI Concierge</span>
        </button>
      </div>
    </div>
  );
};
