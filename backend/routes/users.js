const express = require("express");
const router = express.Router();
const { getCurrentUser, updateUser } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { validateUserUpdate } = require("../middleware/validators");

/**
 * @route   GET /api/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/me", protect, getCurrentUser);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user's profile
 * @access  Private
 */
router.put("/me", protect, validateUserUpdate, updateUser);

module.exports = router;
