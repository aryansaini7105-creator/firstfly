import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Plane,
  Mountain,
  Building2,
  CheckCircle2,
  Navigation,
  Sparkles,
  ArrowRight,
  Sun
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';

interface AllIndiaCoverageProps {
  onSelectCorridor: (pickup: string, drop: string) => void;
}

export const AllIndiaCoverage: React.FC<AllIndiaCoverageProps> = ({ onSelectCorridor }) => {
  const [activeRegion, setActiveRegion] = useState<'all' | 'hills' | 'airports' | 'south' | 'heritage' | 'pilgrimage'>('all');

  const regions = [
    {
      id: 'hills',
      title: 'Himalayan Hill Station Corridors',
      icon: <Mountain className="w-5 h-5 text-sky-400" />,
      tag: 'Specialized Mountain Drivers',
      description:
        'Certified high-altitude drivers with deep knowledge of mountain passes, snow chains, landslide bypasses, and hairpin turns in Himachal and Uttarakhand.',
      destinations: [
        'Manali & Rohtang Pass',
        'Shimla & Kufri',
        'Dharamshala & McLeod Ganj',
        'Kasol & Manikaran',
        'Mussoorie & Dhanaulti',
        'Nainital & Bhimtal',
        'Spiti Valley & Leh Ladakh',
      ],
      defaultRoute: { from: 'Chandigarh / Mohali / Zirakpur', to: 'Manali / Solang Valley / Rohtang' },
    },
    {
      id: 'airports',
      title: '24/7 International Airport Hubs',
      icon: <Plane className="w-5 h-5 text-amber-400" />,
      tag: 'Flight Tracking & Punctual Pickup',
      description:
        'Guaranteed on-time airport pickups and drop-offs. Chauffeurs track your flight in real time, provide complimentary waiting, and assist with international heavy luggage.',
      destinations: [
        'Delhi IGI Airport (Terminals 1, 2 & 3)',
        'Chandigarh Shaheed Bhagat Singh Int’l (IXC)',
        'Bangalore Kempegowda Int’l (BLR)',
        'Cochin International Airport (COK)',
        'Amritsar Sri Guru Ram Dass Jee Int’l (ATQ)',
        'Dehradun Jolly Grant Airport (DED)',
        'Jaipur International Airport (JAI)',
      ],
      defaultRoute: { from: 'Delhi IGI Airport (T3/T1/T2)', to: 'Chandigarh / Mohali / Zirakpur' },
    },
    {
      id: 'south',
      title: 'South India & Western Ghats Corridors',
      icon: <Sun className="w-5 h-5 text-emerald-400" />,
      tag: 'Coffee Plantations & Coastal Escapes',
      description:
        'Interstate touring across Karnataka, Kerala, Tamil Nadu, and Goa. Clean AC vehicles for misty Western Ghats, hill stations, and coastal road trips.',
      destinations: [
        'Bangalore (Airport & City Hubs)',
        'Coorg (Madikeri) & Chikmagalur',
        'Ooty & Nilgiris Toy Train Route',
        'Munnar & Alleppey Backwaters',
        'Kochi & Fort Cochin',
        'Goa (North & South Beaches / Mopa Airport)',
        'Chennai, Mahabalipuram & Pondicherry',
        'Tirupati Balaji Sacred Darshan',
      ],
      defaultRoute: { from: 'Bangalore (Kempegowda Airport BLR / City)', to: 'Coorg (Madikeri) / Chikmagalur' },
    },
    {
      id: 'heritage',
      title: 'Royal Heritage & Expressway Corridors',
      icon: <Building2 className="w-5 h-5 text-rose-400" />,
      tag: 'Expressway Smooth Runs',
      description:
        'Fast access via Yamuna Expressway, Delhi-Mumbai Expressway, and Trans-Haryana Highway. Clean executive sedans and SUVs for effortless interstate long runs.',
      destinations: [
        'Jaipur Pink City & Amber Fort',
        'Agra Taj Mahal & Fatehpur Sikri',
        'Udaipur City of Lakes',
        'Jodhpur Sun City',
        'Delhi NCR (Gurgaon, Noida, Faridabad)',
        'Chandigarh - Mohali - Panchkula Tricity',
      ],
      defaultRoute: { from: 'Delhi NCR (New Delhi / Gurgaon / Noida)', to: 'Jaipur / Udaipur / Jodhpur' },
    },
    {
      id: 'pilgrimage',
      title: 'Sacred Pilgrimage & Spiritual Circuits',
      icon: <Compass className="w-5 h-5 text-purple-400" />,
      tag: 'Family & Senior Citizen Friendly',
      description:
        'Spiritual journeys tailored for families and elderly pilgrims. Calm, respectful chauffeurs and clean sanitized vehicles with spacious legroom.',
      destinations: [
        'Amritsar Sachkhand Sri Harmandir Sahib',
        'Rishikesh & Haridwar Ganga Aarti',
        'Ayodhya Shri Ram Janmabhoomi Mandir',
        'Varanasi Kashi Vishwanath Dham',
        'Katra Mata Vaishno Devi Shrine',
        'Mathura & Vrindavan Braj Darshan',
      ],
      defaultRoute: { from: 'Delhi NCR (New Delhi / Gurgaon / Noida)', to: 'Rishikesh / Haridwar' },
    },
  ];

  const filteredRegions =
    activeRegion === 'all' ? regions : regions.filter((r) => r.id === activeRegion);

  return (
    <section id="coverage" className="py-20 bg-slate-950/80 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Pan-India Commercial Fleet Coverage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
            Seamless Travel Across All Over India
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Whether it’s a quick airport transfer, a family vacation in Himachal, a South India tour
            to Coorg or Munnar, or an interstate wedding convoy. FirstFly operates 24/7 across India.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 p-1 bg-slate-900 rounded-2xl border border-slate-800 inline-flex">
            {[
              { id: 'all', label: 'All India Network' },
              { id: 'hills', label: 'Himalayan Hills' },
              { id: 'airports', label: 'Delhi & South Airports' },
              { id: 'south', label: 'South India & Goa' },
              { id: 'heritage', label: 'Expressways & Royal' },
              { id: 'pilgrimage', label: 'Spiritual Circuits' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRegion(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRegion === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Corridors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredRegions.map((region) => (
            <div
              key={region.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {region.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-heading">{region.title}</h3>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        {region.tag}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {region.description}
                </p>

                {/* Destinations Cloud */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Popular Drops & Tourist Destinations Covered:</span>
                    <span className="text-[10px] text-amber-400/80 font-normal">Click to quick-book</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {region.destinations.map((dest, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onSelectCorridor(region.defaultRoute.from, dest)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-amber-500/15 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 text-xs font-medium border border-slate-800/80 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 group/btn"
                        title={`Click to book ride to ${dest}`}
                      >
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0 group-hover/btn:scale-110 transition-transform" />
                        <span>{dest}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Direct Chauffeur Available 24/7
                </span>

                <button
                  onClick={() =>
                    onSelectCorridor(region.defaultRoute.from, region.defaultRoute.to)
                  }
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 group-hover:bg-amber-500 group-hover:text-slate-950"
                >
                  <span>Book This Corridor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* All-India Commercial Permit Notice */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-heading">
                All-India Tourist Permit & Border Clearance Ready
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Our vehicles hold valid national permits for seamless interstate travel across Punjab,
                Haryana, Delhi NCR, Himachal Pradesh, Uttarakhand, Rajasthan, and Uttar Pradesh with zero border delays.
              </p>
            </div>
          </div>

          <a
            href={`tel:${COMPANY_DETAILS.phone}`}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap"
          >
            Call 24/7 Fleet Manager
          </a>
        </div>
      </div>
    </section>
  );
};
