import { redirect } from 'next/navigation';

export default async function LegacyProductPage({ params }) {
  const { id } = await params;
  redirect('/products/' + encodeURIComponent(id));
}
