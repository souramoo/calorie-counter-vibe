const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token from header
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "Authentication token required",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

/**
 * Middleware to verify ownership of a resource
 * Used for endpoints like PUT /api/calories/:id
 */
exports.checkOwnership = (model) => async (req, res, next) => {
  try {
    const item = await model.findById(req.params.id);

    // Check if item exists
    if (!item) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    // Check if user is the owner
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this resource",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error checking ownership",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
