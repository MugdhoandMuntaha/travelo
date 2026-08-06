import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { FlightModel } from '@/models/Flight';

const DEFAULT_FLIGHTS = [
  { _id: 'def-1', from: 'Dhaka (DAC)', to: "Cox's Bazar (CXB)", type: 'Domestic', airline: 'US-Bangla / Biman', priceEstimate: '৳4,200', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', tag: 'Best Seller' },
  { _id: 'def-2', from: 'Dhaka (DAC)', to: 'Bangkok (BKK)', type: 'International', airline: 'Thai Airways / US-Bangla', priceEstimate: '৳28,500', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', tag: 'Popular Route' },
  { _id: 'def-3', from: 'Dhaka (DAC)', to: 'Kuala Lumpur (KUL)', type: 'International', airline: 'Biman Bangladesh / AirAsia', priceEstimate: '৳32,000', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80' },
  { _id: 'def-4', from: 'Dhaka (DAC)', to: 'Jeddah (JED) - Umrah', type: 'International', airline: 'Saudi Arabian / Biman', priceEstimate: '৳68,000', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80', tag: 'Umrah Special' },
  { _id: 'def-5', from: 'Dhaka (DAC)', to: 'Dubai (DXB)', type: 'International', airline: 'Emirates / FlyDubai', priceEstimate: '৳45,000', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
  { _id: 'def-6', from: 'Dhaka (DAC)', to: 'Sylhet (ZYL)', type: 'Domestic', airline: 'Air Astra / Novoair', priceEstimate: '৳3,800', image: 'https://images.unsplash.com/photo-1586375100100-33433e215d2a?auto=format&fit=crop&w=600&q=80' }
];

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, flights: DEFAULT_FLIGHTS });
    }
    const model: any = FlightModel;
    let flights = await model.find().sort({ createdAt: -1 });
    if (flights.length === 0) {
      flights = await model.insertMany(DEFAULT_FLIGHTS.map(({ _id, ...rest }) => rest));
    }
    return NextResponse.json({ success: true, flights });
  } catch (error: any) {
    return NextResponse.json({ success: true, flights: DEFAULT_FLIGHTS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, type, airline, priceEstimate, image, tag } = body;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        flight: { _id: Date.now().toString(), from, to, type, airline, priceEstimate, image, tag }
      }, { status: 201 });
    }

    const flight = new FlightModel({ from, to, type, airline, priceEstimate, image, tag });
    await flight.save();
    return NextResponse.json({ success: true, flight }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
