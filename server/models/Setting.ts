import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  whatsappNumber: string;
  phoneNumber: string;
  agencyEmail: string;
  agencyAddress: string;
  updatedAt: Date;
}

const SettingSchema: Schema = new Schema({
  whatsappNumber: { type: String, required: true, default: '8801700000000' },
  phoneNumber: { type: String, required: true, default: '8801700000000' },
  agencyEmail: { type: String, default: 'contact@travelo.com' },
  agencyAddress: { type: String, default: 'Dhaka, Bangladesh' },
  updatedAt: { type: Date, default: Date.now }
});

export const SettingModel = mongoose.model<ISetting>('Setting', SettingSchema);
