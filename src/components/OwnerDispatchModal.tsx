import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  Clock,
  Car,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Flame,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BookingLead {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  pickup: string;
  drop: string;
  tripType: string;
  travelDate: string;
  returnDate?: string;
  vehicleName: string;
  passengers: string;
  notes?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface CallbackLead {
  id: string;
  phone: string;
  name: string;
  status: 'new' | 'contacted' | 'confirmed';
  requestedAt: string;
}

interface ChatLead {
  id: string;
  message: string;
  reply: string;
  timestamp: string;
  phoneDetected?: string;
}

interface OwnerDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerDispatchModal: React.FC<OwnerDispatchModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'callbacks' | 'bookings' | 'chats'>('callbacks');
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true); // default unlocked for convenience, can be locked with PIN
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingCallbacks: 0,
    unreadBookings: 0,
    totalChats: 0,
    hotLeads: 0,
  });

  const [bookings, setBookings] = useState<BookingLead[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackLead[]>([]);
  const [chats, setChats] = useState<ChatLead[]>([]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/owner/interactions');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setBookings(data.bookings || []);
        setCallbacks(data.callbacks || []);
        setChats(data.chats || []);

        const currentTotal = (data.stats.pendingCallbacks || 0) + (data.stats.unreadBookings || 0);
        if (soundEnabled && currentTotal > lastCount && lastCount > 0) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.1;
            osc.start();
            setTimeout(() => osc.stop(), 300);
          } catch {}
        }
        setLastCount(currentTotal);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
      const interval = setInterval(fetchLeads, 4000); // 4-sec real-time live poll
      return () => clearInterval(interval);
    }
  }, [isOpen, soundEnabled, lastCount]);

  const handleUpdateStatus = async (type: 'booking' | 'callback', id: string, status: string) => {
    try {
      await fetch('/api/owner/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status }),
      });
      fetchLeads();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleDelete = async (type: 'booking' | 'callback' | 'chat', id: string) => {
    try {
      await fetch('/api/owner/interaction', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      });
      fetchLeads();
    } catch (e) {
      console.error('Failed to delete interaction:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-heading">
                  {t('ownerModalTitle')}
                </h2>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t('ownerLiveConnected')} • Helpline: +91 98771 24650
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute alert chime' : 'Enable alert sound'}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                soundEnabled
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={fetchLeads}
              disabled={isLoading}
              title="Refresh leads"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800/80">
          <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/50 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-rose-300 flex items-center justify-between">
              Pending Callbacks
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </span>
            <span className="text-2xl font-black text-rose-200 mt-1">{stats.pendingCallbacks}</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
              New Bookings
              <Car className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <span className="text-2xl font-black text-amber-200 mt-1">{stats.unreadBookings}</span>
          </div>

          <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-800/50 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-sky-300 flex items-center justify-between">
              Total Inquiries
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </span>
            <span className="text-2xl font-black text-sky-200 mt-1">{stats.totalBookings}</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
              Hot Chat Leads
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <span className="text-2xl font-black text-emerald-200 mt-1">{stats.hotLeads}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/90 px-3 sm:px-4 gap-2">
          <button
            onClick={() => setActiveTab('callbacks')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-black border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'callbacks'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🚨 {t('ownerTabCallbacks')}</span>
            {stats.pendingCallbacks > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                {stats.pendingCallbacks}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-black border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🚗 {t('ownerTabBookings')}</span>
            {stats.unreadBookings > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {stats.unreadBookings}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-black border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chats'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>💬 {t('ownerTabChats')}</span>
            {stats.hotLeads > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5" /> {stats.hotLeads}
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* TAB 1: Callbacks */}
          {activeTab === 'callbacks' && (
            <div className="space-y-2.5">
              {callbacks.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No callback requests yet. Customers requesting 5-min callbacks appear here in real time.
                </div>
              ) : (
                callbacks.map((cb) => (
                  <div
                    key={cb.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      cb.status === 'new'
                        ? 'bg-rose-950/25 border-rose-600/70 shadow-lg shadow-rose-950/30'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{cb.name || 'Customer'}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cb.status === 'new'
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                          }`}
                        >
                          {cb.status === 'new' ? 'NEW CALLBACK' : 'CONTACTED'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(cb.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-base sm:text-lg font-black text-amber-300 mt-1 font-mono tracking-wider">
                        +91 {cb.phone}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${cb.phone}`}
                        className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t('ownerActionCall')}</span>
                      </a>

                      <a
                        href={`https://wa.me/91${cb.phone}?text=${encodeURIComponent(
                          'नमस्ते! FirstFly Tours & Travels से संपर्क कर रहे हैं। आपने कैब बुकिंग के लिए कॉल बैक का अनुरोध किया था। हम आपकी क्या सेवा कर सकते हैं?'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{t('ownerActionWhatsApp')}</span>
                      </a>

                      {cb.status === 'new' ? (
                        <button
                          onClick={() => handleUpdateStatus('callback', cb.id, 'contacted')}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700"
                        >
                          ✓ {t('ownerMarkContacted')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus('callback', cb.id, 'new')}
                          className="py-2 px-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs hover:text-white"
                        >
                          Reset
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete('callback', cb.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete callback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Bookings */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No bookings received yet. Bookings submitted by travelers will display here instantly.
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      b.status === 'new'
                        ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 mb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{b.customerName}</span>
                          <span className="text-xs font-bold text-amber-300 font-mono">+91 {b.customerPhone}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === 'new'
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : b.status === 'confirmed'
                                ? 'bg-emerald-500 text-slate-950 font-black'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {b.bookingRef} • {new Date(b.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${b.customerPhone}`}
                          className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                        <a
                          href={`https://wa.me/91${b.customerPhone}?text=${encodeURIComponent(
                            `Hello ${b.customerName}! We received your FirstFly cab booking inquiry for ${b.pickup} to ${b.drop} (${b.vehicleName}). We are pleased to confirm vehicle availability!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">ROUTE</span>
                        <strong className="text-white">{b.pickup} ➔ {b.drop}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">VEHICLE</span>
                        <strong className="text-amber-300">{b.vehicleName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">TRAVEL DATE</span>
                        <strong className="text-white">{b.travelDate} ({b.tripType})</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">PASSENGERS</span>
                        <strong className="text-white">{b.passengers} Seats</strong>
                      </div>
                    </div>

                    {b.notes && (
                      <p className="mt-2 text-xs text-slate-400 bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-500 font-bold">Notes:</span> {b.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5">
                        {b.status !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus('booking', b.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold hover:bg-emerald-900"
                          >
                            ✓ {t('ownerMarkConfirmed')}
                          </button>
                        )}
                        {b.status !== 'contacted' && (
                          <button
                            onClick={() => handleUpdateStatus('booking', b.id, 'contacted')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          >
                            {t('ownerMarkContacted')}
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete('booking', b.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Chats & AI Inquiries */}
          {activeTab === 'chats' && (
            <div className="space-y-3">
              {chats.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No chat inquiries logged yet. Customer conversations with the 24/7 AI concierge will stream here.
                </div>
              ) : (
                chats.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-2xl border ${
                      c.phoneDetected
                        ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {c.phoneDetected ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center gap-1">
                            <Flame className="w-3 h-3" /> PHONE SHARED: +91 {c.phoneDetected}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            CHAT INQUIRY
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {new Date(c.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {c.phoneDetected && (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${c.phoneDetected}`}
                            className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                          <a
                            href={`https://wa.me/91${c.phoneDetected}?text=${encodeURIComponent(
                              'Hello! We saw your question on FirstFly. How can we assist you with your trip today?'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-white font-medium bg-slate-900 p-2.5 rounded-xl border border-slate-800 mb-1.5">
                      <span className="text-amber-400 font-bold">User:</span> {c.message}
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 font-bold">AI Reply:</span> {c.reply}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-between px-4">
          <span>Connected to FirstFly 24/7 Live Engine</span>
          <span className="text-slate-400">Owner Helpline: +91 98771 24650</span>
        </div>
      </div>
    </div>
  );
};
