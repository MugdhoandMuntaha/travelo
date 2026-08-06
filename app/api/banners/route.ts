import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { BannerModel } from '@/models/Banner';

const DEFAULT_BANNERS = [
  {
    _id: 'default-1',
    title: "Explore Cox's Bazar Beach Getaways",
    subtitle: 'Direct Flight Ticket + 4-Star Resort Stay starting from ৳8,900',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Cox\'s Bazar',
    badge: 'Popular Destination',
    order: 1,
    active: true
  },
  {
    _id: 'default-2',
    title: 'Bangkok & Pattaya Tropical Escape',
    subtitle: 'Exclusive 5D4N Packages with Express Visa Assistance & Transfers',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Thailand',
    badge: 'Best International Deal',
    order: 2,
    active: true
  },
  {
    _id: 'default-3',
    title: 'Holy Umrah & Saudi Arabia Packages',
    subtitle: 'Guaranteed Discounted Airline Fares, Visa Processing & Hotel Stay',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Umrah',
    badge: 'Umrah Special',
    order: 3,
    active: true
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, banners: DEFAULT_BANNERS });
    }
    const model: any = BannerModel;
    let banners = await model.find({ active: true }).sort({ order: 1 });
    if (banners.length === 0) {
      banners = await model.insertMany(DEFAULT_BANNERS.map(({ _id, ...rest }) => rest));
    }
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    return NextResponse.json({ success: true, banners: DEFAULT_BANNERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, ctaText, badge, order, active } = body;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        banner: { _id: Date.now().toString(), title, subtitle, imageUrl, ctaText, badge, order: order || 1, active: active ?? true }
      }, { status: 201 });
    }

    const banner = new BannerModel({ title, subtitle, imageUrl, ctaText, badge, order, active });
    await banner.save();
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
