import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    {
      id: 'men',
      name: 'Men',
      slug: 'men',
      description: 'Men apparel, footwear & accessories',
      image: 'https://picsum.photos/seed/men/600/400',
      subcategories: [
        { id: 'shirts', name: 'Shirts', slug: 'shirts' },
        { id: 'pants', name: 'Pants & Jeans', slug: 'pants' },
        { id: 'jackets', name: 'Jackets', slug: 'jackets' },
      ],
    },
    {
      id: 'women',
      name: 'Women',
      slug: 'women',
      description: 'Women fashion, dresses & beauty',
      image: 'https://picsum.photos/seed/women/600/400',
      subcategories: [
        { id: 'dresses', name: 'Dresses', slug: 'dresses' },
        { id: 'tops', name: 'Tops & Tees', slug: 'tops' },
        { id: 'skirts', name: 'Skirts', slug: 'skirts' },
      ],
    },
    {
      id: 'kids',
      name: 'Kids',
      slug: 'kids',
      description: 'Trending kids clothing & toys',
      image: 'https://picsum.photos/seed/kids/600/400',
      subcategories: [
        { id: 'boys', name: 'Boys Collection', slug: 'boys' },
        { id: 'girls', name: 'Girls Collection', slug: 'girls' },
      ],
    },
    {
      id: 'accessories',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Bags, watches & sunglasses',
      image: 'https://picsum.photos/seed/acc/600/400',
      subcategories: [
        { id: 'watches', name: 'Watches', slug: 'watches' },
        { id: 'bags', name: 'Bags', slug: 'bags' },
        { id: 'jewelry', name: 'Jewelry', slug: 'jewelry' },
      ],
    },
  ];

  return NextResponse.json(categories);
}
