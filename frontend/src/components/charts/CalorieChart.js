import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { getCalorieEntries } from "../../services/calorieService";
import {
  formatDateToReadable,
  getLast7DaysRange,
  getThisMonthRange,
  getLastMonthRange,
  getDatesBetween,
} from "../../utils/dateUtils";

const CalorieChart = ({ dateRange, onDateRangeChange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("week");

  // Set date range based on selected time range
  const handleTimeRangeChange = (event) => {
    const selectedRange = event.target.value;
    setTimeRange(selectedRange);

    let newDateRange;
    switch (selectedRange) {
      case "week":
        newDateRange = getLast7DaysRange();
        break;
      case "month":
        newDateRange = getThisMonthRange();
        break;
      case "lastMonth":
        newDateRange = getLastMonthRange();
        break;
      default:
        newDateRange = getLast7DaysRange();
    }

    if (onDateRangeChange) {
      onDateRangeChange(newDateRange);
    }
  };

  // Fetch and format data when date range changes
  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) return;

      setLoading(true);
      setError("");
      try {
        const response = await getCalorieEntries({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });

        const entries = response.entries || [];

        // Create a map of dates to calorie values
        const caloriesByDate = {};
        entries.forEach((entry) => {
          const dateStr = entry.date.split("T")[0]; // Format YYYY-MM-DD
          caloriesByDate[dateStr] =
            (caloriesByDate[dateStr] || 0) + entry.calories;
        });

        // Get all dates in the range
        const allDates = getDatesBetween(
          dateRange.startDate,
          dateRange.endDate
        );

        // Create chart data with all dates, filling in zeros for missing dates
        const formattedData = allDates.map((date) => ({
          date,
          calories: caloriesByDate[date] || 0,
          displayDate: formatDateToReadable(date),
        }));

        setChartData(formattedData);
      } catch (err) {
        setError("Failed to load chart data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading && chartData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Calorie Trend
        </Typography>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="time-range-select-label">Time Range</InputLabel>
          <Select
            labelId="time-range-select-label"
            id="time-range-select"
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="lastMonth">Last Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : chartData.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", py: 5 }}>
          No data available for the selected period.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} calories`, "Calories"]}
              labelFormatter={(value) => formatDateToReadable(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Calories"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default CalorieChart;
