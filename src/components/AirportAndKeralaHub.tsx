import React, { useState } from 'react';
import {
  Plane,
  Palmtree,
  Mountain,
  Navigation,
  Clock,
  Car,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';

interface HubRoute {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  image: string;
  recommendedVehicle: string;
  highlights: string[];
  tagline: string;
}

interface AirportAndKeralaHubProps {
  onSelectCorridor: (pickup: string, drop: string) => void;
}

export const AirportAndKeralaHub: React.FC<AirportAndKeralaHubProps> = ({ onSelectCorridor }) => {
  const [activeTab, setActiveTab] = useState<'airports' | 'kerala' | 'hills'>('kerala');

  const airportRoutes: HubRoute[] = [
    {
      id: 'delhi-airport-chandigarh',
      from: 'Delhi IGI Airport (Terminals 1, 2 & 3)',
      to: 'Chandigarh / Mohali / Panchkula',
      distance: '260 km',
      duration: '4.5 Hours',
      image: '/tours/delhi-airport.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'Terminal 3 / T1 arrival gate placard pickup with flight delay protection',
      highlights: ['Free waiting up to 90 mins', 'Heavy luggage assistance', 'FASTag toll express run'],
    },
    {
      id: 'delhi-airport-agra',
      from: 'Delhi IGI Airport (Terminals 1, 2 & 3)',
      to: 'Agra (Taj Mahal & Mathura)',
      distance: '220 km',
      duration: '3.5 Hours',
      image: '/tours/golden-triangle.jpg',
      recommendedVehicle: 'Toyota Innova Crysta / Ertiga',
      tagline: 'Direct expressway run to Taj Mahal with sunrise/same-day drop',
      highlights: ['Yamuna Expressway 6-lane glide', 'English & Hindi speaking chauffeur', 'Foreign tourist friendly'],
    },
    {
      id: 'delhi-airport-jaipur',
      from: 'Delhi IGI Airport (Terminals 1, 2 & 3)',
      to: 'Jaipur (Pink City / Amer Fort)',
      distance: '260 km',
      duration: '4.0 Hours',
      image: '/tours/jaipur.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'Delhi-Mumbai Expressway direct connection to Pink City palaces',
      highlights: ['Access-controlled high-speed highway', 'Air-conditioned luxury cabin', 'Clean highway stops'],
    },
    {
      id: 'bangalore-airport-coorg',
      from: 'Bangalore (Kempegowda Airport BLR / City)',
      to: 'Coorg (Madikeri / Abbey Falls)',
      distance: '250 km',
      duration: '5.5 Hours',
      image: '/tours/coorg.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'Kempegowda Airport pickup to misty coffee plantations & waterfalls',
      highlights: ['Bengaluru-Mysuru Expressway', 'Spacious boot for flight bags', 'Hill-certified driver'],
    },
    {
      id: 'goa-airport-northgoa',
      from: 'Goa (MOPA / Dabolim Airport & Beaches)',
      to: 'North Goa (Baga / Calangute / Candolim)',
      distance: '35 km',
      duration: '50 Mins',
      image: '/tours/goa.jpg',
      recommendedVehicle: 'Innova Crysta / Ertiga',
      tagline: 'MOPA Manohar Airport & Dabolim to beach resort doorsteps',
      highlights: ['Direct tarmac exit meet', 'No local taxi union hassle', 'Pre-fixed transparent quote'],
    },
    {
      id: 'mumbai-airport-pune',
      from: 'Mumbai (CSMIA Airport BOM) / Pune',
      to: 'Shirdi (Sai Baba Samadhi Mandir)',
      distance: '240 km',
      duration: '4.5 Hours',
      image: '/tours/shirdi.jpg',
      recommendedVehicle: 'Maruti Ertiga / Innova Crysta',
      tagline: 'CSMIA Terminal 2 pickup via new Samruddhi Expressway to holy shrine',
      highlights: ['Samruddhi Mahamarg superfast ride', 'Devotee-friendly courteous driver', 'Zero waiting stress'],
    },
  ];

  const keralaRoutes: HubRoute[] = [
    {
      id: 'cochin-airport-munnar',
      from: 'Cochin International Airport (COK)',
      to: 'Munnar (Tea Gardens & Eravikulam)',
      distance: '125 km',
      duration: '3.5 Hours',
      image: '/tours/munnar.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'The classic Kerala honeymoon & family route through Cheeyappara waterfalls & emerald tea hills',
      highlights: ['Scenic waterfall stops on NH 85', 'Western Ghats hill climbing specialist', 'Clean panoramic windows'],
    },
    {
      id: 'cochin-airport-alleppey',
      from: 'Cochin International Airport (COK)',
      to: 'Alleppey (Alappuzha Houseboats & Backwaters)',
      distance: '85 km',
      duration: '2.2 Hours',
      image: '/tours/alleppey.jpg',
      recommendedVehicle: 'Maruti Ertiga / Innova Crysta',
      tagline: 'Airport exit directly to luxury houseboat jetty boarding points on Vembanad Lake',
      highlights: ['Punctual flight tracking', 'Luggage transfer to boat', 'Coastal expressway route'],
    },
    {
      id: 'cochin-athirappilly',
      from: 'Cochin International Airport (COK)',
      to: 'Athirappilly Waterfalls (Vazhachal Falls)',
      distance: '45 km',
      duration: '1.2 Hours',
      image: '/tours/athirappilly.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'Niagara of South India — pristine rainforest drive with wild elephant corridor views',
      highlights: ['Short 1-hour drive from Cochin Airport', 'Vazhachal rapids & botanical stop', 'Ideal for day trips'],
    },
    {
      id: 'trivandrum-varkala',
      from: 'Trivandrum International Airport (TRV)',
      to: 'Varkala (Papanasam Cliff & Beach)',
      distance: '45 km',
      duration: '1.2 Hours',
      image: '/tours/varkala.jpg',
      recommendedVehicle: 'Maruti Ertiga / Dzire',
      tagline: 'Dramatic red cliff sunset overlooking Arabian Sea, Tibetan cafes & surf bays',
      highlights: ['Coastal highway drive', 'Janardhana Swamy temple enroute', 'Flight-coordinated pickup'],
    },
    {
      id: 'cochin-thekkady',
      from: 'Cochin International Airport (COK)',
      to: 'Thekkady (Periyar Tiger Sanctuary & Spice Hills)',
      distance: '155 km',
      duration: '4.5 Hours',
      image: '/tours/thekkady.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'Cardamom hills & spice plantation trails to Periyar wildlife lake boating',
      highlights: ['Spice garden visits with driver guidance', 'Kottayam-Kumily ghat highway', 'Safe mountain driving'],
    },
    {
      id: 'trivandrum-kanyakumari',
      from: 'Trivandrum International Airport (TRV)',
      to: 'Kanyakumari (Sunrise Point & Rock Memorial)',
      distance: '90 km',
      duration: '2.5 Hours',
      image: '/tours/kanyakumari.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'Trip to India’s southernmost tip where Arabian Sea, Bay of Bengal and Indian Ocean converge',
      highlights: ['Interstate permit included', 'Vivekananda Rock ferry boarding', 'Sunrise & sunset viewpoints'],
    },
    {
      id: 'cochin-wayanad',
      from: 'Cochin International Airport (COK)',
      to: 'Wayanad (Banasura Sagar & Chembra Peak)',
      distance: '260 km',
      duration: '6.0 Hours',
      image: '/tours/wayanad.jpg',
      recommendedVehicle: 'Toyota Innova Crysta / Ertiga',
      tagline: 'Thamarassery Churam 9 hairpin mountain passes, Banasura dam & prehistoric Edakkal caves',
      highlights: ['Hairpin pass certified driver', 'Banasura dam speedboating', 'Muthanga wildlife safari route'],
    },
  ];

  const hillRoutes: HubRoute[] = [
    {
      id: 'delhi-manali-solang',
      from: 'Delhi NCR (New Delhi / Gurgaon / Noida)',
      to: 'Manali / Solang Valley / Rohtang',
      distance: '530 km',
      duration: '11.0 Hours',
      image: '/tours/manali.jpg',
      recommendedVehicle: 'Toyota Innova Crysta',
      tagline: 'Through Kiratpur-Nerchowk 4-lane tunnels, Beas river valley & snow points',
      highlights: ['Mountain snow chains & hill permit', 'Solang Valley & Atal Tunnel ready', 'Experienced mountain pilot'],
    },
    {
      id: 'chandigarh-shimla-kufri',
      from: 'Chandigarh / Mohali / Panchkula',
      to: 'Shimla / Kufri / Mashobra',
      distance: '115 km',
      duration: '3.5 Hours',
      image: '/tours/shimla.jpg',
      recommendedVehicle: 'Maruti Ertiga / Innova Crysta',
      tagline: 'Himalayan Expressway run with panoramic pine views and colonial heritage',
      highlights: ['Himalayan Expressway speed pass', 'Kufri snow views', 'Mall Road drop'],
    },
    {
      id: 'delhi-rishikesh-haridwar',
      from: 'Delhi NCR (New Delhi / Gurgaon / Noida)',
      to: 'Rishikesh / Haridwar (Ganga Aarti)',
      distance: '240 km',
      duration: '5.0 Hours',
      image: '/tours/rishikesh.jpg',
      recommendedVehicle: 'Maruti Ertiga / Dzire',
      tagline: 'Delhi-Meerut Expressway to divine Ganga Aarti & white water rafting camps',
      highlights: ['Har Ki Pauri evening Aarti', 'River rafting drop at Shivpuri', 'Zero toll hassle'],
    },
  ];

  const currentRoutes =
    activeTab === 'kerala' ? keralaRoutes : activeTab === 'airports' ? airportRoutes : hillRoutes;

  const handleWhatsAppInquiry = (route: HubRoute) => {
    const text = `Hello FirstFly! I would like to inquire about taxi booking:
• Route: ${route.from} ➔ ${route.to}
• Estimated Distance: ${route.distance} (~${route.duration})
• Preferred Vehicle: ${route.recommendedVehicle}
Please share driver availability and customized best fare quote.`;
    window.open(`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="py-20 bg-slate-950 relative border-t border-slate-900 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/5 via-emerald-500/5 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> High-Demand Taxi Corridors & Airport Express
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight text-balance">
            Top Airport Transfers & Kerala Tourist Routes
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Where India travels most. Guaranteed on-time airport pickups with flight delay protection,
            and dedicated chauffeur touring across Kerala’s misty tea hills, backwaters, and coastal cliffs.
          </p>

          {/* Interactive Mode Segmented Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-8 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 inline-flex shadow-xl">
            <button
              type="button"
              onClick={() => setActiveTab('kerala')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'kerala'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Palmtree className="w-4 h-4" />
              <span>Kerala & God's Own Country (Munnar, Alleppey, Varkala)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('airports')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'airports'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Airport Hubs (Delhi IGI, Bangalore BLR, Cochin COK, Goa)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hills')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'hills'
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Mountain className="w-4 h-4" />
              <span>Himalayan Mountain Corridors</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800/90 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 group"
            >
              <div>
                {/* Visual Image Banner with distance & duration badges */}
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero/hero-bg.jpeg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                  {/* Clean unboxed metadata badges */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-slate-800 flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>{route.distance}</span>
                    <span className="text-slate-500">·</span>
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>~{route.duration}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Zero Surge</span>
                  </div>

                  {/* Route Destination Title Banner */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      {route.from.split(' (')[0]}
                    </p>
                    <h3 className="text-lg font-black text-white font-heading truncate drop-shadow-md">
                      ➔ {route.to.split(' (')[0]}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                    {route.tagline}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1.5 border-y border-slate-800/80">
                    <Car className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Recommended Fleet:</span>
                    <strong className="text-white font-semibold">{route.recommendedVehicle}</strong>
                  </div>

                  {/* Route Highlights */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {route.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    Transparent Tariff
                  </span>
                  <span className="text-xs font-black text-white font-heading">
                    Custom Quote on Request
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppInquiry(route)}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md active:scale-95 cursor-pointer"
                    title="Inquire route fare on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectCorridor(route.from, route.to)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>Book Taxi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Airport Flight Tracking & Kerala Chauffeur Guarantee Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left items-center">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">
                Live Flight Status Tracking
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Chauffeurs monitor delays across Delhi T3, Bangalore, and Cochin. Free waiting up to 90 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Palmtree className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">
                Western Ghats Certified Drivers
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Experienced chauffeurs for Munnar hairpin bends, Wayanad ghats, and coastal backwater roads.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors text-center"
            >
              Call 24/7 Desk
            </a>
            <a
              href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20need%20to%20book%20an%20airport%20or%20Kerala%20taxi.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 text-center"
            >
              WhatsApp Dispatch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
