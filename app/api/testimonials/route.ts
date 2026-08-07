import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';
import { TestimonialModel } from '@/models/Testimonial';

const DEFAULT_TESTIMONIALS = [
  {
    _id: 'default-1',
    stars: 5,
    quote: "Booked our Cox's Bazar trip through Travelo — everything from tickets to hotel was sorted in one call. Very smooth.",
    author: "Tanvir Hossain",
    location: "Dhaka",
    order: 1,
    active: true
  },
  {
    _id: 'default-2',
    stars: 5,
    quote: "Quick response on WhatsApp and honest advice on fares. Will book again.",
    author: "Nusrat Jahan",
    location: "Chittagong",
    order: 2,
    active: true
  },
  {
    _id: 'default-3',
    stars: 5,
    quote: "Got my Thailand visa assistance done within 4 days with zero hassle. Extremely reliable service!",
    author: "Mahmudur Rahman",
    location: "Sylhet",
    order: 3,
    active: true
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, testimonials: DEFAULT_TESTIMONIALS });
    }
    const model: any = TestimonialModel;
    let testimonials = await model.find({ active: true }).sort({ order: 1, createdAt: -1 });
    if (testimonials.length === 0) {
      testimonials = await model.insertMany(DEFAULT_TESTIMONIALS.map(({ _id, ...rest }) => rest));
    }
    return NextResponse.json({ success: true, testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: true, testimonials: DEFAULT_TESTIMONIALS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stars, quote, author, location, order, active } = body;

    await connectToDatabase();
    if (!isDbConnected()) {
      return NextResponse.json({
        success: true,
        testimonial: { 
          _id: Date.now().toString(), 
          stars: stars || 5, 
          quote, 
          author, 
          location, 
          order: order || 0, 
          active: active ?? true 
        }
      }, { status: 201 });
    }

    const testimonial = new TestimonialModel({
      stars: stars || 5,
      quote,
      author,
      location,
      order: order || 0,
      active: active ?? true
    });
    await testimonial.save();
    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
