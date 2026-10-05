export type VehicleCategory = 'all' | 'suv' | 'muv' | 'traveller' | 'sedan';

export type TripType = 'one-way' | 'round-trip' | 'airport' | 'local';

export interface Vehicle {
  id: string;
  name: string;
  tagline: string;
  category: 'suv' | 'muv' | 'traveller' | 'sedan';
  seats: number;
  luggageBags: number;
  ac: boolean;
  pricePerKm: number;
  minDailyKm: number;
  baseFlatRate?: number;
  driverAllowancePerDay: number;
  fuelType: 'Diesel' | 'Petrol / CNG' | 'Diesel Turbo';
  transmission: 'Manual' | 'Automatic';
  registrationType: 'Commercial All-India Tourist Permit (Yellow Plate)';
  sampleRegNumber?: string;
  features: string[];
  images: string[];
  interiorImage?: string;
  exteriorImage?: string;
  description: string;
  seatingConfig: string;
  rating: number;
  totalTripsCompleted: number;
  bestFor: string;
  isPopular?: boolean;
}

export interface RoutePreset {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  durationHours: number;
  category: 'Hill Station' | 'Expressway' | 'Pilgrimage' | 'Heritage' | 'Business' | 'South India' | 'Airport';
  highwayName: string;
  tollEstimate: number;
  startingPrice: number;
  recommendedVehicleId: string;
  scenicNote: string;
}

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  destination: string;
  state: string;
  duration: string;
  days: number;
  nights: number;
  image: string;
  category: 'hills' | 'pilgrimage' | 'heritage' | 'weekend' | 'south' | 'airports';
  rating: number;
  pricePerVehicle: number;
  recommendedVehicle: string;
  highlights: string[];
  itinerary: { day: number; title: string; desc: string }[];
  inclusions: string[];
  exclusions: string[];
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  trip: string;
  vehicleUsed: string;
  rating: number;
  date: string;
  text: string;
  avatarLetter: string;
  accentColor: string;
  verifiedBooking: boolean;
}

export interface BookingFormState {
  pickup: string;
  drop: string;
  tripType: TripType;
  travelDate: string;
  travelTime: string;
  returnDate?: string;
  vehicleId: string;
  passengers: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

export interface BookingFareCalculation {
  distanceKm: number;
  estimatedHours: number;
  baseFare: number;
  driverAllowance: number;
  tollTaxEstimate: number;
  stateTaxEstimate: number;
  totalEstimatedFare: number;
  pricePerKm: number;
}
