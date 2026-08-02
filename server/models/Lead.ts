import mongoose from 'mongoose';

export interface ILead {
  title: string;
  category: string;
  priceEstimate?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  status: 'New' | 'Contacted' | 'Booked' | 'Cancelled';
  createdAt?: Date;
}

const LeadSchema = new mongoose.Schema<ILead>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  priceEstimate: { type: String },
  customerName: { type: String, default: 'Guest' },
  customerPhone: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Booked', 'Cancelled'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

export const LeadModel = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
