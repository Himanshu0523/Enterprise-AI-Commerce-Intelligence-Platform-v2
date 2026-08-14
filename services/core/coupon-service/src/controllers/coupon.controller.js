const Coupon = require('../models/Coupon');

/**
 * Tiered discount rules applied automatically based on cart quantity.
 * These stack ON TOP of any coupon code discount.
 */
const TIER_RULES = [
  { minQty: 5, discountPct: 15, label: 'Buy 5+ get 15% off' },
  { minQty: 3, discountPct: 10, label: 'Buy 3+ get 10% off' },
  { minQty: 2, discountPct: 5, label: 'Buy 2+ get 5% off' },
];

function calculateTierDiscount(totalItems, orderAmount) {
  // Find the best matching tier (sorted highest-first)
  for (const tier of TIER_RULES) {
    if (totalItems >= tier.minQty) {
      const amount = (orderAmount * tier.discountPct) / 100;
      return { applied: true, tierLabel: tier.label, tierDiscountPct: tier.discountPct, tierDiscountAmount: Math.round(amount * 100) / 100 };
    }
  }
  return { applied: false, tierLabel: null, tierDiscountPct: 0, tierDiscountAmount: 0 };
}


exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount = 0 } = req.body;
    if (!code) return res.status(400).json({ msg: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ valid: false, msg: 'Invalid or inactive coupon code' });

    const now = new Date();
    if (now < coupon.startDate || now > coupon.expiryDate) {
      return res.status(400).json({ valid: false, msg: 'Coupon code has expired' });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, msg: 'Coupon usage limit reached' });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        valid: false,
        msg: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount: Math.max(0, orderAmount - discountAmount),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Dynamic Tiered Couponing — Stacking Discounts
 *
 * Calculates the combined discount from:
 *   1. Automatic tier discount based on cart quantity (Buy 2 get 5%, Buy 3 get 10%, etc.)
 *   2. Optional coupon code discount (PERCENTAGE or FIXED)
 *
 * Both discounts are computed independently and stacked additively.
 * A hard cap prevents the total discount from exceeding 40% of order value
 * to block exploit loops (e.g., stacking a 20% coupon on a 15% tier = 35%, allowed;
 * stacking a 30% coupon on a 15% tier = 45%, capped at 40%).
 */
exports.calculateStackedDiscount = async (req, res) => {
  try {
    const { code, orderAmount, totalItems } = req.body;
    const MAX_STACK_PCT = 40; // Hard cap: max 40% total discount

    if (typeof orderAmount !== 'number' || orderAmount <= 0) {
      return res.status(400).json({ success: false, msg: 'Valid orderAmount required' });
    }
    if (typeof totalItems !== 'number' || totalItems < 1) {
      return res.status(400).json({ success: false, msg: 'totalItems must be at least 1' });
    }

    // ── Layer 1: Automatic Tier Discount ────────────────────────────────
    const tier = calculateTierDiscount(totalItems, orderAmount);

    // ── Layer 2: Coupon Code Discount (optional) ────────────────────────
    let couponDiscount = { applied: false, code: null, discountAmount: 0, discountType: null };
    if (code) {
      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
      if (coupon) {
        const now = new Date();
        const isValid = now >= coupon.startDate && now <= coupon.expiryDate;
        const hasUsage = coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit;

        if (isValid && hasUsage && orderAmount >= coupon.minOrderAmount) {
          let amt = 0;
          if (coupon.discountType === 'PERCENTAGE') {
            amt = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && amt > coupon.maxDiscountAmount) amt = coupon.maxDiscountAmount;
          } else {
            amt = Math.min(coupon.discountValue, orderAmount);
          }
          couponDiscount = { applied: true, code: coupon.code, discountAmount: Math.round(amt * 100) / 100, discountType: coupon.discountType };
        }
      }
    }

    // ── Stack & Cap ─────────────────────────────────────────────────────
    const rawTotal = tier.tierDiscountAmount + couponDiscount.discountAmount;
    const maxAllowed = (orderAmount * MAX_STACK_PCT) / 100;
    const cappedDiscount = Math.min(rawTotal, maxAllowed);
    const wasCapped = rawTotal > maxAllowed;
    const finalAmount = Math.max(0, orderAmount - cappedDiscount);

    res.json({
      success: true,
      orderAmount,
      totalItems,
      tierDiscount: tier,
      couponDiscount,
      stackedTotalDiscount: Math.round(cappedDiscount * 100) / 100,
      wasCapped,
      maxStackPct: MAX_STACK_PCT,
      finalAmount: Math.round(finalAmount * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


/**
 * Atomic Coupon Redemption (Prevents Race Conditions)
 */
exports.redeemCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ msg: 'Coupon code is required' });

    // Atomic findOneAndUpdate with usage count condition
    const coupon = await Coupon.findOneAndUpdate(
      {
        code: code.toUpperCase(),
        isActive: true,
        $expr: { $lt: ['$usedCount', '$usageLimit'] },
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) {
      return res.status(400).json({
        success: false,
        msg: 'Coupon cannot be redeemed (usage limit reached or inactive)',
      });
    }

    res.json({ success: true, code: coupon.code, usedCount: coupon.usedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, startDate, expiryDate } =
      req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      startDate,
      expiryDate,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!coupon) return res.status(404).json({ msg: 'Coupon not found' });
    res.json({ msg: 'Coupon deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
