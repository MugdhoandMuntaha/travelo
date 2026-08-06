import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { PackageModel } from '@/models/Package';

const DEFAULT_PACKAGES = [
  { _id: 'pkg-1', title: 'Luxury Cox\'s Bazar Beach & Hill Retreat', destination: 'Cox\'s Bazar, Bangladesh', duration: '3 Days / 2 Nights', price: '৳14,500 / Person', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', highlights: ['5-Star Oceanfront Hotel Stay', 'Buffet Breakfast & Airport Pick/Drop', 'Private Beach Lounge & Sunset Cruise'] },
  { _id: 'pkg-2', title: 'Thailand Highlights: Bangkok & Phuket Grand Tour', destination: 'Bangkok & Phuket, Thailand', duration: '5 Days / 4 Nights', price: '৳48,000 / Person', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', highlights: ['Flight Ticket & Express Visa Included', 'Phi Phi Island Speedboat Trip with Lunch', 'City Tour & Temple Visits'] },
  { _id: 'pkg-3', title: 'Premium Umrah Group Package 2026', destination: 'Makkah & Madinah, Saudi Arabia', duration: '14 Days / 13 Nights', price: '৳135,000 / Person', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80', highlights: ['Direct Saudi Airlines Flight', '300m Close Hotel to Haram', 'Guided Ziyarah & Express Visa'] }
];

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, packages: DEFAULT_PACKAGES });
    }
    const model: any = PackageModel;
    let packages = await model.find().sort({ createdAt: -1 });
    if (packages.length === 0) {
      packages = await model.insertMany(DEFAULT_PACKAGES.map(({ _id, ...rest }) => rest));
    }
    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    return NextResponse.json({ success: true, packages: DEFAULT_PACKAGES });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, destination, duration, price, image, highlights } = body;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        package: { _id: Date.now().toString(), title, destination, duration, price, image, highlights }
      }, { status: 201 });
    }

    const pkg = new PackageModel({ title, destination, duration, price, image, highlights });
    await pkg.save();
    return NextResponse.json({ success: true, package: pkg }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
