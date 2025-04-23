import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { formatDateForInput } from "../../utils/dateUtils";
import { createCalorieEntry } from "../../services/calorieService";

const CalorieEntryForm = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    date: formatDateForInput(new Date()),
    calories: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate the input
    if (!formData.date || !formData.calories) {
      setError("Date and calories are required");
      return;
    }

    if (isNaN(formData.calories) || Number(formData.calories) <= 0) {
      setError("Calories must be a positive number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert calories to number for API
      const entryData = {
        ...formData,
        calories: Number(formData.calories),
      };

      await createCalorieEntry(entryData);
      setShowSuccess(true);

      // Reset form (except date)
      setFormData((prev) => ({
        ...prev,
        calories: "",
        notes: "",
      }));

      // Notify parent component to refresh data
      if (onEntryAdded) {
        onEntryAdded();
      }
    } catch (err) {
      setError(err.message || "Failed to add calorie entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSuccess(false);
  };

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Add Calorie Entry
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Calories"
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              placeholder="Optional notes"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Calorie entry added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CalorieEntryForm;
