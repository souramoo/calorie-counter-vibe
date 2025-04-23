import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  getCurrentUserProfile,
  updateUserProfile,
} from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    calorieGoal: "",
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getCurrentUserProfile();
        setProfile(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          password: "",
          confirmPassword: "",
          calorieGoal: data.calorieGoal || 2000,
        });
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    setSuccess("");

    // Validate passwords match if a new password was entered
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate calorie goal
    if (
      formData.calorieGoal &&
      (isNaN(formData.calorieGoal) || Number(formData.calorieGoal) <= 0)
    ) {
      setError("Calorie goal must be a positive number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for the API (only send fields that changed)
      const updateData = {};

      if (formData.username !== profile.username) {
        updateData.username = formData.username;
      }

      if (formData.email !== profile.email) {
        updateData.email = formData.email;
      }

      if (formData.password) {
        updateData.password = formData.password;
      }

      if (formData.calorieGoal !== profile.calorieGoal) {
        updateData.calorieGoal = Number(formData.calorieGoal);
      }

      // Only send the request if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedProfile = await updateUserProfile(updateData);
        setProfile(updatedProfile);

        // Update context state
        updateUserData({
          username: updatedProfile.username,
          email: updatedProfile.email,
        });

        setSuccess("Profile updated successfully");

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        setSuccess("No changes made");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Change Password (optional)
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                helperText="Leave blank to keep current password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                disabled={!formData.password}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Preferences
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Daily Calorie Goal"
                name="calorieGoal"
                type="number"
                value={formData.calorieGoal}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1 }}
                helperText="Your target calorie intake per day"
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="body1">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1">
              {profile?.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
