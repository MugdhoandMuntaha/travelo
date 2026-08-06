import mongoose from 'mongoose';

export interface IFlight {
  from: string;
  to: string;
  type: 'Domestic' | 'International';
  airline: string;
  priceEstimate: string;
  image: string;
  tag?: string;
  createdAt?: Date;
}

const FlightSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  type: { type: String, enum: ['Domestic', 'International'], default: 'Domestic' },
  airline: { type: String, required: true },
  priceEstimate: { type: String, required: true },
  image: { type: String, required: true },
  tag: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const FlightModel = (mongoose.models.Flight as mongoose.Model<any>) || mongoose.model('Flight', FlightSchema);
