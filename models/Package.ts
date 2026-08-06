import mongoose from 'mongoose';

export interface IPackage {
  title: string;
  destination: string;
  duration: string;
  price: string;
  image: string;
  highlights: string[];
  createdAt?: Date;
}

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  highlights: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export const PackageModel = (mongoose.models.Package as mongoose.Model<any>) || mongoose.model('Package', PackageSchema);
