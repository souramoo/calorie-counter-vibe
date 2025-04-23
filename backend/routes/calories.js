const express = require("express");
const router = express.Router();
const {
  createCalorieEntry,
  getCalorieEntries,
  getCalorieEntryById,
  updateCalorieEntry,
  deleteCalorieEntry,
  getCalorieStats,
} = require("../controllers/calorieController");
const { protect, checkOwnership } = require("../middleware/auth");
const {
  validateCalorieEntry,
  validateCalorieEntryUpdate,
  validateCalorieEntryQuery,
  validateCalorieStatsQuery,
  validateObjectId,
} = require("../middleware/validators");
const CalorieEntry = require("../models/CalorieEntry");

/**
 * @route   POST /api/calories
 * @desc    Create a new calorie entry
 * @access  Private
 */
router.post("/", protect, validateCalorieEntry, createCalorieEntry);

/**
 * @route   GET /api/calories
 * @desc    Get all calorie entries for current user with optional filtering
 * @access  Private
 */
router.get("/", protect, validateCalorieEntryQuery, getCalorieEntries);

/**
 * @route   GET /api/calories/stats
 * @desc    Get calorie statistics
 * @access  Private
 */
router.get("/stats", protect, validateCalorieStatsQuery, getCalorieStats);

/**
 * @route   GET /api/calories/:id
 * @desc    Get a single calorie entry
 * @access  Private
 */
router.get("/:id", protect, validateObjectId(), getCalorieEntryById);

/**
 * @route   PUT /api/calories/:id
 * @desc    Update a calorie entry
 * @access  Private
 */
router.put(
  "/:id",
  protect,
  validateObjectId(),
  checkOwnership(CalorieEntry),
  validateCalorieEntryUpdate,
  updateCalorieEntry
);

/**
 * @route   DELETE /api/calories/:id
 * @desc    Delete a calorie entry
 * @access  Private
 */
router.delete(
  "/:id",
  protect,
  validateObjectId(),
  checkOwnership(CalorieEntry),
  deleteCalorieEntry
);

module.exports = router;
