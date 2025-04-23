const CalorieEntry = require("../models/CalorieEntry");
const mongoose = require("mongoose");

/**
 * @desc    Create a new calorie entry
 * @route   POST /api/calories
 * @access  Private
 */
exports.createCalorieEntry = async (req, res) => {
  try {
    const { date, calories, notes } = req.body;

    // Create entry
    const entry = await CalorieEntry.create({
      userId: req.user.id,
      date,
      calories,
      notes,
    });

    res.status(201).json({
      id: entry._id,
      date: entry.date,
      calories: entry.calories,
      notes: entry.notes,
      createdAt: entry.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating calorie entry",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get all calorie entries for current user with optional filtering
 * @route   GET /api/calories
 * @access  Private
 */
exports.getCalorieEntries = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30, page = 1 } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Add date range filtering if provided
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const endDateObj = new Date(endDate);
        // Set time to end of day
        endDateObj.setHours(23, 59, 59, 999);
        query.date.$lte = endDateObj;
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const entries = await CalorieEntry.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await CalorieEntry.countDocuments(query);

    // Calculate total pages
    const pages = Math.ceil(total / parseInt(limit));

    // Format response
    const formattedEntries = entries.map((entry) => ({
      id: entry._id,
      date: entry.date,
      calories: entry.calories,
      notes: entry.notes,
      createdAt: entry.createdAt,
    }));

    res.status(200).json({
      entries: formattedEntries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving calorie entries",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get a single calorie entry
 * @route   GET /api/calories/:id
 * @access  Private
 */
exports.getCalorieEntryById = async (req, res) => {
  try {
    const entry = await CalorieEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        message: "Calorie entry not found",
      });
    }

    // Check if the entry belongs to the authenticated user
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this entry",
      });
    }

    res.status(200).json({
      id: entry._id,
      date: entry.date,
      calories: entry.calories,
      notes: entry.notes,
      createdAt: entry.createdAt,
    });
  } catch (error) {
    // Check if error is due to invalid ID format
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      message: "Error retrieving calorie entry",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update a calorie entry
 * @route   PUT /api/calories/:id
 * @access  Private
 */
exports.updateCalorieEntry = async (req, res) => {
  try {
    const { date, calories, notes } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (date !== undefined) updateData.date = date;
    if (calories !== undefined) updateData.calories = calories;
    if (notes !== undefined) updateData.notes = notes;

    // Update entry
    const entry = await CalorieEntry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        message: "Calorie entry not found",
      });
    }

    res.status(200).json({
      id: entry._id,
      date: entry.date,
      calories: entry.calories,
      notes: entry.notes,
      updatedAt: entry.updatedAt,
    });
  } catch (error) {
    // Check if error is due to invalid ID format
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      message: "Error updating calorie entry",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete a calorie entry
 * @route   DELETE /api/calories/:id
 * @access  Private
 */
exports.deleteCalorieEntry = async (req, res) => {
  try {
    const entry = await CalorieEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        message: "Calorie entry not found",
      });
    }

    // Check if the entry belongs to the authenticated user
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this entry",
      });
    }

    await entry.deleteOne();

    res.status(204).send();
  } catch (error) {
    // Check if error is due to invalid ID format
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      message: "Error deleting calorie entry",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get calorie statistics
 * @route   GET /api/calories/stats
 * @access  Private
 */
exports.getCalorieStats = async (req, res) => {
  try {
    const { period = "week" } = req.query;

    // Get current date
    const now = new Date();

    // Calculate start date based on period
    let startDate;
    switch (period) {
      case "day":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;

      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;

      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;

      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;

      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    // Get all entries
    const allEntries = await CalorieEntry.find({
      userId: req.user.id,
    }).sort({ date: 1 });

    // Get period entries
    const periodEntries = await CalorieEntry.find({
      userId: req.user.id,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    if (periodEntries.length === 0) {
      return res.status(200).json({
        dailyAverage: 0,
        totalEntries: 0,
        periodTotal: 0,
        periodAverage: 0,
        highestDay: null,
        lowestDay: null,
      });
    }

    // Calculate daily average for all time
    const totalEntries = allEntries.length;
    const totalCalories = allEntries.reduce(
      (sum, entry) => sum + entry.calories,
      0
    );
    const dailyAverage = totalEntries > 0 ? totalCalories / totalEntries : 0;

    // Calculate period stats
    const periodTotal = periodEntries.reduce(
      (sum, entry) => sum + entry.calories,
      0
    );
    const periodAverage =
      periodEntries.length > 0 ? periodTotal / periodEntries.length : 0;

    // Find highest and lowest days
    let highestDay = periodEntries[0];
    let lowestDay = periodEntries[0];

    for (const entry of periodEntries) {
      if (entry.calories > highestDay.calories) {
        highestDay = entry;
      }

      if (entry.calories < lowestDay.calories) {
        lowestDay = entry;
      }
    }

    res.status(200).json({
      dailyAverage,
      totalEntries,
      periodTotal,
      periodAverage,
      highestDay: {
        date: highestDay.date,
        calories: highestDay.calories,
      },
      lowestDay: {
        date: lowestDay.date,
        calories: lowestDay.calories,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving calorie statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
