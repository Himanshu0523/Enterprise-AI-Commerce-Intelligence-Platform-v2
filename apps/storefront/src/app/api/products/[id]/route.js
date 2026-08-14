import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  // Mock – fetch from microservice
  const product = { id: Number(id), name: `Product ${id}`, price: 19.99 };
  return NextResponse.json(product);
}