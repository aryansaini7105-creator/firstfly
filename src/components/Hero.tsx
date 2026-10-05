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
  AlertCircle
} from 'lucide-react';
import {
  COMPANY_DETAILS,
  POPULAR_CITIES,
  FLEET_DATA,
  getEstimatedDistanceAndHours,
} from '../data/travelData';
import { TripType } from '../types/travel';

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
  const pickupListId = useId();
  const dropListId = useId();

  const [tripType, setTripType] = useState<TripType>('one-way');
  const [pickup, setPickup] = useState<string>('Delhi NCR');
  const [drop, setDrop] = useState<string>('Manali');
  const [travelDate, setTravelDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('innova-crysta');

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

        {/* ═══ LIVE INTERACTIVE FARE & BOOKING ENGINE ═══ */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl shadow-slate-950/80 p-4 sm:p-6 lg:p-8 backdrop-blur-xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] sm:text-xs tracking-wider uppercase px-4 py-1 rounded-full shadow-md shadow-amber-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Instant Live Route & Fare Quotation
          </div>

          {/* Trip Type Selector Tabs */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 max-w-xl mx-auto mb-6">
            <button
              onClick={() => setTripType('one-way')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tripType === 'one-way'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              One-Way Outstation
            </button>
            <button
              onClick={() => setTripType('round-trip')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tripType === 'round-trip'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Round-Trip Tour
            </button>
            <button
              onClick={() => setTripType('airport')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tripType === 'airport'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Airport Transfer
            </button>
          </div>

          {/* Pickup, Drop & Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Pickup City */}
            <div className="md:col-span-5 bg-slate-950/80 rounded-2xl p-3 border border-slate-800 focus-within:border-amber-500/60 transition-colors">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Pickup Location
              </label>
              <input
                type="text"
                list={pickupListId}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="e.g. Chandigarh, Delhi NCR, Mohali..."
                className="w-full bg-transparent text-sm sm:text-base font-bold text-white placeholder-slate-500 focus:outline-none"
              />
              <datalist id={pickupListId}>
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <div className="flex items-center gap-1 mt-1.5 overflow-x-auto scrollbar-none text-[10px]">
                <span className="text-slate-500">Quick:</span>
                {['Chandigarh', 'Delhi NCR', 'Mohali'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setPickup(city)}
                    className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors whitespace-nowrap"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="button"
                onClick={handleSwapCities}
                className="p-2.5 rounded-full bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-white border border-slate-700 shadow-md transition-all active:scale-95"
                title="Swap Locations"
              >
                <Navigation className="w-4 h-4 rotate-90" />
              </button>
            </div>

            {/* Drop City */}
            <div className="md:col-span-5 bg-slate-950/80 rounded-2xl p-3 border border-slate-800 focus-within:border-amber-500/60 transition-colors">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Drop Location / Destination
              </label>
              <input
                type="text"
                list={dropListId}
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                placeholder="e.g. Manali, Shimla, Rishikesh..."
                className="w-full bg-transparent text-sm sm:text-base font-bold text-white placeholder-slate-500 focus:outline-none"
              />
              <datalist id={dropListId}>
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <div className="flex items-center gap-1 mt-1.5 overflow-x-auto scrollbar-none text-[10px]">
                <span className="text-slate-500">Quick:</span>
                {['Manali', 'Shimla', 'Rishikesh', 'Jaipur', 'Amritsar'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDrop(city)}
                    className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors whitespace-nowrap"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date & Vehicle Selectors Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 mt-4">
            {/* Travel Date */}
            <div className="sm:col-span-4 bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none [color-scheme:dark]"
              />
            </div>

            {/* Vehicle Model Selector */}
            <div className="sm:col-span-8 bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-sky-400" /> Select Vehicle
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  {selectedVehicle.seats} Seats • ₹{selectedVehicle.pricePerKm}/km
                </span>
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-900 text-sm font-bold text-white border border-slate-700/80 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
              >
                {FLEET_DATA.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.seats} Seater {v.category.toUpperCase()}) — ₹{v.pricePerKm}/km
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ═══ LIVE QUOTE PREVIEW BAR ═══ */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>
                  Estimated Distance: <strong className="text-white">{effectiveKm} km</strong>
                </span>
              </div>
              <div className="hidden sm:inline text-slate-700">|</div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>
                  Travel Time: <strong className="text-white">~{durationHours} Hours</strong>
                </span>
              </div>
              <div className="hidden sm:inline text-slate-700">|</div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Driver Included</span>
              </div>
            </div>

            {/* Estimated Total Price & CTA */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="text-left md:text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Estimated Total Fare
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-heading">
                    ₹{totalEstimatedFare.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">approx.</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppQuickQuote}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                  title="Direct WhatsApp Quote"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Confirm Booking</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Route Suggestions */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Popular Runs:</span>
            {[
              { from: 'Delhi NCR', to: 'Manali', v: 'innova-crysta' },
              { from: 'Chandigarh', to: 'Shimla', v: 'ertiga-smart-hybrid' },
              { from: 'Delhi NCR', to: 'Chandigarh', v: 'maruti-dzire' },
              { from: 'Delhi NCR', to: 'Rishikesh', v: 'ertiga-smart-hybrid' },
              { from: 'Chandigarh', to: 'Amritsar', v: 'innova-crysta' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPickup(p.from);
                  setDrop(p.to);
                  setSelectedVehicleId(p.v);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors border border-slate-700/50"
              >
                {p.from} ➔ {p.to}
              </button>
            ))}
          </div>
        </div>

        {/* User Authentic Car Showcase Highlight Strip */}
        <div className="mt-10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-slate-800">
            <img
              src="/vehicles/innova-0.jpeg"
              alt="Innova Crysta Yellow Plate"
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/30"
            />
            <div>
              <p className="text-xs font-bold text-white">Toyota Innova Crysta</p>
              <p className="text-[10px] text-amber-400 font-semibold">Reg: PB 01 B 0051</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-slate-800">
            <img
              src="/vehicles/ertiga-0.jpeg"
              alt="Maruti Ertiga Yellow Plate"
              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30"
            />
            <div>
              <p className="text-xs font-bold text-white">Maruti Ertiga Hybrid</p>
              <p className="text-[10px] text-emerald-400 font-semibold">Reg: PB 01 G 3601</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-slate-800">
            <img
              src="/vehicles/urbania-0.jpeg"
              alt="Force Urbania 17 Seater"
              className="w-12 h-12 rounded-xl object-cover border border-sky-500/30"
            />
            <div>
              <p className="text-xs font-bold text-white">Force Urbania (17)</p>
              <p className="text-[10px] text-sky-400 font-semibold">VIP Recliner Van</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              24/7
            </div>
            <div>
              <p className="text-xs font-bold text-white">24/7 Dispatch Desk</p>
              <p className="text-[10px] text-slate-400 font-semibold">+91 98771 24650</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
