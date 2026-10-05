import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FleetSection } from './components/FleetSection';
import { FleetGallery } from './components/FleetGallery';
import { RouteFareCalculator } from './components/RouteFareCalculator';
import { AirportAndKeralaHub } from './components/AirportAndKeralaHub';
import { TourPackagesSection } from './components/TourPackagesSection';
import { AllIndiaCoverage } from './components/AllIndiaCoverage';
import { SecurityAndSafety } from './components/SecurityAndSafety';
import { ReviewsAndStats } from './components/ReviewsAndStats';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { RealTimeChatWidget } from './components/RealTimeChatWidget';
import { BookingModal } from './components/BookingModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { MessageSquare, Phone, Sparkles } from 'lucide-react';
import { COMPANY_DETAILS } from './data/travelData';
import { TripType, Vehicle, TourPackage } from './types/travel';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onStartBooking={handleStartBooking}
          onOpenChat={() => setIsChatOpen(true)}
        />

        <FleetSection onSelectVehicle={handleSelectVehicle} />

        <FleetGallery onOpenBooking={() => setIsBookingOpen(true)} />

        <RouteFareCalculator onSelectRoute={handleSelectRoute} />

        <AirportAndKeralaHub onSelectCorridor={handleSelectCorridor} />

        <TourPackagesSection onBookPackage={handleBookPackage} />

        <AllIndiaCoverage onSelectCorridor={handleSelectCorridor} />

        <SecurityAndSafety />

        <ReviewsAndStats />

        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* ═══ FLOATING ACTION BUTTONS (Desktop & Tablet only to avoid mobile bar overlap) ═══ */}
      <div className="hidden sm:flex fixed bottom-6 right-6 z-30 flex-col items-end gap-3 pointer-events-auto">
        {/* WhatsApp Quick Link */}
        <a
          href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20would%20like%20to%20book%20a%20cab.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
          title="Direct WhatsApp Dispatch"
        >
          <MessageSquare className="w-6 h-6" />
        </a>

        {/* Real-time AI Concierge / Chat Bubble */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
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
      <RealTimeChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Interactive Multi-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialParams={bookingParams}
      />

      {/* Mobile Sticky Quick Action Bar */}
      <MobileQuickBar
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />
    </div>
  );
}
