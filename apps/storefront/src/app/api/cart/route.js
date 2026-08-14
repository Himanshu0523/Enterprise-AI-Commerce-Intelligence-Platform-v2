import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ items: [], total: 0 });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, item: body });
}
