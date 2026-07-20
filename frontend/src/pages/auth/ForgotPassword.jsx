import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetUserPassword,
} from "../../services/authService"; // adjust path

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);          
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");  // received after OTP verification
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!email) {
      return alert("Please enter your email");
    }
    try {
      await dispatch(sendPasswordResetOTP({ email })).unwrap();
      setStep(2);   // move to OTP entry
    } catch (err) {
      // error is already stored in state.error
      console.error(err);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return alert("Please enter a valid 6-digit OTP");
    }
    try {
      const result = await dispatch(verifyPasswordResetOTP({ email, otp })).unwrap();
      // The backend returns { success: true, token: "..." }
      setResetToken(result.token);
      setStep(3);   // move to password reset
    } catch (err) {
      console.error(err);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      await dispatch(resetUserPassword({ token: resetToken, newPassword })).unwrap();
      setSuccessMessage("Password reset successful! Redirecting to login...");
      // Optionally navigate to login after a short delay
      setTimeout(() => {
        // navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Forgot Password</h2>
      {error && <p style={{ color: "red" }}>{error.message || error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {/* Step 1: Email */}
      {step === 1 && (
        <div>
          <label>Enter your registered email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
          />
          <button onClick={handleSendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {/* Step 2: OTP */}
      {step === 2 && (
        <div>
          <label>Enter the 6-digit code sent to {email}:</label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only digits
            placeholder="123456"
            disabled={loading}
          />
          <button onClick={handleVerifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button onClick={() => setStep(1)} disabled={loading}>
            Back
          </button>
        </div>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;