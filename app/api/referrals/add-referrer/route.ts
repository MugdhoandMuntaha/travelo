import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { ReferrerModel } from '@/models/Referral';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, commissionRate } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const base = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8) || 'REF';
    const refCode = base + Math.floor(100 + Math.random() * 900);
    const rate = parseFloat(commissionRate) || 5.0;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        refCode,
        referrer: { name, phone, refCode, commissionRate: rate }
      }, { status: 201 });
    }

    const referrer = new ReferrerModel({
      name,
      phone: phone || '',
      refCode,
      commissionRate: rate
    });

    await referrer.save();
    return NextResponse.json({ success: true, refCode, referrer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
