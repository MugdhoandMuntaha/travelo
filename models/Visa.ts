import mongoose from 'mongoose';

export interface IVisa {
  country: string;
  flag: string;
  processingTime: string;
  requirements: string[];
  price: string;
  popular?: boolean;
  createdAt?: Date;
}

const VisaSchema = new mongoose.Schema({
  country: { type: String, required: true },
  flag: { type: String, default: '🌐' },
  processingTime: { type: String, required: true },
  requirements: { type: [String], default: [] },
  price: { type: String, required: true },
  popular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const VisaModel = (mongoose.models.Visa as mongoose.Model<any>) || mongoose.model('Visa', VisaSchema);
