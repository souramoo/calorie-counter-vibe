const mongoose = require("mongoose");

const calorieEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    calories: {
      type: Number,
      required: [true, "Calorie amount is required"],
      min: [0, "Calories cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create compound index for efficient querying
calorieEntrySchema.index({ userId: 1, date: -1 });
// Create index for date range queries
calorieEntrySchema.index({ date: 1 });

module.exports = mongoose.model("CalorieEntry", calorieEntrySchema);
