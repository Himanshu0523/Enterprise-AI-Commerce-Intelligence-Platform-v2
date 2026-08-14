'use client';

import React, { useState, useEffect } from 'react';
import QuantitySelector from '@/components/product/ProductDetail/QuantitySelector';
import AddToCartButton from '@/components/product/ProductDetail/AddToCartButton';
import WishlistToggle from '@/components/product/WishlistToggle';
import CompareButton from '@/components/product/CompareButton';
import ReviewList from '@/components/product/ProductReviews/ReviewList';
import ReviewForm from '@/components/product/ProductReviews/ReviewForm';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import '@/types/product';
import { getProductReviews, addProductReview, calculateRatingStats } from '@/lib/utils/review-helpers';

/**
 * Product Detail Client Component
 * @param {Object} props
 * @param {import('@/types/product').Product} props.product
 */
export default function ProductDetailClient({ product: initialProduct }) {
  const [quantity, setQuantity] = useState(1);
  const { add: addRecent } = useRecentlyViewed();

  // Initialize state directly with computed values to avoid synchronous setState in an effect
  const [product, setProduct] = useState(() => {
    const reviews = getProductReviews(initialProduct.id, initialProduct.reviews || []);
    const stats = calculateRatingStats(reviews);
    return {
      ...initialProduct,
      reviews,
      rating: stats.rating,
      reviewCount: stats.count,
    };
  });

  useEffect(() => {
    addRecent(product.id);
  }, [product.id, addRecent]);

  const handleReviewAdded = (newReview) => {
    // Add the review to the list
    const updatedReviews = addProductReview(
      product.id,
      {
        author: newReview.author,
        date: newReview.date,
        rating: newReview.rating,
        comment: newReview.comment,
      },
      initialProduct.reviews || []
    );

    const stats = calculateRatingStats(updatedReviews);
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: updatedReviews,
      rating: stats.rating,
      reviewCount: stats.count,
    }));
  };

  return (
    <>
      {/* Existing product info and interactive parts */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={product.price}
          image={product.images[0] || '/placeholder.jpg'}
          quantity={quantity}
          disabled={product.stock === 0}
        />
        <WishlistToggle productId={product.id} size={28} />
        <CompareButton productId={product.id} className="ml-2" />
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xl font-semibold">{product.rating.toFixed(1)}</span>
          <span className="text-gray-600">({product.reviewCount} reviews)</span>
        </div>

        <div className="mt-6">
          <ReviewList reviews={product.reviews || []} />
        </div>

        <div className="mt-8">
          <ReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />
        </div>
      </div>
    </>
  );
}