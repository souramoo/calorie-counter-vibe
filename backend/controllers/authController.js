const User = require("../models/User");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // Check if username is taken
    user = await User.findOne({ username });

    if (user) {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    // Create new user
    user = await User.create({
      username,
      email,
      password,
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        calorieGoal: user.calorieGoal,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering new user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Return user data and token
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        calorieGoal: user.calorieGoal,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
