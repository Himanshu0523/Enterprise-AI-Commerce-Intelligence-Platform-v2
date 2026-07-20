const crypto = require("crypto"); // for generating OTP
const sendEmail = require("../utils/mail"); // your helper

// 1. Send OTP to email
exports.sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists
      return res.status(200).json({ success: true, message: "If the email is registered, an OTP has been sent." });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    // Set expiry 10 minutes from now
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = otpExpiry;
    await user.save();

    const html = `
      <p>Your password reset code is:</p>
      <h2>${otp}</h2>
      <p>This code expires in 10 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset OTP", html);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("sendResetOTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// 2. Verify the OTP (frontend calls this when user clicks "Verify")
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (
      user.resetPasswordOTP !== otp ||
      user.resetPasswordOTPExpires < Date.now()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP is valid – generate a temporary token for the reset step
    const resetToken = jwt.sign({ id: user._id, purpose: "reset" }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // Clear OTP so it can’t be reused
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.json({ success: true, token: resetToken }); // send token for next step
  } catch (error) {
    console.error("verifyOTP error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// 3. Reset password (requires the temporary token)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    // Verify the temporary token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.purpose !== "reset") throw new Error("Invalid token purpose");
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};