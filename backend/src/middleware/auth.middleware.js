const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/*
AUTHENTICATION MIDDLEWARE
Protect routes using JWT
*/

exports.authenticate = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Token missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized. User no longer exists"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }

};


/*
ROLE BASED AUTHORIZATION
Example: admin-only routes
*/

exports.authorize = (...roles) => {

  return (req, res, next) => {

    if (!req.user || !roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access forbidden"
      });

    }

    next();

  };

};