import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  AlertCircle,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  Trash2,
  Send,
  Calendar,
  User,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { COMPANY_DETAILS } from '../data/travelData';

export interface OwnerInteraction {
  id: string;
  type:
    | 'callback_5min'
    | 'booking_quote'
    | 'direct_call'
    | 'whatsapp_click'
    | 'ai_concierge_chat'
    | 'fare_calculated';
  customerName?: string;
  customerPhone?: string;
  route?: string;
  vehicle?: string;
  details?: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'booked' | 'archived';
  ownerNotes?: string;
}

interface OwnerStats {
  total: number;
  unreadCount: number;
  todayCount: number;
  callbacks: number;
  bookings: number;
  directCalls: number;
  whatsappClicks: number;
  chats: number;
}

interface OwnerDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerDeskModal: React.FC<OwnerDeskModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [interactions, setInteractions] = useState<OwnerInteraction[]>([]);
  const [stats, setStats] = useState<OwnerStats>({
    total: 0,
    unreadCount: 0,
    todayCount: 0,
    callbacks: 0,
    bookings: 0,
    directCalls: 0,
    whatsappClicks: 0,
    chats: 0,
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastSeenId, setLastSeenId] = useState<string | null>(null);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  const prevCountRef = useRef<number>(0);

  const fetchInteractions = async (isManual = false) => {
    if (isManual) setIsLoading(true);
    try {
      const res = await fetch('/api/owner/interactions');
      const data = await res.json();
      if (data.success && Array.isArray(data.interactions)) {
        setInteractions(data.interactions);
        if (data.stats) setStats(data.stats);

        // Detect new interaction for audio notification
        if (prevCountRef.current > 0 && data.interactions.length > prevCountRef.current) {
          const newest = data.interactions[0];
          setAlertBanner(`🚨 New inquiry from ${newest.customerName || 'Customer'} (${newest.customerPhone || 'Direct'})`);
          if (audioEnabled) {
            playChime();
          }
        }
        prevCountRef.current = data.interactions.length;
      }
    } catch (err) {
      console.error('Failed to fetch interactions:', err);
    } finally {
      if (isManual) setIsLoading(false);
    }
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext may be restricted by browser policy
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInteractions(true);
      const interval = setInterval(() => {
        fetchInteractions(false);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [isOpen, audioEnabled]);

  const handleUpdateStatus = async (id: string, newStatus: OwnerInteraction['status']) => {
    try {
      const res = await fetch(`/api/owner/interactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInteractions((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      await fetch(`/api/owner/interactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerNotes: notes }),
      });
    } catch (err) {
      console.error('Update notes error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interaction?')) return;
    try {
      const res = await fetch(`/api/owner/interactions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setInteractions((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSimulateTest = async () => {
    try {
      const res = await fetch('/api/owner/test-alert', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchInteractions(true);
        setAlertBanner('⚡ Test lead created! Real-time alerts are operational.');
      }
    } catch (err) {
      console.error('Simulate test error:', err);
    }
  };

  const filteredList = interactions.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      (item.customerName && item.customerName.toLowerCase().includes(query)) ||
      (item.customerPhone && item.customerPhone.includes(query)) ||
      (item.route && item.route.toLowerCase().includes(query)) ||
      (item.vehicle && item.vehicle.toLowerCase().includes(query)) ||
      (item.details && item.details.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Just now';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return 'Today';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-slate-950/90 overflow-hidden text-slate-100">
        {/* ═══ MODAL HEADER ═══ */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black shadow-inner">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {t('ownerDeskHeading')}
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Owner Direct: {COMPANY_DETAILS.phone} • hsingh67243@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                audioEnabled
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={audioEnabled ? 'Sound alert enabled on new inquiry' : 'Sound alert muted'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Manual Refresh */}
            <button
              type="button"
              onClick={() => fetchInteractions(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Refresh leads"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
              title="Close Owner Desk"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ═══ LIVE NOTIFICATION BANNER ═══ */}
        {alertBanner && (
          <div className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
            <span className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 shrink-0" />
              <span>{alertBanner}</span>
            </span>
            <button
              type="button"
              onClick={() => setAlertBanner(null)}
              className="text-[11px] underline font-black cursor-pointer hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ═══ KPI SUMMARY CARDS ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px] font-medium">{t('ownerStatsTotal')}</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5">{stats.total}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              📊
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-[11px] font-bold">{t('ownerStatsNew')}</p>
              <p className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                {stats.unreadCount}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              ⚡
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px] font-medium">{t('ownerStatsCallbacks')}</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                {stats.callbacks}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              📞
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px] font-medium">{t('ownerStatsBookings')}</p>
              <p className="text-xl sm:text-2xl font-black text-sky-400 mt-0.5">{stats.bookings}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              📅
            </div>
          </div>
        </div>

        {/* ═══ FILTER BAR & CONTROLS ═══ */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: t('ownerTabAll') },
              { id: 'callback_5min', label: t('ownerTabCallbacks') },
              { id: 'booking_quote', label: t('ownerTabBookings') },
              { id: 'direct_call', label: t('ownerTabDirectCalls') },
              { id: 'whatsapp_click', label: t('ownerTabWhatsApp') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search phone, name, route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Simulate Test Lead */}
            <button
              type="button"
              onClick={handleSimulateTest}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 shrink-0 cursor-pointer"
              title="Add a test lead to verify alert sound and notifications"
            >
              {t('ownerBtnSimulateTest')}
            </button>

            {/* Export CSV */}
            <a
              href="/api/owner/export-csv"
              download
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/40 font-bold shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('ownerBtnExportCSV')}</span>
            </a>
          </div>
        </div>

        {/* ═══ INTERACTION FEED (SCROLLABLE) ═══ */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {filteredList.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="text-base font-bold text-slate-400">No customer interactions found.</p>
              <p className="text-xs mt-1">
                When visitors click Call, WhatsApp, request a 5-min callback, or submit a booking,
                they will appear here instantly!
              </p>
              <button
                type="button"
                onClick={handleSimulateTest}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Create Test Lead Now
              </button>
            </div>
          ) : (
            filteredList.map((item) => {
              const isCallback = item.type === 'callback_5min';
              const isBooking = item.type === 'booking_quote';
              const isDirectCall = item.type === 'direct_call';
              const isWhatsApp = item.type === 'whatsapp_click';

              const badgeColor = isCallback
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : isBooking
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                  : isDirectCall
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

              const cleanPhone = (item.customerPhone || '').replace(/\D/g, '');

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.status === 'new'
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/5'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Lead Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}
                        >
                          {item.type.replace('_', ' ')}
                        </span>

                        <span className="text-xs font-black text-white">
                          {item.customerName || 'Customer'}
                        </span>

                        {cleanPhone && (
                          <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            +91 {cleanPhone}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>
                            {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
                          </span>
                        </span>
                      </div>

                      {/* Route or vehicle */}
                      {(item.route || item.vehicle) && (
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-0.5">
                          {item.route && (
                            <span className="flex items-center gap-1 text-slate-200 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-amber-400" />
                              <span>{item.route}</span>
                            </span>
                          )}
                          {item.vehicle && (
                            <span className="flex items-center gap-1 text-slate-300">
                              <Car className="w-3.5 h-3.5 text-sky-400" />
                              <span>{item.vehicle}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Details summary */}
                      {item.details && (
                        <p className="text-xs text-slate-400 leading-relaxed font-normal bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
                          {item.details}
                        </p>
                      )}

                      {/* Internal Notes Editor */}
                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder="Add internal dispatch note (e.g. Assigned Jaswinder Innova HR68...)"
                          defaultValue={item.ownerNotes || ''}
                          onBlur={(e) => handleUpdateNotes(item.id, e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800/80 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
                        />
                      </div>
                    </div>

                    {/* Right: Instant Contact Actions & Status */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0">
                      {/* 1-Tap Dial Customer */}
                      {cleanPhone && (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
                            title={`Call Customer directly: ${cleanPhone}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>

                          <a
                            href={`https://wa.me/91${cleanPhone}?text=Hello%20from%20FirstFly%20Tours%20%26%20Travels!%20Regarding%20your%20cab%20inquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                            title={`Chat with Customer on WhatsApp`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      )}

                      {/* Status Selector */}
                      <div className="flex items-center gap-1.5">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              item.id,
                              e.target.value as OwnerInteraction['status']
                            )
                          }
                          className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="new">🔴 Action Needed</option>
                          <option value="contacted">🟡 Contacted</option>
                          <option value="booked">🟢 Cab Booked</option>
                          <option value="archived">⚪ Archived</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ═══ FOOTER INFO ═══ */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FirstFly Dispatch Desk • Data encrypted & persistent in database.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
