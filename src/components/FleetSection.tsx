import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Wind,
  ShieldCheck,
  Check,
  Fuel,
  Info,
  Car,
  ChevronRight,
  Eye,
  X,
  Star,
  Sparkles
} from 'lucide-react';
import { FLEET_DATA, COMPANY_DETAILS } from '../data/travelData';
import { Vehicle, VehicleCategory } from '../types/travel';

interface FleetSectionProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onSelectVehicle }) => {
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('all');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<Vehicle | null>(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});

  const filteredFleet =
    activeCategory === 'all'
      ? FLEET_DATA
      : FLEET_DATA.filter((v) => v.category === activeCategory);

  const handleNextImage = (vehicleId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [vehicleId]: ((prev[vehicleId] || 0) + 1) % totalImages,
    }));
  };

  return (
    <section id="fleet" className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 100% Commercial Yellow-Plate Fleet
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
              Our Premium Travel Fleet
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              From executive sedans to 17-seater luxury Urbania travellers. Every vehicle is GPS
              tracked, sanitized before every trip, and driven by an experienced mountain chauffeur.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: 'All Fleet' },
              { id: 'suv', label: 'Luxury SUV' },
              { id: 'muv', label: 'Family MUV' },
              { id: 'traveller', label: '12-17 Seater Travellers' },
              { id: 'sedan', label: 'Sedans' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as VehicleCategory)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFleet.map((vehicle) => {
            const activeImgIdx = currentImageIndexes[vehicle.id] || 0;
            const currentImg = vehicle.images[activeImgIdx] || vehicle.images[0];

            return (
              <div
                key={vehicle.id}
                className="group bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden flex flex-col hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Image Container with Slider Preview */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-950">
                  <img
                    src={currentImg}
                    alt={vehicle.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                  {/* Badge: Category / Popular */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {vehicle.category}
                    </span>
                    {vehicle.isPopular && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950">
                        Most Booked
                      </span>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{vehicle.rating}</span>
                  </div>

                  {/* Multiple Images Dots indicator */}
                  {vehicle.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
                      {vehicle.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndexes((prev) => ({
                              ...prev,
                              [vehicle.id]: idx,
                            }));
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            activeImgIdx === idx
                              ? 'w-5 bg-amber-400'
                              : 'bg-white/40 hover:bg-white/80'
                          }`}
                          aria-label={`View photo ${idx + 1}`}
                        />
                      ))}
                      <span className="text-[10px] text-white/80 ml-1 font-mono">
                        {activeImgIdx + 1}/{vehicle.images.length}
                      </span>
                    </div>
                  )}

                  {/* View Details / 360 preview icon */}
                  <button
                    onClick={() => setSelectedVehicleForModal(vehicle)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-amber-500 text-slate-300 hover:text-slate-950 backdrop-blur-md transition-colors"
                    title="View vehicle details & seating arrangement"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title & Tagline */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-white font-heading group-hover:text-amber-400 transition-colors">
                          {vehicle.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {vehicle.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Reg Plate Reference Tag */}
                    {vehicle.sampleRegNumber && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        {vehicle.sampleRegNumber}
                      </div>
                    )}

                    {/* Capacity & Specs Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Users className="w-4 h-4 text-sky-400" />
                        <span>
                          <strong>{vehicle.seats}</strong> Seats
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Briefcase className="w-4 h-4 text-amber-400" />
                        <span>
                          <strong>{vehicle.luggageBags}</strong> Bags
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Wind className="w-4 h-4" />
                        <span>Dual AC</span>
                      </div>
                    </div>

                    {/* Features Snippet */}
                    <div className="mt-3 space-y-1.5">
                      {vehicle.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Tariff Rate
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-amber-400 font-heading">
                          ₹{vehicle.pricePerKm}
                        </span>
                        <span className="text-xs text-slate-400">/ km</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedVehicleForModal(vehicle)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        Specs
                      </button>
                      <button
                        onClick={() => onSelectVehicle(vehicle)}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1"
                      >
                        <span>Book</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ VEHICLE SPECS & SEATING PLAN MODAL ═══ */}
      {selectedVehicleForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedVehicleForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
                <img
                  src={selectedVehicleForModal.images[0]}
                  alt={selectedVehicleForModal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Commercial Yellow Plate Fleet
                </span>
                <h3 className="text-2xl font-black text-white font-heading">
                  {selectedVehicleForModal.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedVehicleForModal.tagline}</p>
              </div>
            </div>

            {/* Registration & Trust Details */}
            {selectedVehicleForModal.sampleRegNumber && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs mb-4">
                <span className="font-semibold text-amber-300">
                  Fleet Registration: {selectedVehicleForModal.sampleRegNumber}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> All-India Tourist Permit
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {selectedVehicleForModal.description}
            </p>

            {/* Seating Arrangement Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  Seating Layout: {selectedVehicleForModal.seatingConfig}
                </h4>
                <span className="text-xs text-slate-400">
                  Max: {selectedVehicleForModal.seats} Passengers
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Recommended For:</p>
                  <p className="text-slate-400">{selectedVehicleForModal.bestFor}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-400">Driver Allowance</p>
                  <p className="text-slate-400">
                    ₹{selectedVehicleForModal.driverAllowancePerDay} / day
                  </p>
                </div>
              </div>
            </div>

            {/* Full Features Checklist */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Included Comfort & Safety Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedVehicleForModal.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Standard Rate</span>
                <p className="text-xl font-black text-amber-400 font-heading">
                  ₹{selectedVehicleForModal.pricePerKm} / km
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedVehicleForModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const v = selectedVehicleForModal;
                    setSelectedVehicleForModal(null);
                    onSelectVehicle(v);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  Book This Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
