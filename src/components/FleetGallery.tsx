import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Eye, ShieldCheck, Sparkles, MessageSquare, Car, ArrowRight } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: 'innova' | 'ertiga' | 'urbania' | 'traveller' | 'sedan';
  caption: string;
  regBadge?: string;
}

interface FleetGalleryProps {
  onOpenBooking?: () => void;
}

export const FleetGallery: React.FC<FleetGalleryProps> = ({ onOpenBooking }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    // Toyota Innova Crysta
    { id: 'inn-0', src: '/vehicles/innova-0.jpeg', title: 'Toyota Innova Crysta Front View', category: 'innova', caption: 'Pristine white Toyota Innova Crysta commercial yellow-plate vehicle.', regBadge: 'PB 01 B 0051' },
    { id: 'inn-1', src: '/vehicles/innova-new-1.jpeg', title: 'Innova Crysta Side Profile', category: 'innova', caption: 'Clean exterior ready for Himachal & outstation touring.', regBadge: 'Commercial Permit' },
    { id: 'inn-2', src: '/vehicles/innova-new-2.jpeg', title: 'Innova Crysta Luxury Cabin', category: 'innova', caption: 'Deep cushioned captain seats with armrests and separate AC blowers.' },
    { id: 'inn-3', src: '/vehicles/innova-new-3.jpeg', title: 'Innova Crysta Rear Angle', category: 'innova', caption: 'Generous rear boot space accommodating 4 large suitcases.' },
    { id: 'inn-4', src: '/vehicles/innova-new-4.jpeg', title: 'Innova Dashboard & Cockpit', category: 'innova', caption: 'Equipped with GPS live tracking and speed governor (80 km/h).' },
    { id: 'inn-5', src: '/vehicles/innova-new-5.jpeg', title: 'Innova Executive Rear Row', category: 'innova', caption: 'Ample legroom and personal reading lights for long highway runs.' },

    // Maruti Suzuki Ertiga
    { id: 'ert-0', src: '/vehicles/ertiga-0.jpeg', title: 'Maruti Ertiga Smart Hybrid Front', category: 'ertiga', caption: 'Authentic FirstFly fleet Ertiga ready for family trips.', regBadge: 'PB 01 G 3601' },
    { id: 'ert-1', src: '/vehicles/ertiga-new-1.jpeg', title: 'Maruti Ertiga Side Stance', category: 'ertiga', caption: 'Clean sanitized body with company graphics and tinted visors.', regBadge: 'PB 01 G 3601' },
    { id: 'ert-2', src: '/vehicles/ertiga-new-2.jpeg', title: 'Ertiga Rear Three-Quarter', category: 'ertiga', caption: 'Commercial yellow plate PB 01 G 3601 with CNG efficiency.' },
    { id: 'ert-3', src: '/vehicles/ertiga-new-3.jpeg', title: 'Ertiga Interior Cabin', category: 'ertiga', caption: 'Spacious 7-seater layout with roof-mounted AC vents.' },
    { id: 'ert-4', src: '/vehicles/ertiga-new-4.jpeg', title: 'Ertiga Highway Ready', category: 'ertiga', caption: 'High reliability for Delhi-Chandigarh and airport runs.' },

    // Force Urbania Luxury
    { id: 'urb-0', src: '/vehicles/urbania-0.jpeg', title: 'Force Urbania 17-Seater Front', category: 'urbania', caption: 'European styled luxury traveller with LED projector headlamps.', regBadge: 'Super-Luxury' },
    { id: 'urb-1', src: '/vehicles/urbania-new-1.jpeg', title: 'Urbania VIP Executive Recliners', category: 'urbania', caption: 'Individual plush pushback leather seats with aircraft louvers.' },
    { id: 'urb-2', src: '/vehicles/urbania-new-2.jpeg', title: 'Urbania Ambient LED Cabin', category: 'urbania', caption: 'Full stand-up height with soft mood lighting and wide gangway.' },
    { id: 'urb-3', src: '/vehicles/urbania-new-3.jpeg', title: 'Urbania Side View', category: 'urbania', caption: 'Aerodynamic coach body for smooth expressway gliding.' },
    { id: 'urb-4', src: '/vehicles/urbania-new-4.jpeg', title: 'Urbania Interior Aisle', category: 'urbania', caption: 'Individual USB fast chargers and mobile pockets at every seat.' },
    { id: 'urb-5', src: '/vehicles/urbania-new-5.jpeg', title: 'Urbania Rear Luggage Trunk', category: 'urbania', caption: 'Cavernous rear boot holding 12+ international suitcases.' },

    // Force Traveller
    { id: 'ft-0', src: '/vehicles/ft-0.jpeg', title: 'Force Traveller 12-Seater Van', category: 'traveller', caption: 'Heavy-duty roof luggage rack and dual AC mountain workhorse.', regBadge: 'Group Van' },
    { id: 'ft-1', src: '/vehicles/ft-1.jpeg', title: 'Force Traveller Side Profile', category: 'traveller', caption: 'Perfect for joint families, pilgrimage, and college tours.' },
    { id: 'ft-2', src: '/vehicles/ft-2.jpeg', title: 'Force Traveller Interior Seats', category: 'traveller', caption: 'Pushback comfortable seats with high panoramic viewing windows.' },
    { id: 'ft-3', src: '/vehicles/ft-3.jpeg', title: 'Force Traveller Mountain Expedition', category: 'traveller', caption: 'Equipped with hill-assist diesel turbo engine for steep inclines.' },

    // Sedans: Dzire & Etios
    { id: 'dz-0', src: '/vehicles/dzire-0.jpeg', title: 'Maruti Suzuki Dzire Sedan', category: 'sedan', caption: 'Economical, clean sedan for fast airport & outstation travel.', regBadge: 'Budget Sedan' },
    { id: 'dz-1', src: '/vehicles/dzire-new-1.jpeg', title: 'Maruti Dzire Side Stance', category: 'sedan', caption: 'Chilled AC and smooth highway suspension.' },
    { id: 'et-0', src: '/vehicles/etios-0.jpeg', title: 'Toyota Etios Executive Sedan', category: 'sedan', caption: 'Cavernous 592L boot space holding 3 large suitcases.', regBadge: 'Executive Boot' },
    { id: 'et-1', src: '/vehicles/etios-new-1.jpeg', title: 'Toyota Etios Rear Legroom', category: 'sedan', caption: 'Plush sofa-like rear seat with expansive knee room.' },
  ];

  const filtered =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Camera className="w-3.5 h-3.5" /> 100% Genuine Fleet Photographs
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
              Real Vehicles, Real Photos
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              What you see is exactly what arrives at your doorstep. Browse authentic photographs of
              our commercial yellow-plate fleet from our verified travel hub.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'innova', label: 'Innova Crysta' },
              { id: 'ertiga', label: 'Ertiga Hybrid' },
              { id: 'urbania', label: 'Urbania 17-Seater' },
              { id: 'traveller', label: 'Force Traveller' },
              { id: 'sedan', label: 'Sedans' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 cursor-pointer aspect-4/3 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10"
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Badge if present */}
              {item.regBadge && (
                <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                  {item.regBadge}
                </div>
              )}

              {/* Caption Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
              </div>

              {/* View Icon */}
              <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/70 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FULLSCREEN LIGHTBOX MODAL ═══ */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-3 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors z-20"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors z-20"
            title="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors z-20"
            title="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center"
          >
            <div className="max-h-[75vh] overflow-hidden rounded-3xl border border-slate-700 shadow-2xl bg-black">
              <img
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="mt-4 text-center max-w-xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {lightboxIndex + 1} / {filtered.length}
                </span>
                {filtered[lightboxIndex].regBadge && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                    {filtered[lightboxIndex].regBadge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white font-heading">
                {filtered[lightboxIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {filtered[lightboxIndex].caption}
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(
                    `Hello FirstFly! I am viewing your fleet photo: ${filtered[lightboxIndex].title}. Please share availability and best fare for this vehicle.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquire via WhatsApp</span>
                </a>

                {onOpenBooking && (
                  <button
                    type="button"
                    onClick={() => {
                      closeLightbox();
                      onOpenBooking();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    <Car className="w-4 h-4 text-slate-950" />
                    <span>Book This Vehicle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
