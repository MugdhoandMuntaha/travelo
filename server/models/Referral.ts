import mongoose from 'mongoose';

// 1. Referrer / Partner Model
export interface IReferrer {
  _id?: string;
  refCode: string;
  name: string;
  phone?: string;
  commissionRate: number;
  createdAt?: Date;
}

const ReferrerSchema = new mongoose.Schema<IReferrer>({
  refCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  commissionRate: { type: Number, default: 5.0 },
  createdAt: { type: Date, default: Date.now }
});

export const ReferrerModel = mongoose.models.Referrer || mongoose.model<IReferrer>('Referrer', ReferrerSchema);

// 2. Referral Clicks Tracking Model
export interface IReferralClick {
  _id?: string;
  refCode: string;
  createdAt?: Date;
}

const ReferralClickSchema = new mongoose.Schema<IReferralClick>({
  refCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ReferralClickModel = mongoose.models.ReferralClick || mongoose.model<IReferralClick>('ReferralClick', ReferralClickSchema);

// 3. Referral Conversions / Bookings Model
export interface IReferralConversion {
  _id?: string;
  refCode: string;
  clientName: string;
  bookingValue: number;
  commissionAmount: number;
  status: 'Unpaid' | 'Paid';
  note?: string;
  createdAt?: Date;
}

const ReferralConversionSchema = new mongoose.Schema<IReferralConversion>({
  refCode: { type: String, required: true },
  clientName: { type: String, required: true },
  bookingValue: { type: Number, default: 0 },
  commissionAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const ReferralConversionModel = mongoose.models.ReferralConversion || mongoose.model<IReferralConversion>('ReferralConversion', ReferralConversionSchema);
