import { ProductSkeletonGrid, FilterSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4 mb-6"></div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <FilterSkeleton />
        </aside>
        <div className="flex-1">
          <ProductSkeletonGrid count={6} />
        </div>
      </div>
    </div>
  );
}
