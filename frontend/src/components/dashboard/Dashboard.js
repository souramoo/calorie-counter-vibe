import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import CalorieSummary from "./CalorieSummary";
import CalorieEntryForm from "./CalorieEntryForm";
import CalorieHistory from "./CalorieHistory";
import {
  getCalorieEntries,
  getCalorieStats,
} from "../../services/calorieService";
import { getCurrentUserProfile } from "../../services/userService";
import { getLast7DaysRange } from "../../utils/dateUtils";

const Dashboard = () => {
  const { user } = useAuth();
  const [calorieEntries, setCalorieEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get the default date range (last 7 days)
  const defaultDateRange = getLast7DaysRange();
  const [dateRange, setDateRange] = useState(defaultDateRange);

  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch user profile
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);

        // Fetch calorie entries
        const entriesResponse = await getCalorieEntries({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        setCalorieEntries(entriesResponse.entries || []);

        // Fetch calorie statistics
        const statsData = await getCalorieStats("week");
        setStats(statsData);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, refreshTrigger]);

  if (loading && !calorieEntries.length) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.username || "User"}
      </Typography>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: "error.light" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Calorie Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <CalorieSummary stats={stats} calorieGoal={profile?.calorieGoal} />
          </Paper>
        </Grid>

        {/* Calorie Entry Form */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <CalorieEntryForm onEntryAdded={refreshData} />
          </Paper>
        </Grid>

        {/* Calorie History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <CalorieHistory
              entries={calorieEntries}
              onEntryChange={refreshData}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
