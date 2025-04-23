const { body, query, param, validationResult } = require("express-validator");

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Error",
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for user registration
exports.validateUserRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  exports.handleValidationErrors,
];

// Validation rules for user login
exports.validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password").trim().notEmpty().withMessage("Password is required"),

  exports.handleValidationErrors,
];

// Validation rules for user profile update
exports.validateUserUpdate = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("calorieGoal")
    .optional()
    .isNumeric()
    .withMessage("Calorie goal must be a number")
    .isInt({ min: 0 })
    .withMessage("Calorie goal must be a positive number"),

  exports.handleValidationErrors,
];

// Validation rules for creating calorie entry
exports.validateCalorieEntry = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date in ISO 8601 format"),

  body("calories")
    .notEmpty()
    .withMessage("Calories are required")
    .isNumeric()
    .withMessage("Calories must be a number")
    .isInt({ min: 0 })
    .withMessage("Calories must be a positive number"),

  body("notes").optional().trim(),

  exports.handleValidationErrors,
];

// Validation rules for updating calorie entry
exports.validateCalorieEntryUpdate = [
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date in ISO 8601 format"),

  body("calories")
    .optional()
    .isNumeric()
    .withMessage("Calories must be a number")
    .isInt({ min: 0 })
    .withMessage("Calories must be a positive number"),

  body("notes").optional().trim(),

  exports.handleValidationErrors,
];

// Validation rules for getting calorie entries with query params
exports.validateCalorieEntryQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date in ISO 8601 format"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date in ISO 8601 format"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  exports.handleValidationErrors,
];

// Validation rules for calorie stats query
exports.validateCalorieStatsQuery = [
  query("period")
    .optional()
    .isIn(["day", "week", "month", "year"])
    .withMessage("Period must be one of: day, week, month, year"),

  exports.handleValidationErrors,
];

// Validate MongoDB ObjectID
exports.validateObjectId = (paramName = "id") => [
  param(paramName).isMongoId().withMessage("Invalid ID format"),

  exports.handleValidationErrors,
];
