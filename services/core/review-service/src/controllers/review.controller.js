const Review = require('../models/Review');

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const skip = (page - 1) * limit;

    let sortOptions = { createdAt: -1 };
    if (sort === 'rating-high') sortOptions = { rating: -1 };
    if (sort === 'rating-low') sortOptions = { rating: 1 };
    if (sort === 'helpful') sortOptions = { helpfulVotes: -1 };

    const total = await Review.countDocuments({ productId });
    const reviews = await Review.find({ productId }).sort(sortOptions).skip(skip).limit(Number(limit));

    // Calculate average rating breakdown
    const stats = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : 0;

    res.json({ reviews, avgRating, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name || req.body.userName || 'Anonymous Customer';
    const { productId, rating, title, comment, images } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ msg: 'productId, rating, title, and comment are required' });
    }

    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return res.status(400).json({ msg: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      productId,
      userId,
      userName,
      rating,
      title,
      comment,
      images,
      verifiedPurchase: true,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    if (review.userId !== userId) return res.status(403).json({ msg: 'Access denied' });

    const { rating, title, comment, images } = req.body;
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    if (review.userId !== userId && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Review.findByIdAndDelete(id);
    res.json({ msg: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { $inc: { helpfulVotes: 1 } }, { new: true });
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
