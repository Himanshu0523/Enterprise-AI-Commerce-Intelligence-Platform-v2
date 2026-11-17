const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/product/:productId', reviewController.getProductReviews);
router.get('/product/:productId/summary', reviewController.getProductReviewSummary);
router.post('/:id/helpful', reviewController.markHelpful);

router.use(authMiddleware);
router.get('/user', reviewController.getUserReviews);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
