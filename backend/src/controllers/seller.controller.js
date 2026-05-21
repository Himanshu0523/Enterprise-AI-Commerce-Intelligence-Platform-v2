const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.registerSeller = catchAsync(async (req, res, next) => {
    const { businessName, bankAccountNumber, ifscCode } = req.body;

    if (!businessName || !bankAccountNumber || !ifscCode) {
        return next(new AppError('Please provide all required business details', 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.role === 'seller') {
        return next(new AppError('User is already a seller', 400));
    }

    const mockRazorpayAccountId = "acc_" + Math.random().toString(36).substr(2, 9);

    user.role = 'seller';
    user.sellerDetails = {
        businessName,
        bankAccountNumber,
        ifscCode,
        razorpayAccountId: mockRazorpayAccountId
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Successfully registered as a seller',
        data: user
    });
});
