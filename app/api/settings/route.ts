import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { SettingModel } from '@/models/Setting';

let inMemorySettings = {
  whatsappNumber: '8801700000000',
  phoneNumber: '8801700000000',
  agencyEmail: 'contact@travelobd.com',
  agencyAddress: 'House 45, Road 11, Block D, Banani, Dhaka 1213, Bangladesh'
};

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, settings: inMemorySettings });
    }
    const model: any = SettingModel;
    let settings = await model.findOne();
    if (!settings) {
      settings = await model.create(inMemorySettings);
    } else {
      // Sync inMemorySettings
      inMemorySettings = {
        whatsappNumber: settings.whatsappNumber || inMemorySettings.whatsappNumber,
        phoneNumber: settings.phoneNumber || inMemorySettings.phoneNumber,
        agencyEmail: settings.agencyEmail || inMemorySettings.agencyEmail,
        agencyAddress: settings.agencyAddress || inMemorySettings.agencyAddress
      };
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: true, settings: inMemorySettings });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { whatsappNumber, phoneNumber, agencyEmail, agencyAddress } = body;

    if (whatsappNumber !== undefined) inMemorySettings.whatsappNumber = whatsappNumber;
    if (phoneNumber !== undefined) inMemorySettings.phoneNumber = phoneNumber;
    if (agencyEmail !== undefined) inMemorySettings.agencyEmail = agencyEmail;
    if (agencyAddress !== undefined) inMemorySettings.agencyAddress = agencyAddress;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        settings: inMemorySettings
      });
    }

    const model: any = SettingModel;
    let settings = await model.findOne();
    if (!settings) {
      settings = new SettingModel(inMemorySettings);
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
    return NextResponse.json({ success: true, settings: inMemorySettings });
  }
}
