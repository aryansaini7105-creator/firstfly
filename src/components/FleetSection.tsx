import React, { useState, useRef } from 'react';
import {
  Users,
  Briefcase,
  Wind,
  ShieldCheck,
  Check,
  Fuel,
  Info,
  Car,
  ChevronLeft,
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
  const [modalImgIdx, setModalImgIdx] = useState(0);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [touchStarts, setTouchStarts] = useState<Record<string, number>>({});
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const filteredFleet =
    activeCategory === 'all'
      ? FLEET_DATA
      : FLEET_DATA.filter((v) => v.category === activeCategory);

  const handlePrevImage = (vehicleId: string, totalImages: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndexes((prev) => {
      const cur = prev[vehicleId] || 0;
      return {
        ...prev,
        [vehicleId]: (cur - 1 + totalImages) % totalImages,
      };
    });
  };

  const handleNextImage = (vehicleId: string, totalImages: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndexes((prev) => {
      const cur = prev[vehicleId] || 0;
      return {
        ...prev,
        [vehicleId]: (cur + 1) % totalImages,
      };
    });
  };

  const scrollFleet = (direction: 'left' | 'right') => {
    if (gridContainerRef.current) {
      const scrollAmount = 360;
      gridContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
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

          {/* Filter Tabs & Slide Controls */}
          <div className="flex flex-wrap items-center gap-2">
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Slide Next / Prev buttons for car options */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 px-2">Browse Cars:</span>
              <button
                type="button"
                onClick={() => scrollFleet('left')}
                aria-label="Previous vehicles"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 transition-colors cursor-pointer"
                title="Slide left to view previous cars"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollFleet('right')}
                aria-label="Next vehicles"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 transition-colors cursor-pointer"
                title="Slide right to view next cars"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        <div
          ref={gridContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto md:overflow-x-visible pb-2 scroll-smooth"
        >
          {filteredFleet.map((vehicle) => {
            const activeImgIdx = currentImageIndexes[vehicle.id] || 0;
            const currentImg = vehicle.images[activeImgIdx] || vehicle.images[0];

            return (
              <div
                key={vehicle.id}
                className="group bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden flex flex-col hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Image Container with Slider Preview (< and > controls) */}
                <div
                  className="relative h-56 sm:h-60 overflow-hidden bg-slate-950 select-none"
                  onTouchStart={(e) => {
                    setTouchStarts((prev) => ({ ...prev, [vehicle.id]: e.touches[0].clientX }));
                  }}
                  onTouchEnd={(e) => {
                    const startX = touchStarts[vehicle.id];
                    if (typeof startX === 'number') {
                      const diff = startX - e.changedTouches[0].clientX;
                      if (diff > 35) handleNextImage(vehicle.id, vehicle.images.length);
                      else if (diff < -35) handlePrevImage(vehicle.id, vehicle.images.length);
                    }
                  }}
                >
                  <img
                    src={currentImg}
                    alt={`${vehicle.name} - FirstFly Authentic Fleet`}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={360}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>

                  {/* Badge: Category / Popular */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {vehicle.category}
                    </span>
                    {vehicle.isPopular && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950">
                        Most Booked
                      </span>
                    )}
                  </div>

                  {/* Rating & Photo Counter Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <div className="px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold border border-slate-800">
                      Photo {activeImgIdx + 1}/{vehicle.images.length}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold border border-slate-800">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{vehicle.rating}</span>
                    </div>
                  </div>

                  {/* ═══ SLIDER ARROWS: < AND > TO SLIDE CAR PHOTOS ═══ */}
                  {vehicle.images.length > 1 && (
                    <>
                      {/* Previous button < */}
                      <button
                        type="button"
                        onClick={(e) => handlePrevImage(vehicle.id, vehicle.images.length, e)}
                        aria-label={`Previous photo of ${vehicle.name}`}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 hover:border-amber-400 flex items-center justify-center transition-all backdrop-blur-md shadow-xl active:scale-90 z-20 cursor-pointer group/btn"
                        title="Previous photo"
                      >
                        <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
                      </button>

                      {/* Next button > */}
                      <button
                        type="button"
                        onClick={(e) => handleNextImage(vehicle.id, vehicle.images.length, e)}
                        aria-label={`Next photo of ${vehicle.name}`}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 hover:border-amber-400 flex items-center justify-center transition-all backdrop-blur-md shadow-xl active:scale-90 z-20 cursor-pointer group/btn"
                        title="Next photo"
                      >
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </>
                  )}

                  {/* Multiple Images Dots indicator */}
                  {vehicle.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10 bg-slate-950/70 backdrop-blur-md px-2 py-1 rounded-full border border-slate-800">
                      {vehicle.images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndexes((prev) => ({
                              ...prev,
                              [vehicle.id]: idx,
                            }));
                          }}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                            activeImgIdx === idx
                              ? 'w-5 bg-amber-400'
                              : 'bg-white/40 hover:bg-white/80'
                          }`}
                          aria-label={`View photo ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* View Details / 360 preview icon */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVehicleForModal(vehicle);
                      setModalImgIdx(activeImgIdx);
                    }}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/85 hover:bg-amber-500 text-slate-300 hover:text-slate-950 backdrop-blur-md transition-colors border border-slate-800 cursor-pointer z-10"
                    title="View vehicle gallery & specs"
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
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Best Rate Guarantee
                      </span>
                      <p className="text-sm font-black text-white font-heading">
                        Custom Quote on Request
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVehicleForModal(vehicle)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        Specs
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectVehicle(vehicle)}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book / Inquire</span>
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

            {/* Modal Photo Gallery with < and > Slider */}
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
              <img
                src={selectedVehicleForModal.images[modalImgIdx] || selectedVehicleForModal.images[0]}
                alt={`${selectedVehicleForModal.name} official photo ${modalImgIdx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                  {selectedVehicleForModal.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-950/80 text-white border border-slate-800">
                  Photo {modalImgIdx + 1} of {selectedVehicleForModal.images.length}
                </span>
              </div>

              {/* Next/Prev buttons in Modal */}
              {selectedVehicleForModal.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setModalImgIdx((prev) =>
                        (prev - 1 + selectedVehicleForModal.images.length) %
                        selectedVehicleForModal.images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center transition-all shadow-xl cursor-pointer z-20"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setModalImgIdx((prev) =>
                        (prev + 1) % selectedVehicleForModal.images.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center transition-all shadow-xl cursor-pointer z-20"
                    title="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Title on Modal Image */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                <div>
                  <h3 className="text-2xl font-black text-white font-heading drop-shadow-md">
                    {selectedVehicleForModal.name}
                  </h3>
                  <p className="text-xs text-slate-300 drop-shadow">
                    {selectedVehicleForModal.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Thumbnail Strip */}
            {selectedVehicleForModal.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
                {selectedVehicleForModal.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setModalImgIdx(idx)}
                    aria-label={`View photo ${idx + 1} of ${selectedVehicleForModal.name}`}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      modalImgIdx === idx
                        ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${selectedVehicleForModal.name} preview thumbnail ${idx + 1}`}
                      width={64}
                      height={48}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

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
                  <p className="font-bold text-amber-400">Driver & Chauffeur</p>
                  <p className="text-slate-400">
                    Experienced Hill & Highway Driver Included
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
                <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> All-India Tourist Permit
                </span>
                <p className="text-sm font-black text-white font-heading">
                  Custom Lowest Fare on Inquiry
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVehicleForModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const v = selectedVehicleForModal;
                    setSelectedVehicleForModal(null);
                    onSelectVehicle(v);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
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
