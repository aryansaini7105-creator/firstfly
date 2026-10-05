import React, { useState } from 'react';
import {
  Calculator,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Car,
  Clock,
  Navigation,
  FileText
} from 'lucide-react';
import { POPULAR_ROUTES, FLEET_DATA, COMPANY_DETAILS } from '../data/travelData';
import { RoutePreset, Vehicle } from '../types/travel';

interface RouteFareCalculatorProps {
  onSelectRoute: (from: string, to: string, vehicleId: string) => void;
}

export const RouteFareCalculator: React.FC<RouteFareCalculatorProps> = ({ onSelectRoute }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(POPULAR_ROUTES[0].id);
  const [customDistanceKm, setCustomDistanceKm] = useState<number>(POPULAR_ROUTES[0].distanceKm);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'popular' | 'custom'>('popular');

  const activeRoute = POPULAR_ROUTES.find((r) => r.id === selectedRouteId) || POPULAR_ROUTES[0];
  const activeDistance = activeTab === 'popular' ? activeRoute.distanceKm : customDistanceKm;
  const totalBilledKm = isRoundTrip ? activeDistance * 2 : activeDistance;

  const handleRoutePresetClick = (route: RoutePreset) => {
    setSelectedRouteId(route.id);
    setCustomDistanceKm(route.distanceKm);
  };

  return (
    <section id="calculator" className="py-20 bg-slate-950/90 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" /> All-India Route Explorer & Vehicle Matching
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
            Explore Routes & Choose Your Vehicle
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            No surprise surge pricing. No driver cancellation drama. See exact distance, highway
            details, and vehicle features tailored for your destination.
          </p>
        </div>

        {/* Interactive Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'popular'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Popular Tourist Corridors
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'custom'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Distance Simulator
            </button>
          </div>
        </div>

        {/* Content depending on tab */}
        {activeTab === 'popular' ? (
          /* Popular Corridors Quick Buttons */
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={route.id}
                  onClick={() => handleRoutePresetClick(route)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer active:scale-95 ${
                    selectedRouteId === route.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <p className="text-xs font-bold truncate">
                    {route.from} ➔ {route.to}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{route.distanceKm} km</span>
                    <span className="text-amber-400 font-semibold">~{route.durationHours} hrs</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Route Detail Card */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    {activeRoute.from} to {activeRoute.to} ({activeRoute.category})
                  </p>
                  <p className="text-slate-400 text-xs">
                    Highway: <span className="text-slate-300 font-medium">{activeRoute.highwayName}</span> • Toll & Taxes: <span className="text-emerald-400 font-medium">All-Inclusive Transparent Quote</span>
                  </p>
                </div>
              </div>

              {/* Round trip toggle */}
              <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-xs font-medium">Trip Mode:</span>
                <button
                  onClick={() => setIsRoundTrip(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    !isRoundTrip ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  One-Way ({activeDistance} km)
                </button>
                <button
                  onClick={() => setIsRoundTrip(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isRoundTrip ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Round-Trip ({activeDistance * 2} km)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Custom Distance Simulator */
          <div className="max-w-2xl mx-auto mb-10 p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Total Route Distance:
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-400 font-heading">
                  {customDistanceKm}
                </span>
                <span className="text-xs text-slate-400">Kilometers</span>
              </div>
            </div>

            <input
              type="range"
              min={50}
              max={1500}
              step={10}
              value={customDistanceKm}
              onChange={(e) => setCustomDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
              <span>50 km (Local/Airport)</span>
              <span>500 km (Hills)</span>
              <span>1000 km (Expressways)</span>
              <span>1500 km (Pan-India)</span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-slate-400">Trip Format:</span>
              <button
                onClick={() => setIsRoundTrip(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  !isRoundTrip ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                One-Way ({customDistanceKm} km)
              </button>
              <button
                onClick={() => setIsRoundTrip(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  isRoundTrip ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Round-Trip ({customDistanceKm * 2} km)
              </button>
            </div>
          </div>
        )}

        {/* ═══ COMPARATIVE VEHICLE TARIFF CARDS ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLEET_DATA.map((vehicle) => {
            const billableKm = Math.max(totalBilledKm, vehicle.minDailyKm);
            const baseFare = billableKm * vehicle.pricePerKm;
            const tollEstimate = Math.round(activeDistance * 1.1);
            const driverAllowance = isRoundTrip
              ? vehicle.driverAllowancePerDay * 2
              : vehicle.driverAllowancePerDay;
            const totalEstimatedPrice = baseFare + tollEstimate + driverAllowance;

            return (
              <div
                key={vehicle.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {vehicle.category}
                      </span>
                      <h3 className="text-xl font-bold text-white font-heading mt-1">
                        {vehicle.name}
                      </h3>
                      <p className="text-xs text-slate-400">{vehicle.seats} Seats Capacity</p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Specifications & Inclusions */}
                  <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Passenger Capacity:</span>
                      <span className="font-semibold text-white">{vehicle.seats} Seats</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Baggage Space:</span>
                      <span className="font-semibold text-white">
                        {vehicle.luggageBags} Large Bags
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Chauffeur:</span>
                      <span className="font-semibold text-emerald-400">
                        Included (Verified)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Highway Permit:</span>
                      <span className="font-semibold text-amber-300">
                        All-India Commercial
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Best Deal Guarantee
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      Custom Quote on Inquiry
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'popular') {
                        onSelectRoute(activeRoute.from, activeRoute.to, vehicle.id);
                      } else {
                        onSelectRoute('Custom Origin', 'Custom Destination', vehicle.id);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Inquire {vehicle.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
