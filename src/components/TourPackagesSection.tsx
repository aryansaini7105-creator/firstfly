import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Car,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Search,
  X
} from 'lucide-react';
import { TOUR_PACKAGES, COMPANY_DETAILS } from '../data/travelData';
import { TourPackage } from '../types/travel';

interface TourPackagesSectionProps {
  onBookPackage: (pkg: TourPackage) => void;
}

export const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({ onBookPackage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  // User-friendly filtering by both category and search query
  const filteredPackages = TOUR_PACKAGES.filter((pkg) => {
    const matchesCategory =
      selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (pkgId: string) => {
    setExpandedPackageId(expandedPackageId === pkgId ? null : pkgId);
  };

  const handleWhatsAppPackage = (pkg: TourPackage) => {
    const text = `Hello FirstFly! I am interested in booking the *${pkg.title}* (${pkg.duration}) for destination *${pkg.destination}*.
• Recommended Vehicle: ${pkg.recommendedVehicle}
Please share driver availability and customized best fare.`;
    window.open(`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="packages" className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Compass className="w-3.5 h-3.5" /> All-India Handpicked Holiday Packages
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
              Curated Tour Packages
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Experience India’s most scenic mountain roads, historic palaces, and holy shrines with a
              dedicated vehicle and seasoned chauffeur at your service throughout.
            </p>
          </div>

          {/* User-friendly Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Manali, Shimla, Jaipur..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-8 inline-flex">
          {[
            { id: 'all', label: 'All Packages' },
            { id: 'south', label: 'South India & Goa' },
            { id: 'airports', label: 'Delhi & Hub Airports' },
            { id: 'hills', label: 'Snow & Hills' },
            { id: 'pilgrimage', label: 'Spiritual / Darshan' },
            { id: 'heritage', label: 'Royal Heritage' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty state if search has no results */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No packages found</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              We couldn't find any packages matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => {
              const isExpanded = expandedPackageId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  <div>
                    {/* Package Hero Image with 100% reliable local fallback */}
                    <div
                      onClick={() => toggleExpand(pkg.id)}
                      className="relative h-56 overflow-hidden bg-slate-950 cursor-pointer group/img"
                      title="Click to view itinerary & details"
                    >
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero/hero-bg.jpeg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                      {/* Duration Badge */}
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pkg.duration}</span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-slate-800 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{pkg.rating}</span>
                      </div>

                      {/* Destination Banner */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{pkg.destination}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6">
                      <h3
                        onClick={() => toggleExpand(pkg.id)}
                        className="text-xl font-bold text-white font-heading cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-medium mt-1">
                        Vehicle: {pkg.recommendedVehicle}
                      </p>

                      {/* Highlights Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {pkg.highlights.slice(0, 4).map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-[11px] font-medium border border-slate-800"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>

                      {/* Expandable Itinerary Drawer */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Day-by-Day Journey Plan:
                          </h4>
                          <div className="space-y-2 text-xs">
                            {pkg.itinerary.map((day) => (
                              <div key={day.day} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                <p className="font-bold text-amber-400">
                                  Day {day.day}: {day.title}
                                </p>
                                <p className="text-slate-300 text-[11px] mt-0.5">{day.desc}</p>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <p className="text-xs font-bold text-slate-400 mb-1">Package Includes:</p>
                            <div className="space-y-1 text-[11px] text-slate-300">
                              {pkg.inclusions.map((inc, i) => (
                                <p key={i} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-emerald-400 shrink-0" /> {inc}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleExpand(pkg.id)}
                        className="mt-4 text-xs font-semibold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Itinerary' : 'View Full Itinerary & Inclusions'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Footer Pricing & CTA */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> All-Inclusive Package
                      </span>
                      <p className="text-sm font-black text-white font-heading">
                        Best Rate on Inquiry
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppPackage(pkg)}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md active:scale-95 cursor-pointer"
                        title="Inquire via WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onBookPackage(pkg)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inquire Tour</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
