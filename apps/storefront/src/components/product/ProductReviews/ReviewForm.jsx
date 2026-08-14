'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * @param {Object} props
 * @param {string} props.productId
 * @param {(review: any) => void} props.onReviewAdded
 */
export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }
    if (!author.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview = {
        id: `user-${Date.now()}`,
        author: author.trim(),
        date: new Date().toISOString(),
        rating,
        comment: comment.trim(),
      };

      // Reset form
      setRating(0);
      setComment('');
      setAuthor('');
      setIsSubmitting(false);

      // Notify parent
      onReviewAdded(newReview);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      <div>
        <label className="block text-sm font-medium">Rating</label>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium">Your Name</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium">Comment</label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm"
          placeholder="Share your experience with this product..."
        />
      </div>

      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-indigo-600 px-6 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-sm transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}