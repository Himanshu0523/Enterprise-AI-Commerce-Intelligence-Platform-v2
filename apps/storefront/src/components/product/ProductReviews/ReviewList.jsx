'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, SlidersHorizontal, Image, Check, RefreshCw, Plus, MessageSquare } from 'lucide-react';
import { getProductReviews, getProductReviewSummary } from '@/lib/api/reviews';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';

/**
 * @param {Object} props
 * @param {string} props.productId
 */
export default function ReviewList({ productId }) {
  // State for reviews and pagination
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  
  // State for active filters & sorting
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasImagesOnly, setHasImagesOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(null); // Click to filter by star rating (1-5)
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Fetch summary stats
  const fetchSummary = useCallback(async () => {
    try {
      const data = await getProductReviewSummary(productId);
      setSummary(data);
    } catch (err) {
      console.error('Error fetching review summary:', err);
    }
  }, [productId]);

  // Fetch reviews list
  const fetchReviewsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 5,
        sort,
        verified: verifiedOnly ? 'true' : 'false',
        hasImages: hasImagesOnly ? 'true' : 'false',
      };
      if (ratingFilter !== null) {
        params.rating = ratingFilter.toString();
      }

      const response = await getProductReviews(productId, params);
      setReviews(response.reviews || []);
      setPagination(response.pagination || { page: 1, limit: 5, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productId, page, sort, verifiedOnly, hasImagesOnly, ratingFilter]);

  // Load stats and list on mount & when filter dependencies change
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchReviewsList();
  }, [fetchReviewsList]);

  // Callback when new review is added
  const handleReviewAdded = () => {
    setShowForm(false);
    setPage(1); // Go to page 1 to see the new review
    setRatingFilter(null); // Clear rating filter
    fetchSummary();
    fetchReviewsList();
  };

  const handleRatingFilterClick = (ratingVal) => {
    setRatingFilter(prev => (prev === ratingVal ? null : ratingVal));
    setPage(1); // Reset page on filter change
  };

  const clearAllFilters = () => {
    setVerifiedOnly(false);
    setHasImagesOnly(false);
    setRatingFilter(null);
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = verifiedOnly || hasImagesOnly || ratingFilter !== null || sort !== 'newest';

  return (
    <div className="space-y-8">
      {/* 1. Rating Summary Widget */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {/* Left column: Score overview */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Average Rating</h4>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{summary.averageRating.toFixed(1)}</span>
            <span className="text-lg text-gray-400 font-medium">/ 5</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(summary.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Based on {summary.totalReviews} {summary.totalReviews === 1 ? 'rating' : 'ratings'}
          </p>
        </div>

        {/* Right column: Star distribution bar chart */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-gray-700">Rating Distribution</span>
            {ratingFilter && (
              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                Filtering by {ratingFilter} Star{ratingFilter > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] || 0;
            const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
            const isSelected = ratingFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingFilterClick(star)}
                className={`group flex items-center w-full gap-3 text-left p-1 rounded-lg hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-indigo-50/70 hover:bg-indigo-50' : ''
                }`}
              >
                <span className="w-12 text-xs font-semibold text-gray-600 flex items-center justify-end gap-1">
                  {star} <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                </span>
                
                {/* Progress bar wrapper */}
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected
                        ? 'bg-indigo-600'
                        : 'bg-amber-400 group-hover:bg-amber-500'
                    }`}
                  />
                </div>

                <span className="w-14 text-xs font-semibold text-gray-500 text-right group-hover:text-gray-900 transition-colors">
                  {percentage.toFixed(0)}% ({count})
                </span>
              </button>
            );
          })}
          <p className="text-xs text-gray-400 text-center pt-1">
            Tip: Click a rating bar to filter reviews.
          </p>
        </div>
      </div>

      {/* 2. Sorting and Filtering Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Filter options */}
          <button
            onClick={() => {
              setVerifiedOnly(prev => !prev);
              setPage(1);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              verifiedOnly
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Check size={12} className={verifiedOnly ? 'opacity-100' : 'opacity-0'} />
            Verified Purchase
          </button>

          <button
            onClick={() => {
              setHasImagesOnly(prev => !prev);
              setPage(1);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              hasImagesOnly
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Image size={12} />
            With Photos
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Write a Review trigger */}
        <button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
            showForm
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow'
          }`}
        >
          {showForm ? (
            <>Cancel Review</>
          ) : (
            <>
              <Plus size={16} />
              Write a Review
            </>
          )}
        </button>
      </div>

      {/* 3. Review Form Accordion */}
      {showForm && (
        <div className="bg-gray-50/50 rounded-2xl p-6 border border-dashed border-gray-200 transition-all duration-300">
          <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
        </div>
      )}

      {/* 4. Reviews List / Cards */}
      <div className="space-y-4 relative">
        {isLoading ? (
          // Skeleton Loader
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="border-b border-gray-100 py-6 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center bg-gray-50/40 rounded-2xl border border-dashed border-gray-100 flex flex-col items-center justify-center">
            <MessageSquare size={36} className="text-gray-300 mb-2" />
            <h5 className="font-semibold text-gray-700">No reviews match your criteria</h5>
            <p className="text-sm text-gray-400 mt-1">Be the first to share your thoughts, or clear active filters!</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Pagination Controls */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <p className="text-xs font-medium text-gray-500">
            Showing <span className="font-bold text-gray-800">{(page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-bold text-gray-800">
              {Math.min(page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-bold text-gray-800">{pagination.total}</span> reviews
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                  page === pNum
                    ? 'bg-indigo-600 text-white shadow'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                {pNum}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}