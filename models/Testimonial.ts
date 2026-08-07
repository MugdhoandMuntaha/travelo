import mongoose from 'mongoose';

export interface ITestimonial {
  _id?: string;
  stars: number;
  quote: string;
  author: string;
  location: string;
  order?: number;
  active?: boolean;
  createdAt?: Date;
}

const TestimonialSchema = new mongoose.Schema({
  stars: { type: Number, default: 5, min: 1, max: 5 },
  quote: { type: String, required: true },
  author: { type: String, required: true },
  location: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const TestimonialModel = (mongoose.models.Testimonial as mongoose.Model<any>) || mongoose.model('Testimonial', TestimonialSchema);
