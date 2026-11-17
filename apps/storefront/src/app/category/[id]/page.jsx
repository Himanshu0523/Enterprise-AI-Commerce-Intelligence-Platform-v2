import { redirect } from 'next/navigation';

const categories = ['men', 'women', 'kids', 'accessories'];

export default async function LegacyCategoryDetailPage({ params }) {
  const { id } = await params;
  const category = String(id || '').toLowerCase();
  if (categories.includes(category)) redirect('/products?category=' + encodeURIComponent(category[0].toUpperCase() + category.slice(1)));
  redirect('/products');
}
