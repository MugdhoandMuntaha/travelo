import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { ReferrerModel, ReferralClickModel } from '@/models/Referral';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refCode } = body;

    if (!refCode) {
      return NextResponse.json({ success: false, error: 'refCode is required' }, { status: 400 });
    }

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, logged: true, message: 'Click tracked in demo mode' });
    }

    const refModel: any = ReferrerModel;
    const referrer = await refModel.findOne({ refCode: refCode.trim() });
    if (!referrer) {
      return NextResponse.json({ success: true, logged: false, message: 'Invalid refCode' });
    }

    const click = new ReferralClickModel({ refCode: refCode.trim() });
    await click.save();
    return NextResponse.json({ success: true, logged: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
