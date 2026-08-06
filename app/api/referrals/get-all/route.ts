import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { ReferrerModel, ReferralClickModel, ReferralConversionModel } from '@/models/Referral';

const DEFAULT_REFERRERS = [
  { _id: 'ref-1', refCode: 'REF1001', name: 'Tanvir Ahmed (Dhaka Agent)', phone: '01711000000', commissionRate: 5.0, clicks: 42, totalSales: 48000, totalCommission: 2400 },
  { _id: 'ref-2', refCode: 'REF1002', name: 'Rahim Travel Club', phone: '01811000000', commissionRate: 5.0, clicks: 19, totalSales: 14500, totalCommission: 725 }
];

const DEFAULT_CONVERSIONS = [
  { _id: 'conv-1', refCode: 'REF1001', clientName: 'Karim Ahmed', bookingValue: 48000, commissionAmount: 2400, status: 'Unpaid', note: 'Thailand 5D4N Package Inquiry', createdAt: new Date() }
];

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        referrers: DEFAULT_REFERRERS,
        conversions: DEFAULT_CONVERSIONS
      });
    }

    const refModel: any = ReferrerModel;
    const clickModel: any = ReferralClickModel;
    const convModel: any = ReferralConversionModel;

    const referrers = await refModel.find().lean();
    const clicks = await clickModel.find().lean();
    const conversions = await convModel.find().lean();

    const referrersWithStats = referrers.map((ref: any) => {
      const refClicks = clicks.filter((c: any) => c.refCode === ref.refCode).length;
      const refConversions = conversions.filter((c: any) => c.refCode === ref.refCode);
      const totalSales = refConversions.reduce((sum: number, c: any) => sum + (c.bookingValue || 0), 0);
      const totalCommission = refConversions.reduce((sum: number, c: any) => sum + (c.commissionAmount || 0), 0);

      return {
        ...ref,
        clicks: refClicks,
        totalSales,
        totalCommission
      };
    });

    return NextResponse.json({
      success: true,
      referrers: referrersWithStats.length > 0 ? referrersWithStats : DEFAULT_REFERRERS,
      conversions: conversions.length > 0 ? conversions : DEFAULT_CONVERSIONS
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      referrers: DEFAULT_REFERRERS,
      conversions: DEFAULT_CONVERSIONS
    });
  }
}
