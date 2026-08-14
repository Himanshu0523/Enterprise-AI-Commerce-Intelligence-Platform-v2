import { NextResponse } from 'next/server';

export async function GET() {
  const brands = [
    { id: 'b1', name: 'BasicWear', logo: 'https://picsum.photos/seed/b1/100/50' },
    { id: 'b2', name: 'DenimCo', logo: 'https://picsum.photos/seed/b2/100/50' },
    { id: 'b3', name: 'Sporty', logo: 'https://picsum.photos/seed/b3/100/50' },
    { id: 'b4', name: 'Luxe', logo: 'https://picsum.photos/seed/b4/100/50' },
  ];

  return NextResponse.json(brands);
}
