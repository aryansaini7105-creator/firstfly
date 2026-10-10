import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  LogIn,
  LogOut,
  Search,
  Filter,
  Calendar,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Car,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  Trash2,
  Edit3,
  Save,
  ExternalLink,
  Volume2,
  VolumeX,
  ArrowLeft,
  X,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { Inquiry, InquiryStatus, InquiryType } from '../types/inquiry';
import { COMPANY_DETAILS } from '../data/travelData';

const AUTHORIZED_EMAILS = [
  'aryansaini7105@gmail.com',
  'hsingh67243@gmail.com',
];

export const AdminDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Email/Password login state (alternative to Google Popup)
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordLoginMode, setIsPasswordLoginMode] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | InquiryStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | InquiryType>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Selected Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Sound Alert for New Inquiries
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [previousNewCount, setPreviousNewCount] = useState<number | null>(null);

  // ═══ AUTHENTICATION MONITORING ═══
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthChecking(true);
      if (user && user.email) {
        setCurrentUser(user);
        const userEmail = user.email.toLowerCase();
        const authorized = AUTHORIZED_EMAILS.map((e) => e.toLowerCase()).includes(userEmail);

        if (authorized) {
          setIsAuthorized(true);
          setAuthError(null);

          // Bootstrap/Ensure admin document in Firestore
          try {
            const adminDocRef = doc(db, 'admins', user.uid);
            const docSnap = await getDoc(adminDocRef);
            if (!docSnap.exists()) {
              await setDoc(adminDocRef, {
                email: user.email,
                role: 'admin',
                createdAt: new Date().toISOString(),
              });
            }
          } catch (e) {
            console.warn('Could not verify/create admin document:', e);
          }
        } else {
          setIsAuthorized(false);
          setAuthError(`The signed-in account (${user.email}) is not authorized for the FirstFly Admin Portal.`);
        }
      } else {
        setCurrentUser(null);
        setIsAuthorized(false);
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // ═══ FIRESTORE REAL-TIME INQUIRIES LISTENER ═══
  useEffect(() => {
    if (!isAuthorized) {
      setInquiries([]);
      return;
    }

    setIsLoadingInquiries(true);
    setFirestoreError(null);

    const inquiriesCollection = collection(db, 'inquiries');
    const q = query(inquiriesCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Inquiry[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Inquiry, 'id'>),
        }));

        setInquiries(items);
        setIsLoadingInquiries(false);

        // Sound Notification on new inquiries
        const newCount = items.filter((i) => i.status === 'New').length;
        if (previousNewCount !== null && newCount > previousNewCount && soundEnabled) {
          playChime();
        }
        setPreviousNewCount(newCount);
      },
      (error) => {
        console.error('Firestore inquiries onSnapshot error:', error);
        setFirestoreError(error.message);
        setIsLoadingInquiries(false);
        try {
          handleFirestoreError(error, OperationType.LIST, 'inquiries');
        } catch {}
      }
    );

    return () => unsubscribe();
  }, [isAuthorized, soundEnabled, previousNewCount]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  // Google Login Handler
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase();
      if (!email || !AUTHORIZED_EMAILS.map((e) => e.toLowerCase()).includes(email)) {
        await signOut(auth);
        setAuthError(`Account ${email} is not authorized. Authorized emails: ${AUTHORIZED_EMAILS.join(', ')}`);
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setAuthError(err?.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Email/Password Login Handler
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const email = emailInput.trim().toLowerCase();
    if (!email || !passwordInput) {
      setAuthError('Please provide both email and password.');
      return;
    }

    if (!AUTHORIZED_EMAILS.map((e) => e.toLowerCase()).includes(email)) {
      setAuthError(`Registration denied. Only authorized owner emails (${AUTHORIZED_EMAILS.join(', ')}) can access.`);
      return;
    }

    setIsAuthenticating(true);
    try {
      try {
        await signInWithEmailAndPassword(auth, email, passwordInput);
      } catch (signInErr: any) {
        // If user does not exist yet, allow the authorized owner to bootstrap their password
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, passwordInput);
          } catch (createErr: any) {
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      setAuthError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsAuthorized(false);
    setSelectedInquiry(null);
  };

  // Update Status in Firestore
  const handleUpdateStatus = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      const docRef = doc(db, 'inquiries', inquiryId);
      await updateDoc(docRef, {
        status: newStatus,
      });

      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update status. Please check permissions.');
    }
  };

  // Save Internal Notes in Firestore
  const handleSaveNotes = async () => {
    if (!selectedInquiry || !selectedInquiry.id) return;
    setIsSavingNotes(true);
    try {
      const docRef = doc(db, 'inquiries', selectedInquiry.id);
      await updateDoc(docRef, {
        internalNotes: editingNotes,
      });
      setSelectedInquiry({ ...selectedInquiry, internalNotes: editingNotes });
    } catch (err) {
      console.error('Failed to save notes:', err);
      alert('Could not save notes. Please try again.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'inquiries', inquiryId));
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
      alert('Could not delete inquiry.');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries available to export.');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'Phone',
      'Email',
      'Inquiry Type',
      'Status',
      'Destination / Drop',
      'Pickup',
      'Tour Package',
      'Vehicle',
      'Travel Date',
      'Travellers',
      'Customer Message',
      'Internal Notes',
      'Submitted At',
    ];

    const rows = filteredInquiries.map((i) => [
      i.bookingRef || i.id || '',
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${i.phone || ''}"`,
      `"${i.email || ''}"`,
      i.inquiryType || '',
      i.status || '',
      `"${(i.destination || i.drop || '').replace(/"/g, '""')}"`,
      `"${(i.pickup || '').replace(/"/g, '""')}"`,
      `"${(i.selectedPackage || '').replace(/"/g, '""')}"`,
      `"${(i.vehicleName || '').replace(/"/g, '""')}"`,
      `"${i.travelDate || ''}"`,
      `"${i.numberOfTravellers || ''}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${(i.internalNotes || '').replace(/"/g, '""')}"`,
      i.submissionTimestamp || i.createdAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `firstfly-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'All' && item.status !== statusFilter) return false;

        // Type filter
        if (typeFilter !== 'All' && item.inquiryType !== typeFilter) return false;

        // Date filter
        if (dateFilter !== 'all') {
          const itemDate = new Date(item.submissionTimestamp || item.createdAt);
          const now = new Date();
          const diffMs = now.getTime() - itemDate.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);

          if (dateFilter === 'today' && (diffDays > 1 || itemDate.getDate() !== now.getDate())) return false;
          if (dateFilter === '7days' && diffDays > 7) return false;
          if (dateFilter === '30days' && diffDays > 30) return false;
        }

        // Search Query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchPhone = item.phone?.includes(q);
          const matchEmail = item.email?.toLowerCase().includes(q);
          const matchDest = (item.destination || item.drop || '')?.toLowerCase().includes(q);
          const matchPickup = item.pickup?.toLowerCase().includes(q);
          const matchPkg = item.selectedPackage?.toLowerCase().includes(q);
          const matchRef = item.bookingRef?.toLowerCase().includes(q);
          const matchMsg = item.message?.toLowerCase().includes(q);

          if (!matchName && !matchPhone && !matchEmail && !matchDest && !matchPickup && !matchPkg && !matchRef && !matchMsg) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        return 0;
      });
  }, [inquiries, statusFilter, typeFilter, dateFilter, searchQuery, sortBy]);

  // Status Metrics
  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === 'New').length,
      contacted: inquiries.filter((i) => i.status === 'Contacted').length,
      followUp: inquiries.filter((i) => i.status === 'Follow-up').length,
      converted: inquiries.filter((i) => i.status === 'Converted').length,
      closed: inquiries.filter((i) => i.status === 'Closed').length,
    };
  }, [inquiries]);

  // Loading Screen
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Verifying FirstFly Admin credentials...</p>
      </div>
    );
  }

  // ═══ AUTHENTICATION / LOGIN SCREEN ═══
  if (!currentUser || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-4">
              <ShieldCheck className="w-8 h-8 font-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-heading">
              FirstFly <span className="text-amber-400">Admin Portal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Secure Dispatch & Customer Leads Management
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-semibold">Access Denied</p>
                <p className="mt-0.5 text-[11px] text-rose-200/90">{authError}</p>
              </div>
            </div>
          )}

          {/* Primary 1-Click Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isAuthenticating}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 cursor-pointer mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isAuthenticating ? 'Authenticating...' : 'Sign In with Authorized Google Account'}</span>
          </button>

          {/* Toggle between Google & Password login */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Or Owner Password
            </span>
          </div>

          {!isPasswordLoginMode ? (
            <button
              onClick={() => setIsPasswordLoginMode(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Use Admin Email & Password</span>
            </button>
          ) : (
            <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Owner Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="aryansaini7105@gmail.com"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isAuthenticating ? 'Signing In...' : 'Verify & Log In'}
              </button>

              <button
                type="button"
                onClick={() => setIsPasswordLoginMode(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-white mt-2"
              >
                ← Back to Google Login
              </button>
            </form>
          )}

          {/* Security & Access Notice */}
          <div className="mt-8 pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-500 space-y-1">
            <p>Protected by Firebase Authentication & Firestore RBAC Rules.</p>
            <p>Authorized Admin: <span className="text-slate-400 font-mono">aryansaini7105@gmail.com</span></p>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ═══ MAIN AUTHORIZED ADMIN DASHBOARD ═══
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ═══ ADMIN TOP HEADER ═══ */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
              <ShieldCheck className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-white text-base tracking-tight">
                  FIRST<span className="text-amber-400">FLY</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Customer Inquiries & Live Dispatch Desk
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Alert Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              title={soundEnabled ? 'New Inquiry Chime Enabled' : 'New Inquiry Chime Muted'}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'Alerts ON' : 'Alerts OFF'}</span>
            </button>

            {/* View Website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">View Website</span>
            </a>

            {/* Admin User Info & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-white leading-tight">
                  {currentUser.displayName || 'Authorized Admin'}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                  {currentUser.email}
                </p>
              </div>

              <button
                onClick={handleSignOut}
                title="Log Out of Admin Portal"
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MAIN DASHBOARD CONTENT ═══ */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert if Firestore Permission Fails */}
        {firestoreError && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold">Firestore Error: {firestoreError}</p>
                <p className="text-[11px] text-rose-200 mt-0.5">
                  Verify your account is listed in authorized admin users and firestore security rules are deployed.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500"
            >
              Retry
            </button>
          </div>
        )}

        {/* ═══ STATS OVERVIEW CARDS ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Inquiries
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{stats.total}</span>
              <Sparkles className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'New' ? 'All' : 'New')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              statusFilter === 'New'
                ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              New (Pending)
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400">{stats.new}</span>
              <Clock className="w-4 h-4 text-amber-500/60" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'Contacted' ? 'All' : 'Contacted')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              statusFilter === 'Contacted'
                ? 'bg-sky-500/15 border-sky-500'
                : 'bg-slate-900 border-slate-800 hover:border-sky-500/50'
            }`}
          >
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
              Contacted
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-400">{stats.contacted}</span>
              <Phone className="w-4 h-4 text-sky-500/60" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'Follow-up' ? 'All' : 'Follow-up')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              statusFilter === 'Follow-up'
                ? 'bg-purple-500/15 border-purple-500'
                : 'bg-slate-900 border-slate-800 hover:border-purple-500/50'
            }`}
          >
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
              Follow-up
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-400">{stats.followUp}</span>
              <MessageSquare className="w-4 h-4 text-purple-500/60" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'Converted' ? 'All' : 'Converted')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              statusFilter === 'Converted'
                ? 'bg-emerald-500/15 border-emerald-500'
                : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Converted
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-400">{stats.converted}</span>
              <CheckCircle className="w-4 h-4 text-emerald-500/60" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'Closed' ? 'All' : 'Closed')}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              statusFilter === 'Closed'
                ? 'bg-slate-700 border-slate-500'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Closed
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-400">{stats.closed}</span>
              <CheckCircle className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>

        {/* ═══ FILTER & SEARCH BAR ═══ */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone, email, route, booking ref..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
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

            {/* Quick Actions (Export CSV & Reset Filters) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                title="Export filtered inquiries to CSV file"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export CSV</span>
              </button>

              {(statusFilter !== 'All' || typeFilter !== 'All' || dateFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('All');
                    setTypeFilter('All');
                    setDateFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/70 text-xs">
            {/* Status Dropdown/Badges */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mr-1">
              <Filter className="w-3 h-3 text-amber-400" />
              <span>Status:</span>
            </div>
            {(['All', 'New', 'Contacted', 'Follow-up', 'Converted', 'Closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  statusFilter === s
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}

            <span className="text-slate-700">|</span>

            {/* Type Selector */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mr-1">
              <span>Type:</span>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Types</option>
              <option value="booking">Cab Bookings</option>
              <option value="callback">Callback Requests</option>
              <option value="tour_package">Tour Packages</option>
              <option value="general_contact">General Contact</option>
              <option value="quote">Fare Quotes</option>
            </select>

            <span className="text-slate-700">|</span>

            {/* Date Range Selector */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mr-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Date:</span>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>

            <span className="text-slate-700">|</span>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mr-1">
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] focus:outline-none focus:border-amber-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Customer A-Z</option>
            </select>
          </div>
        </div>

        {/* ═══ INQUIRIES LIST / TABLE ═══ */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {isLoadingInquiries ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs">Loading live customer inquiries from Firestore...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-20 text-center text-slate-400 px-4">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">No inquiries match your current filters</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {inquiries.length === 0
                  ? 'New inquiries submitted via the website booking, callback, or tour forms will automatically appear here in real-time.'
                  : 'Try adjusting your search terms, status, or date range filter above.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Inquiry / Route</th>
                    <th className="py-3 px-4">Vehicle / Pkg</th>
                    <th className="py-3 px-4">Travel Date</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInquiries.map((inquiry) => {
                    const cleanPhone = (inquiry.phone || '').replace(/\D/g, '');
                    const formattedDate = new Date(inquiry.createdAt || inquiry.submissionTimestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={inquiry.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          inquiry.status === 'New' ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        {/* Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleUpdateStatus(inquiry.id!, e.target.value as InquiryStatus)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${
                              inquiry.status === 'New'
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : inquiry.status === 'Contacted'
                                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                                : inquiry.status === 'Follow-up'
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                                : inquiry.status === 'Converted'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>

                        {/* Customer Info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{inquiry.name || 'Anonymous'}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-slate-300 font-mono text-[11px]">{inquiry.phone}</span>
                            {cleanPhone && (
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:+91${cleanPhone}`}
                                  className="p-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                                  title="Call Customer"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                <a
                                  href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                                    inquiry.name || 'Customer'
                                  )},%20FirstFly%20Tours%20%26%20Travels%20here%20regarding%20your%20inquiry.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                  title="WhatsApp Customer"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                          {inquiry.email && (
                            <p className="text-[10px] text-slate-500 truncate max-w-[160px]">{inquiry.email}</p>
                          )}
                        </td>

                        {/* Route / Inquiry Type */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                inquiry.inquiryType === 'booking'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : inquiry.inquiryType === 'tour_package'
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : inquiry.inquiryType === 'callback'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {inquiry.inquiryType}
                            </span>
                            {inquiry.bookingRef && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                #{inquiry.bookingRef}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-slate-300 text-[11px] font-medium max-w-[220px] truncate">
                            {inquiry.pickup && inquiry.drop
                              ? `${inquiry.pickup} ➔ ${inquiry.drop}`
                              : inquiry.destination || inquiry.selectedPackage || inquiry.message || 'General Inquiry'}
                          </div>
                        </td>

                        {/* Vehicle / Package */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-slate-300 text-[11px]">
                            {inquiry.vehicleName || inquiry.selectedPackage || 'Standard'}
                          </span>
                          {inquiry.numberOfTravellers && (
                            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Users className="w-3 h-3" />
                              {inquiry.numberOfTravellers} pax
                            </p>
                          )}
                        </td>

                        {/* Travel Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-slate-300 text-[11px]">
                            {inquiry.travelDate || 'Immediate'}
                          </span>
                          {inquiry.returnDate && (
                            <p className="text-[10px] text-slate-500">Ret: {inquiry.returnDate}</p>
                          )}
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                          {formattedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedInquiry(inquiry);
                                setEditingNotes(inquiry.internalNotes || '');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-[11px] font-bold transition-colors flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Details & Notes</span>
                            </button>

                            <button
                              onClick={() => handleDeleteInquiry(inquiry.id!)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ═══ DETAIL & INTERNAL NOTES MODAL ═══ */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white font-heading">
                    {selectedInquiry.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedInquiry.status === 'New'
                        ? 'bg-amber-500/20 text-amber-400'
                        : selectedInquiry.status === 'Converted'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-sky-500/20 text-sky-400'
                    }`}
                  >
                    {selectedInquiry.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Submitted on {new Date(selectedInquiry.createdAt).toLocaleString('en-IN')}
                  {selectedInquiry.bookingRef && ` • Ref: ${selectedInquiry.bookingRef}`}
                </p>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex-1 min-w-[200px]">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Customer Phone
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  +91 {selectedInquiry.phone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:+91${selectedInquiry.phone.replace(/\D/g, '')}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedInquiry.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                    selectedInquiry.name
                  )},%20FirstFly%20Tours%20%26%20Travels%20dispatch%20desk%20here.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Inquiry Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Inquiry Type</span>
                <span className="text-white font-bold capitalize mt-0.5 block">{selectedInquiry.inquiryType}</span>
              </div>

              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Email</span>
                <span className="text-white mt-0.5 block truncate">{selectedInquiry.email || 'Not provided'}</span>
              </div>

              {(selectedInquiry.pickup || selectedInquiry.drop) && (
                <div className="sm:col-span-2 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Route / Travel Corridor</span>
                  <span className="text-white font-bold mt-0.5 block">
                    {selectedInquiry.pickup || 'Pickup'} ➔ {selectedInquiry.drop || 'Drop'}
                  </span>
                </div>
              )}

              {selectedInquiry.destination && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Destination</span>
                  <span className="text-white font-bold mt-0.5 block">{selectedInquiry.destination}</span>
                </div>
              )}

              {selectedInquiry.selectedPackage && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Tour Package</span>
                  <span className="text-white font-bold mt-0.5 block">{selectedInquiry.selectedPackage}</span>
                </div>
              )}

              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Vehicle</span>
                <span className="text-white mt-0.5 block">{selectedInquiry.vehicleName || 'Standard'}</span>
              </div>

              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Travel Date</span>
                <span className="text-white mt-0.5 block">
                  {selectedInquiry.travelDate || 'Immediate'}
                  {selectedInquiry.returnDate && ` (Return: ${selectedInquiry.returnDate})`}
                </span>
              </div>

              {selectedInquiry.numberOfTravellers && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Travellers / Passengers</span>
                  <span className="text-white mt-0.5 block">{selectedInquiry.numberOfTravellers}</span>
                </div>
              )}

              {selectedInquiry.tripType && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Trip Type</span>
                  <span className="text-white mt-0.5 block capitalize">{selectedInquiry.tripType}</span>
                </div>
              )}
            </div>

            {/* Customer Message / Special Request */}
            {selectedInquiry.message && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1">
                  Customer Message / Special Requirements
                </span>
                <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>
            )}

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Update Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['New', 'Contacted', 'Follow-up', 'Converted', 'Closed'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedInquiry.id!, status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedInquiry.status === status
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Admin Notes (Private — not exposed to visitors) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Internal Notes (Private / Admin Only)
                </label>
                <span className="text-[10px] text-slate-500">
                  Visible only to authorized owner
                </span>
              </div>
              <textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Called customer at 3:15 PM, offered Innova Crysta for ₹6,500 all inclusive. Customer confirmed pickup from Sector 17..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingNotes ? 'Saving Notes...' : 'Save Internal Notes'}</span>
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDeleteInquiry(selectedInquiry.id!)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
