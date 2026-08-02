export interface FlightDeal {
  id: string;
  from: string;
  to: string;
  type: 'Domestic' | 'International';
  airline: string;
  priceEstimate: string;
  image: string;
  tag?: string;
}

export interface VisaService {
  country: string;
  flag: string;
  processingTime: string;
  requirements: string[];
  price: string;
  popular?: boolean;
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  image: string;
  highlights: string[];
}

export interface ReferralData {
  partnerName: string;
  partnerMobile: string;
  referralCode: string;
  referralLink: string;
  totalLeads: number;
  confirmedBookings: number;
  earnedCommission: number;
  pendingPayout: number;
}
