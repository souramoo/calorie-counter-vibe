import React from "react";
import { Typography, Box, LinearProgress, Divider } from "@mui/material";

const CalorieSummary = ({ stats, calorieGoal }) => {
  // Default calorie goal if not set
  const goal = calorieGoal || 2000;

  // Calculate percentage of goal
  const calculatePercentage = (current) => {
    if (!current) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  // Today's calorie count
  const todayCalories =
    stats?.highestDay?.date === new Date().toISOString().split("T")[0]
      ? stats?.highestDay?.calories
      : 0;

  const percentOfGoal = calculatePercentage(todayCalories);

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Daily Summary
      </Typography>

      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Today's Calories
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percentOfGoal}
              color={percentOfGoal > 100 ? "error" : "primary"}
            />
          </Box>
          <Box sx={{ minWidth: 60 }}>
            <Typography variant="body2" color="text.secondary">
              {`${todayCalories} / ${goal}`}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Weekly Stats
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Daily Average:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {stats?.dailyAverage ? Math.round(stats.dailyAverage) : "0"} cal
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Weekly Total:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {stats?.periodTotal ? Math.round(stats.periodTotal) : "0"} cal
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Highest Day:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {stats?.highestDay ? Math.round(stats.highestDay.calories) : "0"} cal
        </Typography>
      </Box>
    </>
  );
};

export default CalorieSummary;
