import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { VisaModel } from '@/models/Visa';

const DEFAULT_VISAS = [
  { _id: 'visa-1', country: 'Thailand Visa', flag: '🇹🇭', processingTime: '4 - 5 Working Days', requirements: ['Passport with 6 Months Validity', '2 Copies Lab Print Photo (35x45mm)', '6 Months Bank Statement & Solvency', 'Trade License (For Businessmen)'], price: '৳5,500', popular: true },
  { _id: 'visa-2', country: 'Malaysia eVisa / Sticker', flag: '🇲🇾', processingTime: '3 - 5 Working Days', requirements: ['Passport Copy & Previous Visas', 'Photo 35x50mm White Background', '6 Months Bank Statement & Solvency'], price: '৳4,800', popular: true },
  { _id: 'visa-3', country: 'Dubai / UAE Tourist Visa', flag: '🇦🇪', processingTime: '48 - 72 Hours', requirements: ['Passport First Page Scan Copy', '1 Photo White Background Copy', 'NID / Birth Certificate Scan'], price: '৳12,500', popular: true },
  { _id: 'visa-4', country: 'Saudi Arabia Tourist / Umrah', flag: '🇸🇦', processingTime: '24 - 48 Hours Express', requirements: ['Passport Scan Copy (Min 6 Months Valid)', 'Photo Digital Copy', 'Biometric Enrollment (If applicable)'], price: '৳14,000', popular: false },
  { _id: 'visa-5', country: 'Singapore Sticker Visa', flag: '🇸🇬', processingTime: '5 - 7 Working Days', requirements: ['Passport & Previous Singapore Visas', 'Official Letter Pad Request', '6 Months Bank Statement & Solvency'], price: '৳6,500', popular: false },
  { _id: 'visa-6', country: 'Vietnam eVisa', flag: '🇻🇳', processingTime: '3 - 4 Working Days', requirements: ['Passport First Page Clear Scan', 'Digital Passport Photo Copy', 'Flight Itinerary Confirmation'], price: '৳4,200', popular: false }
];

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, visas: DEFAULT_VISAS });
    }
    const model: any = VisaModel;
    let visas = await model.find().sort({ createdAt: -1 });
    if (visas.length === 0) {
      visas = await model.insertMany(DEFAULT_VISAS.map(({ _id, ...rest }) => rest));
    }
    return NextResponse.json({ success: true, visas });
  } catch (error: any) {
    return NextResponse.json({ success: true, visas: DEFAULT_VISAS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { country, flag, processingTime, requirements, price, popular } = body;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        visa: { _id: Date.now().toString(), country, flag, processingTime, requirements, price, popular }
      }, { status: 201 });
    }

    const visa = new VisaModel({ country, flag, processingTime, requirements, price, popular });
    await visa.save();
    return NextResponse.json({ success: true, visa }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
