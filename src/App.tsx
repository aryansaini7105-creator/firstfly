import React, { useState, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MobileQuickBar } from './components/MobileQuickBar';
import { MessageSquare, Phone, Sparkles } from 'lucide-react';
import { COMPANY_DETAILS } from './data/travelData';
import { TripType, Vehicle, TourPackage } from './types/travel';
import { LanguageProvider } from './context/LanguageContext';

// Lazy loaded below-the-fold and modal components for ultra-fast Mobile PageSpeed
const FleetSection = lazy(() => import('./components/FleetSection').then(m => ({ default: m.FleetSection })));
const TourPackagesSection = lazy(() => import('./components/TourPackagesSection').then(m => ({ default: m.TourPackagesSection })));
const AirportAndKeralaHub = lazy(() => import('./components/AirportAndKeralaHub').then(m => ({ default: m.AirportAndKeralaHub })));
const SecurityAndSafety = lazy(() => import('./components/SecurityAndSafety').then(m => ({ default: m.SecurityAndSafety })));
const ReviewsAndStats = lazy(() => import('./components/ReviewsAndStats').then(m => ({ default: m.ReviewsAndStats })));
const FAQSection = lazy(() => import('./components/FAQSection').then(m => ({ default: m.FAQSection })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const BookingModal = lazy(() => import('./components/BookingModal').then(m => ({ default: m.BookingModal })));
const RealTimeChatWidget = lazy(() => import('./components/RealTimeChatWidget').then(m => ({ default: m.RealTimeChatWidget })));

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bookingParams, setBookingParams] = useState<{
    pickup?: string;
    drop?: string;
    tripType?: TripType;
    travelDate?: string;
    vehicleId?: string;
  }>({});

  const handleStartBooking = (params: {
    pickup: string;
    drop: string;
    tripType: TripType;
    travelDate: string;
    vehicleId: string;
  }) => {
    setBookingParams(params);
    setIsBookingOpen(true);
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setBookingParams((prev) => ({
      ...prev,
      vehicleId: vehicle.id,
    }));
    setIsBookingOpen(true);
  };

  const handleSelectRoute = (from: string, to: string, vehicleId: string) => {
    setBookingParams({
      pickup: from,
      drop: to,
      vehicleId,
      tripType: 'one-way',
    });
    setIsBookingOpen(true);
  };

  const handleBookPackage = (pkg: TourPackage) => {
    setBookingParams({
      pickup: 'Chandigarh / Delhi NCR',
      drop: pkg.destination,
      tripType: 'round-trip',
    });
    setIsBookingOpen(true);
  };

  const handleSelectCorridor = (pickup: string, drop: string) => {
    setBookingParams({
      pickup,
      drop,
      tripType: 'one-way',
    });
    setIsBookingOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
        {/* Top Navbar */}
        <Navbar
          onOpenBooking={() => setIsBookingOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Main Content Sections (Clean, uncluttered, top performance) */}
        <main className="flex-1">
          <Hero
            onStartBooking={handleStartBooking}
            onOpenChat={() => setIsChatOpen(true)}
          />

          <Suspense fallback={<div className="h-40 flex items-center justify-center text-slate-600 text-xs">Loading fleet...</div>}>
            <FleetSection onSelectVehicle={handleSelectVehicle} />
            <TourPackagesSection onBookPackage={handleBookPackage} />
            <AirportAndKeralaHub onSelectCorridor={handleSelectCorridor} />
            <SecurityAndSafety />
            <ReviewsAndStats />
            <FAQSection />
            <Footer />
          </Suspense>
        </main>

        {/* ═══ FLOATING ACTION BUTTONS (Desktop & Tablet only to avoid mobile bar overlap) ═══ */}
        <div className="hidden sm:flex fixed bottom-6 right-6 z-30 flex-col items-end gap-3 pointer-events-auto">
          {/* Direct Call Button */}
          <a
            href={`tel:${COMPANY_DETAILS.phone}`}
            aria-label={`Call FirstFly Dispatch Directly at ${COMPANY_DETAILS.phone}`}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
            title={`Call Us Directly: ${COMPANY_DETAILS.phone}`}
          >
            <Phone className="w-5 h-5" />
          </a>

          {/* WhatsApp Quick Link */}
          <a
            href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20would%20like%20to%20book%20a%20cab.`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp Dispatch with FirstFly Travels"
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            title="Direct WhatsApp Dispatch"
          >
            <MessageSquare className="w-6 h-6" />
          </a>

          {/* Real-time AI Concierge / Chat Bubble */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              aria-label="Chat with 24/7 AI Travel Concierge"
              className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
              title="Chat with 24/7 AI Travel Concierge"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
              </span>

              <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">24/7 AI Travel Concierge</span>
              <span className="sm:hidden">Chat</span>
            </button>
          )}
        </div>

        {/* Integrated Real-Time Chat Widget Modal / Drawer */}
        {isChatOpen && (
          <Suspense fallback={null}>
            <RealTimeChatWidget
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              onOpenBooking={() => setIsBookingOpen(true)}
            />
          </Suspense>
        )}

        {/* Interactive Multi-Step Booking Modal */}
        {isBookingOpen && (
          <Suspense fallback={null}>
            <BookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              initialParams={bookingParams}
            />
          </Suspense>
        )}

        {/* Mobile Sticky Quick Action Bar */}
        <MobileQuickBar
          onOpenBooking={() => setIsBookingOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
        />
      </div>
    </LanguageProvider>
  );
}
