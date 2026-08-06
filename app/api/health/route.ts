import { NextResponse } from 'next/server';
import { connectToDatabase, isDbConnected } from '@/lib/db';

export async function GET() {
  await connectToDatabase();
  const connected = isDbConnected();
  return NextResponse.json({
    status: 'online',
    dbConnected: connected,
    message: connected
      ? 'Connected to MongoDB Atlas'
      : 'MongoDB connecting or error. Running in resilient demo mode.'
  });
}
