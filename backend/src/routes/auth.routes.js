const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/auth.controller");

// REGISTER
// POST /api/auth/register
router.post("/register", authController.registerUser);


// LOGIN
// POST /api/auth/login
router.post("/login", authController.loginUser);

// LOGOUT
// POST /api/auth/logout
router.post("/logout", authController.logoutUser);

// FORGOT PASSWORD
// POST /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);


// GOOGLE LOGIN
// GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
  }),
  authController.oauthSuccess
);


// GITHUB LOGIN
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);


// GITHUB CALLBACK
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login"
  }),
  authController.oauthSuccess
);

// LINKEDIN LOGIN
router.get(
  "/linkedin",
  passport.authenticate("linkedin")
);

// LINKEDIN CALLBACK
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: "/login"
  }),
  authController.oauthSuccess
);

module.exports = router;