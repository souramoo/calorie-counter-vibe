import api from "./api";

// Get all calorie entries with optional filtering
export const getCalorieEntries = async (params = {}) => {
  try {
    const response = await api.get("/calories", { params });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch calorie entries" }
    );
  }
};

// Get calorie entry by ID
export const getCalorieEntryById = async (id) => {
  try {
    const response = await api.get(`/calories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch calorie entry" };
  }
};

// Create a new calorie entry
export const createCalorieEntry = async (entryData) => {
  try {
    const response = await api.post("/calories", entryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create calorie entry" };
  }
};

// Update a calorie entry
export const updateCalorieEntry = async (id, entryData) => {
  try {
    const response = await api.put(`/calories/${id}`, entryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update calorie entry" };
  }
};

// Delete a calorie entry
export const deleteCalorieEntry = async (id) => {
  try {
    await api.delete(`/calories/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete calorie entry" };
  }
};

// Get calorie statistics
export const getCalorieStats = async (period = "week") => {
  try {
    const response = await api.get("/calories/stats", { params: { period } });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch calorie statistics" }
    );
  }
};
