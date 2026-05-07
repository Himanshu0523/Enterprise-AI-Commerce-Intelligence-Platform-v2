const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}


  //  TOKEN GENERATOR

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role || "user"
    },
    JWT_SECRET,
    { expiresIn: "4d" }
  );
};

exports.generateToken = generateToken;

  //  REGISTER
  //  POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user);

    const { password: _, ...safeUser } = user.toObject();

    res.status(201).json({
      success: true,
      token,
      user: safeUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

  //  LOGIN
  //  POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user);

    const { password: _, ...safeUser } = user.toObject();

    res.json({
      success: true,
      token,
      user: safeUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

  //  LOGOUT
  //  POST /api/auth/logout
exports.logoutUser = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};

  //  OAUTH SUCCESS HANDLER
  //  (Google, GitHub, LinkedIn)
exports.oauthSuccess = (req, res) => {
  try {
    const token = generateToken(req.user);

    const userData = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`http://localhost:5173/auth-success?token=${token}&user=${userData}`);

  } catch (error) {
    console.error("OAuth Error:", error);
    res.redirect(`http://localhost:5173/login?error=oauth_failed`);
  }
};

  //  SEND VERIFICATION EMAIL
exports.sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const url = `http://localhost:5000/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<a href="${url}">Verify Email</a>`
  });
};

  //  FORGOT PASSWORD
  //  POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const url = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `<a href="${url}">Reset Password</a>`
    });

    res.json({
      success: true,
      message: "Password reset email sent"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};