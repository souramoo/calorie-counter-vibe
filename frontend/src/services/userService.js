import api from "./api";

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user profile" };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put("/users/me", userData);
    // Update stored user data if it was changed
    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update profile" };
  }
};

// Update calorie goal
export const updateCalorieGoal = async (calorieGoal) => {
  try {
    const response = await api.put("/users/me", { calorieGoal });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update calorie goal" };
  }
};
