import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { SettingModel } from '@/models/Setting';

const DEFAULT_SETTINGS = {
  whatsappNumber: '8801700000000',
  phoneNumber: '8801700000000',
  agencyEmail: 'contact@travelobd.com',
  agencyAddress: 'House 45, Road 11, Block D, Banani, Dhaka 1213, Bangladesh'
};

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }
    const model: any = SettingModel;
    let settings = await model.findOne();
    if (!settings) {
      settings = await model.create(DEFAULT_SETTINGS);
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { whatsappNumber, phoneNumber, agencyEmail, agencyAddress } = body;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        settings: { whatsappNumber, phoneNumber, agencyEmail, agencyAddress }
      });
    }

    const model: any = SettingModel;
    let settings = await model.findOne();
    if (!settings) {
      settings = new SettingModel({ whatsappNumber, phoneNumber, agencyEmail, agencyAddress });
    } else {
      if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
      if (phoneNumber !== undefined) settings.phoneNumber = phoneNumber;
      if (agencyEmail !== undefined) settings.agencyEmail = agencyEmail;
      if (agencyAddress !== undefined) settings.agencyAddress = agencyAddress;
      settings.updatedAt = new Date();
    }
    await settings.save();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
