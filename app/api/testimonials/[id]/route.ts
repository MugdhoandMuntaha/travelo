import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { TestimonialModel } from '@/models/Testimonial';

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
    await TestimonialModel.deleteOne({ _id: id });
    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, message: 'Updated in demo mode' });
    }
    const model: any = TestimonialModel;
    const updated = await model.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
