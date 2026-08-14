'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, CheckCircle2, X } from 'lucide-react';
import { markHelpful, reportReview } from '@/lib/api/reviews';

/**
 * @param {Object} props
 * @param {import('@/types/product').Review} props.review
 */
export default function ReviewItem({ review }) {
  const { id, author, date, rating, comment, isVerifiedPurchase, verified, helpfulCount, media = [] } = review;
  
  const [helpfuls, setHelpfuls] = useState(helpfulCount || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportedMessage, setReportedMessage] = useState('');

  const [activeImage, setActiveImage] = useState(null);

  const handleHelpful = async () => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    try {
      await markHelpful(id);
      setHelpfuls(prev => prev + 1);
      setHasVoted(true);
    } catch (err) {
      console.error('Failed to mark review as helpful:', err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim() || isReporting) return;
    setIsReporting(true);
    try {
      await reportReview(id, reportReason.trim());
      setReportedMessage('Thank you. This review has been flagged for moderation.');
      setReportReason('');
      setTimeout(() => {
        setShowReportForm(false);
        setReportedMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to report review:', err);
      setReportedMessage('Failed to submit report. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  // Generate a consistent, attractive gradient background based on author name
  const getAvatarGradient = (name) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-teal-500 to-emerald-500',
      'from-orange-500 to-amber-500',
    ];
    return colors[hash % colors.length];
  };

  const initials = author ? author.slice(0, 2).toUpperCase() : 'U';
  const isVerified = isVerifiedPurchase || verified;

  return (
    <div className="border-b border-gray-100 py-6 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${getAvatarGradient(author || 'User')} flex items-center justify-center text-sm font-semibold text-white shadow-sm`}>
          {initials}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{author || 'Anonymous'}</span>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} />
                    Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-0.5 block">
                {new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            {/* Star Rating */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                />
              ))}
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-700 leading-relaxed break-words">{comment}</p>

          {/* Media Gallery */}
          {media.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {media.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 hover:opacity-90 transition-opacity focus:outline-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Review attachment ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Actions Footer */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={handleHelpful}
              disabled={hasVoted || isVoting}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                hasVoted
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-95'
              }`}
            >
              <ThumbsUp size={13} className={hasVoted ? 'fill-indigo-600' : ''} />
              <span>{hasVoted ? `Helpful (${helpfuls})` : helpfuls > 0 ? `Helpful (${helpfuls})` : 'Helpful'}</span>
            </button>

            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Flag size={13} />
              <span>Report</span>
            </button>
          </div>

          {/* Inline Report Form */}
          {showReportForm && (
            <form onSubmit={handleReport} className="mt-3 max-w-md bg-gray-50 rounded-lg p-3 border border-gray-100 transition-all duration-200">
              {reportedMessage ? (
                <p className="text-xs font-medium text-gray-700">{reportedMessage}</p>
              ) : (
                <div className="space-y-2">
                  <label htmlFor={`report-${id}`} className="block text-xs font-semibold text-gray-700">
                    Why are you reporting this review?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id={`report-${id}`}
                      required
                      placeholder="e.g. Spam, offensive content, fake review"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="flex-1 rounded border border-gray-300 px-2.5 py-1.5 text-xs bg-white focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isReporting}
                      className="bg-red-600 text-white font-medium text-xs rounded px-3 py-1.5 hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {isReporting ? 'Submitting...' : 'Flag'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Lightbox / Image Zoom Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-all"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
          >
            <X size={32} />
          </button>
          <div className="relative max-h-[85vh] max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt="Expanded view"
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}