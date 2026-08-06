import mongoose from 'mongoose';

export interface IBanner {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  badge?: string;
  order: number;
  active: boolean;
  createdAt?: Date;
}

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ctaText: { type: String, default: 'Book via WhatsApp' },
  badge: { type: String, default: 'Special Offer' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const BannerModel = (mongoose.models.Banner as mongoose.Model<any>) || mongoose.model('Banner', BannerSchema);
