const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-4">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <div className="flex items-center justify-between pt-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>
  </div>
);

export const ProductListSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <Skeleton className="h-44 w-full sm:w-44 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  </div>
);

export const ProductSkeletonGrid = ({ count = 8, view = 'grid' }) => {
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <ProductListSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const CategorySkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
    ))}
  </div>
);

export const FilterSkeleton = () => (
  <div className="space-y-6 rounded-xl border border-gray-100 bg-white p-5">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-3 pt-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export default Skeleton;