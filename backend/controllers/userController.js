const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      calorieGoal: user.calorieGoal,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, calorieGoal } = req.body;

    // Find user
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }
    }

    // Check if username is being changed and already exists
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({
          message: "Username already in use",
        });
      }
    }

    // Update fields
    const fieldsToUpdate = {};

    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;
    if (calorieGoal) fieldsToUpdate.calorieGoal = calorieGoal;

    // Update the user
    user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    // If password is being updated, handle it separately
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      calorieGoal: user.calorieGoal,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
