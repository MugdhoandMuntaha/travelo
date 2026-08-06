import mongoose from 'mongoose';

export interface ISetting {
  whatsappNumber: string;
  phoneNumber: string;
  agencyEmail: string;
  agencyAddress: string;
  updatedAt?: Date;
}

const SettingSchema = new mongoose.Schema({
  whatsappNumber: { type: String, required: true, default: '8801700000000' },
  phoneNumber: { type: String, required: true, default: '8801700000000' },
  agencyEmail: { type: String, default: 'contact@travelo.com' },
  agencyAddress: { type: String, default: 'Dhaka, Bangladesh' },
  updatedAt: { type: Date, default: Date.now }
});

export const SettingModel = (mongoose.models.Setting as mongoose.Model<any>) || mongoose.model('Setting', SettingSchema);
