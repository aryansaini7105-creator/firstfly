export type InquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';

export type InquiryType = 'booking' | 'callback' | 'tour_package' | 'general_contact' | 'quote';

export interface Inquiry {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  pickup?: string;
  drop?: string;
  tripType?: string;
  selectedPackage?: string;
  vehicleName?: string;
  travelDate?: string;
  returnDate?: string;
  numberOfTravellers?: string;
  message?: string;
  bookingRef?: string;
  inquiryType: InquiryType;
  submissionTimestamp: string;
  createdAt: string;
  status: InquiryStatus;
  internalNotes?: string;
}
