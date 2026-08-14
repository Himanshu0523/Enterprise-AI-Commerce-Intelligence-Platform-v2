import { useRecommendations } from "../../hooks/useRecommendations";
import ProductCard from "../shop/ProductCard";

export default function RecommendationPanel({ userId }) {
  const { data, loading } = useRecommendations(userId);

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!data || data.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Recommended for You</h2>
          <p className="mt-2 text-gray-500">Based on your recent activity</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.slice(0, 4).map((item, index) => (
          <ProductCard key={item._id ?? item.id ?? index} product={item} />
        ))}
      </div>
    </div>
  );
}