import React, { useState, useId } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Navigation,
  PhoneCall,
  MessageSquare,
  AlertCircle,
  Globe
} from 'lucide-react';
import {
  COMPANY_DETAILS,
  POPULAR_CITIES,
  FLEET_DATA,
  getEstimatedDistanceAndHours,
} from '../data/travelData';
import { TripType } from '../types/travel';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onStartBooking: (params: {
    pickup: string;
    drop: string;
    tripType: TripType;
    travelDate: string;
    vehicleId: string;
  }) => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBooking, onOpenChat }) => {
  const { language, setLanguage, t } = useLanguage();
  const pickupListId = useId();
  const dropListId = useId();

  const [activeMode, setActiveMode] = useState<'quick' | 'calculator'>('quick');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSuccess, setCallbackSuccess] = useState<string | null>(null);
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);

  const [tripType, setTripType] = useState<TripType>('one-way');
  const [pickup, setPickup] = useState<string>('Delhi NCR');
  const [drop, setDrop] = useState<string>('Manali');
  const [travelDate, setTravelDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('innova-crysta');

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = callbackPhone.replace(/\D/g, '');
    if (cleanNum.length < 10) return;

    setIsSubmittingCallback(true);
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanNum,
          name: `Quick 1-Tap Request (${selectedVehicleId})`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCallbackSuccess(data.id || 'CB-OK');
        setCallbackPhone('');
      } else {
        setCallbackSuccess('CB-OK');
      }
    } catch {
      setCallbackSuccess('CB-FAST');
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  // Calculate live distance & duration
  const { distanceKm, durationHours } = getEstimatedDistanceAndHours(pickup, drop);
  const selectedVehicle = FLEET_DATA.find((v) => v.id === selectedVehicleId) || FLEET_DATA[0];

  // Calculate estimated base fare
  const effectiveKm = tripType === 'round-trip' ? distanceKm * 2 : distanceKm;
  const billableKm = Math.max(effectiveKm, selectedVehicle.minDailyKm);
  const baseFare = billableKm * selectedVehicle.pricePerKm;
  const tollTaxEstimate = Math.round(distanceKm * 1.1);
  const driverAllowance = tripType === 'round-trip' ? selectedVehicle.driverAllowancePerDay * 2 : selectedVehicle.driverAllowancePerDay;
  const totalEstimatedFare = baseFare + tollTaxEstimate + driverAllowance;

  const handleSwapCities = () => {
    setPickup(drop);
    setDrop(pickup);
  };

  const handleBookNow = () => {
    onStartBooking({
      pickup,
      drop,
      tripType,
      travelDate,
      vehicleId: selectedVehicleId,
    });
  };

  const handleWhatsAppQuickQuote = () => {
    const message = `Hello FirstFly! I need a cab quotation:
• Route: ${pickup} ➔ ${drop}
• Trip Type: ${tripType === 'one-way' ? 'One-Way Outstation' : tripType === 'round-trip' ? 'Round-Trip' : 'Airport / Local'}
• Date: ${travelDate}
• Preferred Vehicle: ${selectedVehicle.name} (${selectedVehicle.seats} Seater)
• Estimated Distance: ${effectiveKm} km
Please send driver assignment and final confirmation.`;
    window.open(`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-6 pb-16 bg-slate-950">
      {/* Background Graphic & Hero Image with cinematic gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero/hero-bg.jpeg"
          alt="FirstFly Luxury Vehicles Across India"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 scale-105 transform motion-safe:animate-pulse-slow"
          onError={(e) => {
            // graceful fallback to high-res automotive night shot if local image fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-blue-600/10 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Badges & Highlights */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/10">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>All-India Tourist Permit • 100% Commercial Yellow Plate Fleet</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-tight sm:leading-none">
            Book Premium Travel Vehicles <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Across All Of India
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Toyota Innova Crysta, Maruti Ertiga, Force Urbania 17-Seater, and Travellers for family
            trips, corporate tours, and airport transfers. Zero surge charges, verified polite drivers, and 24/7 dispatch.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Commercial Plates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>4.9★ Rated (1,850+ Tours)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>Zero Hidden Toll Taxes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Police-Verified Drivers</span>
            </div>
          </div>
        </div>

        {/* ═══ UNIFIED SINGLE BOOKING HUB (ZERO OVERLOAD) ═══ */}
        <div className="max-w-4xl mx-auto bg-slate-900/95 rounded-3xl border-2 border-amber-500/40 shadow-2xl shadow-slate-950/80 p-4 sm:p-6 backdrop-blur-xl relative">
          
          {/* Top Bar with Mode Switcher & Direct In-Box Language Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveMode('quick')}
                className={`flex-1 sm:flex-none py-2 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'quick'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t('quickTab')}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('calculator')}
                className={`flex-1 sm:flex-none py-2 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'calculator'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('calcTab')}</span>
              </button>
            </div>

            {/* Direct Language Switcher (Instant 1-Click English / Hindi) */}
            <div className="flex items-center gap-1.5 bg-slate-950/90 text-white px-3 py-1.5 rounded-2xl border border-slate-800 shadow-sm text-xs shrink-0">
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400 font-semibold mr-0.5">Language:</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label="Switch to English language"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                English
              </button>
              <span className="text-slate-700 font-bold">|</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                aria-label="हिन्दी भाषा चुनें"
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {activeMode === 'quick' ? (
            /* Mode 1: Ultra-simple 1-Tap Booking for anyone */
            <div className="space-y-4">
              <div className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                    {t('heroQuickHeading')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t('heroQuickSub')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('service247')}</span>
                </div>
              </div>

              {/* 3 Clear Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Direct Call */}
                <a
                  href={`tel:${COMPANY_DETAILS.phone}`}
                  aria-label={`Call directly: ${COMPANY_DETAILS.phone}`}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-blue-900/40 to-blue-950/80 border-2 border-blue-600/60 hover:border-blue-400 text-white transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-950/50"
                >
                  <div className="w-11 h-11 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white mb-2 shadow-md shadow-blue-500/30 transition-colors">
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">{t('opt1Tag')}</span>
                  <span className="text-base font-black text-white">{t('opt1Title')}</span>
                  <span className="text-xs text-amber-300 font-bold mt-0.5">{COMPANY_DETAILS.phone}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{t('opt1Sub')}</span>
                </a>

                {/* 2. WhatsApp Booking */}
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
                  <div className="w-11 h-11 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center text-white mb-2 shadow-md shadow-emerald-500/30 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">{t('opt2Tag')}</span>
                  <span className="text-base font-black text-white">{t('opt2Title')}</span>
                  <span className="text-xs text-emerald-300 font-bold mt-0.5">WhatsApp Chat</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{t('opt2Sub')}</span>
                </a>

                {/* 3. 5-Min Callback */}
                <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-950 border-2 border-amber-500/50 text-white">
                  <div className="text-center sm:text-left mb-1.5">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">{t('opt3Tag')}</span>
                    <p className="text-sm font-black text-white">{t('opt3Title')}</p>
                    <p className="text-[10px] text-slate-400">{t('opt3Sub')}</p>
                  </div>

                  {callbackSuccess ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-600/80 text-center animate-fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-emerald-200">
                        {t('callbackRegistered')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setCallbackSuccess(null)}
                        className="mt-1.5 text-[10px] text-slate-400 underline hover:text-white"
                      >
                        {t('enterAnotherNum')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCallbackSubmit} className="space-y-2">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={callbackPhone}
                          onChange={(e) => setCallbackPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9877124650"
                          required
                          aria-label="10-digit mobile number for immediate callback"
                          className="w-full pl-10 pr-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingCallback}
                        className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-slate-950" />
                        <span>{isSubmittingCallback ? t('sending') : t('callMeBtn')}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Quick Vehicle Select Pills */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-amber-400" /> {t('chooseCar')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '4-Seater (Dzire / Etios)', v: 'etios-sedan' },
                    { label: '6-7 Seater (Ertiga Hybrid)', v: 'ertiga-smart-hybrid' },
                    { label: '7-8 Seater (Innova Crysta)', v: 'innova-crysta' },
                    { label: '12-17 Seater (Force Urbania)', v: 'force-urbania-17' },
                  ].map((cab) => (
                    <button
                      key={cab.v}
                      type="button"
                      onClick={() => setSelectedVehicleId(cab.v)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                        selectedVehicleId === cab.v
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {cab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Detailed Fare & Route Calculator */
            <div>
              {/* Trip Type Selector Tabs */}
              <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 max-w-sm mx-auto mb-4">
                <button
                  onClick={() => setTripType('one-way')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    tripType === 'one-way'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  One-Way
                </button>
                <button
                  onClick={() => setTripType('round-trip')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    tripType === 'round-trip'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Round-Trip
                </button>
                <button
                  onClick={() => setTripType('airport')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    tripType === 'airport'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Airport
                </button>
              </div>

              {/* Pickup & Drop Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    list={pickupListId}
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Delhi NCR, Chandigarh..."
                    className="w-full bg-transparent text-sm font-bold text-white placeholder-slate-500 focus:outline-none"
                  />
                  <datalist id={pickupListId}>
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div className="md:col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    className="p-2 rounded-full bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all active:scale-95 cursor-pointer"
                    title="Swap Locations"
                  >
                    <Navigation className="w-3.5 h-3.5 rotate-90" />
                  </button>
                </div>

                <div className="md:col-span-5 bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    Drop Location
                  </label>
                  <input
                    type="text"
                    list={dropListId}
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="e.g. Manali, Shimla, Agra..."
                    className="w-full bg-transparent text-sm font-bold text-white placeholder-slate-500 focus:outline-none"
                  />
                  <datalist id={dropListId}>
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Date & Vehicle Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3">
                <div className="sm:col-span-4 bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>

                <div className="sm:col-span-8 bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3 text-sky-400" /> Select Vehicle
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold">
                      {selectedVehicle.seats} Seats • AC Fleet
                    </span>
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-slate-900 text-xs font-bold text-white border border-slate-700/80 rounded-xl px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {FLEET_DATA.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.seats} Seater)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Distance & Action Bar */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span>
                    Distance: <strong className="text-white font-mono">{effectiveKm} km</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Time: <strong className="text-white">~{durationHours} hrs</strong>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Toll & Fuel Included</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(
                      `Hello FirstFly! I need a cab quotation:\n• Route: ${pickup} ➔ ${drop}\n• Date: ${travelDate}\n• Vehicle: ${selectedVehicle.name}\n• Distance: ~${effectiveKm} km\nPlease share best fare.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Quote</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleBookNow}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
