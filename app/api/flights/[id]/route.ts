import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { FlightModel } from '@/models/Flight';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, message: 'Deleted in demo mode' });
    }
    await FlightModel.deleteOne({ _id: id });
    return NextResponse.json({ success: true, message: 'Flight deal deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
