import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { LeadModel } from '@/models/Lead';

const DEFAULT_LEADS = [
  { _id: 'lead-1', title: 'Cox\'s Bazar (CXB) Flight Ticket', category: 'Flight', priceEstimate: '৳4,200', customerName: 'Karim Ahmed', customerPhone: '01711223344', status: 'New', notes: 'Ref: REF1001', createdAt: new Date() },
  { _id: 'lead-2', title: 'Thailand Visa Assistance', category: 'Visa', priceEstimate: '৳5,500', customerName: 'Nusrat Jahan', customerPhone: '01899887766', status: 'Contacted', notes: 'Needs urgent submission', createdAt: new Date() }
];

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, leads: DEFAULT_LEADS });
    }
    const model: any = LeadModel;
    const leads = await model.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, leads: leads.length > 0 ? leads : DEFAULT_LEADS });
  } catch (error: any) {
    return NextResponse.json({ success: true, leads: DEFAULT_LEADS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, priceEstimate, customerName, customerPhone, notes } = body;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        lead: { _id: Date.now().toString(), title, category, priceEstimate, customerName, customerPhone, notes, status: 'New', createdAt: new Date() }
      }, { status: 201 });
    }

    const lead = new LeadModel({ title, category, priceEstimate, customerName, customerPhone, notes });
    await lead.save();
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
