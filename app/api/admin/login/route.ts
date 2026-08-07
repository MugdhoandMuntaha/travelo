import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'TraveloAdmin2026!#';

    if (username === expectedUsername && password === expectedPassword) {
      // Return success response with session token
      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        token: `travelo_session_${Buffer.from(`${expectedUsername}:${Date.now()}`).toString('base64')}`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin username or password. Please try again.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server authentication error' },
      { status: 500 }
    );
  }
}
