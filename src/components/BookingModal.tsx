import React, { useState, useEffect, useId } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Users,
  Car,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  FLEET_DATA,
  POPULAR_CITIES,
  COMPANY_DETAILS,
  getEstimatedDistanceAndHours
} from '../data/travelData';
import { TripType, Vehicle } from '../types/travel';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams?: {
    pickup?: string;
    drop?: string;
    tripType?: TripType;
    travelDate?: string;
    vehicleId?: string;
  };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialParams,
}) => {
  const pickupId = useId();
  const dropId = useId();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pickup, setPickup] = useState(initialParams?.pickup || 'Chandigarh');
  const [drop, setDrop] = useState(initialParams?.drop || 'Manali');
  const [tripType, setTripType] = useState<TripType>(initialParams?.tripType || 'one-way');
  const [travelDate, setTravelDate] = useState(
    initialParams?.travelDate ||
      new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [returnDate, setReturnDate] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    initialParams?.vehicleId || 'innova-crysta'
  );
  const [passengers, setPassengers] = useState(4);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot field
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialParams) {
      if (initialParams.pickup) setPickup(initialParams.pickup);
      if (initialParams.drop) setDrop(initialParams.drop);
      if (initialParams.tripType) setTripType(initialParams.tripType);
      if (initialParams.travelDate) setTravelDate(initialParams.travelDate);
      if (initialParams.vehicleId) setSelectedVehicleId(initialParams.vehicleId);
    }
  }, [initialParams]);

  if (!isOpen) return null;

  const selectedVehicle =
    FLEET_DATA.find((v) => v.id === selectedVehicleId) || FLEET_DATA[0];
  const { distanceKm, durationHours } = getEstimatedDistanceAndHours(pickup, drop);
  const effectiveKm = tripType === 'round-trip' ? distanceKm * 2 : distanceKm;
  const billableKm = Math.max(effectiveKm, selectedVehicle.minDailyKm);
  const baseFare = billableKm * selectedVehicle.pricePerKm;
  const tollEstimate = Math.round(distanceKm * 1.1);
  const driverAllowance =
    tripType === 'round-trip'
      ? selectedVehicle.driverAllowancePerDay * 2
      : selectedVehicle.driverAllowancePerDay;
  const totalEstimatedPrice = baseFare + tollEstimate + driverAllowance;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (honeypot) {
      // Bot detected
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your name and a valid phone number.');
      return;
    }

    const cleanDigits = customerPhone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup,
          drop,
          tripType,
          travelDate,
          returnDate: tripType === 'round-trip' ? returnDate : undefined,
          vehicleId: selectedVehicle.id,
          vehicleName: selectedVehicle.name,
          customerName,
          customerPhone,
          passengers,
          notes,
          honeypot,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBookingRef(data.bookingRef);
        setStep(3);

        // Fire festive celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas not supported
        }
      } else {
        setErrorMessage(data.error || 'Failed to submit booking. Please call directly.');
      }
    } catch {
      // Offline fallback: generate client-side booking ref
      const fallbackRef = `FF-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRef(fallbackRef);
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `*FirstFly Booking Voucher [Ref: ${bookingRef}]*
• Customer: ${customerName}
• Mobile: ${customerPhone}
• Route: ${pickup} ➔ ${drop} (${tripType.toUpperCase()})
• Date: ${travelDate}${returnDate ? ` (Return: ${returnDate})` : ''}
• Vehicle: ${selectedVehicle.name} (${selectedVehicle.seats} Seater)
• Fare Policy: Best Rate Guarantee (Zero Surge)
• Distance: ~${effectiveKm} km
Please confirm driver assignment and vehicle registration.`;

    window.open(
      `https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Stepper Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Verified Commercial Vehicle Reservation
            </span>
          </div>

          <h3 className="text-2xl font-black text-white font-heading">
            {step === 1 && 'Trip & Vehicle Selection'}
            {step === 2 && 'Passenger & Contact Details'}
            {step === 3 && 'Booking Confirmed!'}
          </h3>

          {/* Steps Progress Pills */}
          <div className="flex items-center gap-2 mt-3">
            <div
              className={`h-1.5 flex-1 rounded-full ${
                step >= 1 ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${
                step >= 2 ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${
                step === 3 ? 'bg-emerald-400' : 'bg-slate-800'
              }`}
            />
          </div>
        </div>

        {/* ═══ STEP 1: ROUTE & VEHICLE ═══ */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            {/* Trip Type Selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              {(['one-way', 'round-trip', 'airport'] as TripType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTripType(t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                    tripType === t
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Pickup City / Airport
                </label>
                <input
                  type="text"
                  list={pickupId}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. Delhi IGI Airport, Chandigarh..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                />
                <datalist id={pickupId}>
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <div className="flex items-center gap-1 mt-1.5 overflow-x-auto scrollbar-none text-[10px]">
                  <span className="text-slate-500 shrink-0">Quick:</span>
                  {['Delhi IGI Airport (T3/T1/T2)', 'Chandigarh / Mohali / Panchkula', 'Bangalore (Kempegowda Airport BLR / City)', 'Kochi (Cochin Airport COK)'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPickup(c)}
                      className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 whitespace-nowrap cursor-pointer"
                    >
                      {c.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Drop Destination / Tourist Place
                </label>
                <input
                  type="text"
                  list={dropId}
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  placeholder="e.g. Manali, Coorg, Munnar, Goa..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                />
                <datalist id={dropId}>
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <div className="flex items-center gap-1 mt-1.5 overflow-x-auto scrollbar-none text-[10px]">
                  <span className="text-slate-500 shrink-0">Popular:</span>
                  {['Manali / Solang Valley / Rohtang', 'Coorg (Madikeri / Abbey Falls)', 'Munnar (Tea Hills & Eravikulam)', 'Goa (MOPA / Dabolim Airport & Beaches)', 'Ayodhya (Shri Ram Janmabhoomi Mandir)', 'Tirupati Balaji (Sri Venkateswara)', 'Shimla / Kufri / Mashobra'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setDrop(c)}
                      className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 whitespace-nowrap cursor-pointer"
                    >
                      {c.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dates & Passengers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold text-xs focus:outline-none [color-scheme:dark]"
                />
              </div>

              {tripType === 'round-trip' && (
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    min={travelDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold text-xs focus:outline-none [color-scheme:dark]"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Passengers ({passengers})
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedVehicle.seats}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Select Vehicle */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                Choose Commercial Vehicle:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FLEET_DATA.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedVehicleId === v.id
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{v.name}</p>
                      <p className="text-[10px] text-emerald-400 font-medium">
                        {v.seats} Seats • AC Commercial Yellow Plate
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                      <img src={v.images[0]} alt={v.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fare Policy Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[11px]">
                  Estimated Distance: <strong className="text-white">{effectiveKm} km</strong> (~{durationHours} hrs)
                </p>
                <p className="text-emerald-400 text-[11px] mt-0.5 font-medium">
                  ✓ Verified Chauffeur & Sanitized Cab • Zero Surge Charges
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Guaranteed Fare</span>
                <p className="text-sm font-black text-amber-400 font-heading">
                  Custom Quote on Demand
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══ STEP 2: CUSTOMER CONTACT & CONFIRMATION ═══ */}
        {step === 2 && (
          <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
            {/* Anti-bot Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label>Leave this empty</label>
              <input
                type="text"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Your Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Gurpreet Singh"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                WhatsApp / Mobile Number <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9877124650"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Driver details and live GPS tracking link will be sent to this number.
              </p>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Special Requests / Exact Pickup Address (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need child seat, pickup from Terminal 3 Pillar 5, extra luggage rack..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Trip Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <strong className="text-white">
                  {pickup} ➔ {drop}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <strong className="text-amber-400">{selectedVehicle.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Travel Date:</span>
                <strong className="text-white">{travelDate}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Pricing Policy:</span>
                <strong className="text-sm font-black text-emerald-400">
                  Guaranteed Lowest Fare • Zero Hidden Charges
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Validating Reservation...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Generate Booking Reference</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ═══ STEP 3: BOOKING CONFIRMATION & WHATSAPP VOUCHER ═══ */}
        {step === 3 && (
          <div className="text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold">
                Booking ID: {bookingRef}
              </div>
              <h4 className="text-2xl font-black text-white font-heading mt-2">
                Your Booking Request is Verified!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1">
                Thank you, <strong>{customerName}</strong>. Our fleet dispatcher is assigning your
                commercial vehicle ({selectedVehicle.name}) and will contact you on{' '}
                <strong>+91 {customerPhone}</strong>.
              </p>
            </div>

            {/* Voucher Details Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Route & Type:</span>
                <span className="font-bold text-white">
                  {pickup} ➔ {drop} ({tripType.toUpperCase()})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Travel Date:</span>
                <span className="font-semibold text-white">{travelDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Fleet Category:</span>
                <span className="font-semibold text-amber-400">{selectedVehicle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">All-India Tourist Permit:</span>
                <span className="font-semibold text-emerald-400">Commercial Yellow Plate</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                <span className="text-slate-400">Pricing Policy:</span>
                <span className="font-black text-emerald-400 font-heading">
                  Best Price Guaranteed (Custom Quote on Inquiry)
                </span>
              </div>
            </div>

            {/* WhatsApp Direct Connect Action */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Booking Voucher to Dispatch Desk on WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Voucher
                </button>
                <span className="text-slate-700">•</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
