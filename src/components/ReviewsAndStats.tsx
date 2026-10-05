import React, { useState } from 'react';
import {
  Star,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Award,
  Users,
  Car,
  Clock,
  Sparkles,
  PlusCircle,
  X
} from 'lucide-react';
import { CUSTOMER_REVIEWS, COMPANY_DETAILS } from '../data/travelData';
import { CustomerReview } from '../types/travel';

export const ReviewsAndStats: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(CUSTOMER_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    trip: '',
    vehicleUsed: 'Toyota Innova Crysta',
    rating: 5,
    text: '',
  });
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text || !newReview.trip) return;

    const created: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newReview.name,
      location: newReview.location || 'India',
      trip: newReview.trip,
      vehicleUsed: newReview.vehicleUsed,
      rating: newReview.rating,
      date: 'Just now',
      text: newReview.text,
      avatarLetter: newReview.name.slice(0, 2).toUpperCase(),
      accentColor: '#f59e0b',
      verifiedBooking: true,
    };

    setReviews([created, ...reviews]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsReviewModalOpen(false);
      setNewReview({
        name: '',
        location: '',
        trip: '',
        vehicleUsed: 'Toyota Innova Crysta',
        rating: 5,
        text: '',
      });
    }, 1500);
  };

  return (
    <section id="reviews" className="py-20 bg-slate-950/90 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Metrics Counter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-16">
          <div className="text-center sm:text-left sm:border-r border-slate-800/80 pr-4">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-400 mb-1">
              <Award className="w-5 h-5" />
              <span className="text-2xl sm:text-4xl font-black font-heading text-white">4.9 / 5</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Average Customer Rating</p>
          </div>

          <div className="text-center sm:text-left sm:border-r border-slate-800/80 pr-4">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sky-400 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-2xl sm:text-4xl font-black font-heading text-white">1,850+</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Happy Tours Completed</p>
          </div>

          <div className="text-center sm:text-left sm:border-r border-slate-800/80 pr-4">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 mb-1">
              <Car className="w-5 h-5" />
              <span className="text-2xl sm:text-4xl font-black font-heading text-white">42+</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Verified Commercial Fleet</p>
          </div>

          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-purple-400 mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-2xl sm:text-4xl font-black font-heading text-white">99.4%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">On-Time Arrival Record</p>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 100% Real Travelers Reviews
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
              Customer Experiences
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Read authentic feedback from families, corporate teams, and solo travelers who trust
              FirstFly for their journeys across India.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="self-start md:self-end px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div>
                {/* Header with Avatar and Rating */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white text-sm shadow-md"
                      style={{ backgroundColor: rev.accentColor }}
                    >
                      {rev.avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                      <p className="text-[11px] text-slate-400">{rev.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Trip Route Tag */}
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 text-amber-300 font-medium border border-slate-800 text-[11px]">
                    📍 {rev.trip}
                  </span>
                  <span className="text-[10px] text-slate-500">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Vehicle Badge & Verified Stamp */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Vehicle: <strong className="text-slate-200">{rev.vehicleUsed}</strong>
                </span>

                {rev.verifiedBooking && (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Trip
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ WRITE A REVIEW MODAL ═══ */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-heading mb-1">
              Share Your FirstFly Experience
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Your honest feedback helps thousands of travelers choose verified outstation vehicles.
            </p>

            {submittedMessage ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Thank You!</h4>
                <p className="text-xs text-slate-300">
                  Your review has been verified and added to FirstFly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="e.g. Navjot Singh"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Your City</label>
                    <input
                      type="text"
                      value={newReview.location}
                      onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                      placeholder="e.g. Chandigarh, Punjab"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Trip Route</label>
                    <input
                      type="text"
                      required
                      value={newReview.trip}
                      onChange={(e) => setNewReview({ ...newReview, trip: e.target.value })}
                      placeholder="e.g. Delhi to Manali"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Vehicle Used</label>
                    <select
                      value={newReview.vehicleUsed}
                      onChange={(e) => setNewReview({ ...newReview, vehicleUsed: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Toyota Innova Crysta">Toyota Innova Crysta</option>
                      <option value="Maruti Suzuki Ertiga">Maruti Suzuki Ertiga</option>
                      <option value="Force Urbania (17)">Force Urbania (17-Seater)</option>
                      <option value="Force Traveller 12">Force Traveller (12-Seater)</option>
                      <option value="Maruti Dzire / Etios">Maruti Dzire / Etios</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Star Rating</label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReview.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Your Review & Experience
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    placeholder="Tell us about the vehicle condition, chauffeur punctuality, and overall trip comfort..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-md active:scale-95 mt-2"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
