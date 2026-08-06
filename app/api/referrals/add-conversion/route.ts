import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { ReferrerModel, ReferralConversionModel } from '@/models/Referral';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refCode, clientName, bookingValue, commissionAmount, note } = body;

    if (!refCode || !clientName) {
      return NextResponse.json({ success: false, error: 'refCode and clientName are required' }, { status: 400 });
    }

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, logged: true, message: 'Conversion recorded in demo mode' });
    }

    const refModel: any = ReferrerModel;
    const referrer = await refModel.findOne({ refCode: refCode.trim() });
    if (!referrer) {
      return NextResponse.json({ success: false, error: 'Invalid refCode' }, { status: 400 });
    }

    const calcCommission = commissionAmount || Math.round((bookingValue || 0) * (referrer.commissionRate / 100));

    const conversion = new ReferralConversionModel({
      refCode: refCode.trim(),
      clientName,
      bookingValue: bookingValue || 0,
      commissionAmount: calcCommission,
      status: 'Unpaid',
      note: note || ''
    });

    await conversion.save();
    return NextResponse.json({ success: true, conversion }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
