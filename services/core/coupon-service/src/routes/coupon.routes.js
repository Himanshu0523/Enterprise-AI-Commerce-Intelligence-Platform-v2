const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');

router.post('/validate', couponController.validateCoupon);
router.post('/redeem', couponController.redeemCoupon);
router.post('/calculate-stacked', couponController.calculateStackedDiscount);
router.get('/', couponController.getCoupons);
router.post('/', couponController.createCoupon);
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
