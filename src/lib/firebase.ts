import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Inquiry } from '../types/inquiry';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Critical startup test connection per SKILL.md
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Any permission-denied here is normal because /test/connection is blocked by default-deny catch-all
    return true;
  }
}

// Call on startup
testConnection().catch(() => {});

// High-level submission helper for all website forms
export async function submitInquiry(inquiryData: Omit<Inquiry, 'status' | 'createdAt' | 'submissionTimestamp'>): Promise<{ id: string; success: boolean }> {
  const now = new Date().toISOString();
  const cleanedPhone = inquiryData.phone.replace(/\D/g, '');

  const payload: Inquiry = {
    name: inquiryData.name.trim(),
    phone: cleanedPhone,
    inquiryType: inquiryData.inquiryType,
    status: 'New',
    createdAt: now,
    submissionTimestamp: now,
    email: inquiryData.email ? inquiryData.email.trim() : '',
    destination: inquiryData.destination ? inquiryData.destination.trim() : '',
    pickup: inquiryData.pickup ? inquiryData.pickup.trim() : '',
    drop: inquiryData.drop ? inquiryData.drop.trim() : '',
    tripType: inquiryData.tripType ? inquiryData.tripType.trim() : '',
    selectedPackage: inquiryData.selectedPackage ? inquiryData.selectedPackage.trim() : '',
    vehicleName: inquiryData.vehicleName ? inquiryData.vehicleName.trim() : '',
    travelDate: inquiryData.travelDate ? inquiryData.travelDate.trim() : '',
    returnDate: inquiryData.returnDate ? inquiryData.returnDate.trim() : '',
    numberOfTravellers: inquiryData.numberOfTravellers ? String(inquiryData.numberOfTravellers).trim() : '',
    message: inquiryData.message ? inquiryData.message.trim() : '',
    bookingRef: inquiryData.bookingRef ? inquiryData.bookingRef.trim() : '',
    internalNotes: '',
  };

  const path = 'inquiries';
  let docRef;
  try {
    docRef = await addDoc(collection(db, path), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  // Trigger secure server-side email alert to owner
  try {
    fetch('/api/notify-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: docRef.id,
        ...payload,
      }),
    }).catch((err) => console.warn('Email notify trigger error:', err));
  } catch {}

  return { id: docRef.id, success: true };
}
