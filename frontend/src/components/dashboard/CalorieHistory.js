import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  Edit,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  formatDateToReadable,
  formatDateForInput,
} from "../../utils/dateUtils";
import {
  updateCalorieEntry,
  deleteCalorieEntry,
} from "../../services/calorieService";

const CalorieHistory = ({
  entries,
  onEntryChange,
  dateRange,
  onDateRangeChange,
}) => {
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    calories: "",
    notes: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle date range filter change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    onDateRangeChange({
      ...dateRange,
      [name]: value,
    });
  };

  // Handle edit dialog opening
  const handleEditClick = (entry) => {
    setCurrentEntry(entry);
    setEditFormData({
      date: formatDateForInput(entry.date),
      calories: entry.calories,
      notes: entry.notes || "",
    });
    setEditDialogOpen(true);
  };

  // Handle delete dialog opening
  const handleDeleteClick = (entry) => {
    setCurrentEntry(entry);
    setDeleteDialogOpen(true);
  };

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Save edited entry
  const handleSaveEdit = async () => {
    try {
      const updatedEntry = {
        ...editFormData,
        calories: Number(editFormData.calories),
      };

      await updateCalorieEntry(currentEntry.id, updatedEntry);
      setEditDialogOpen(false);

      // Notify parent to refresh data
      if (onEntryChange) {
        onEntryChange();
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  // Delete entry
  const handleConfirmDelete = async () => {
    try {
      await deleteCalorieEntry(currentEntry.id);
      setDeleteDialogOpen(false);

      // Notify parent to refresh data
      if (onEntryChange) {
        onEntryChange();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleFilters = () => {
    setExpandedFilters(!expandedFilters);
  };

  // Calculate empty rows to maintain consistent page height
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - entries.length) : 0;

  // Get entries for current page
  const displayedEntries = entries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography component="h2" variant="h6" color="primary">
          Calorie History
        </Typography>
        <Button
          onClick={toggleFilters}
          endIcon={
            expandedFilters ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
        >
          {expandedFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </Box>

      {expandedFilters && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const today = new Date();
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(today.getDate() - 6);
                    onDateRangeChange({
                      startDate: formatDateForInput(sevenDaysAgo),
                      endDate: formatDateForInput(today),
                    });
                  }}
                  fullWidth
                >
                  Last 7 Days
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}

      {entries.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No calorie entries found for the selected date range.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table aria-label="calorie entries table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell component="th" scope="row">
                      {formatDateToReadable(entry.date)}
                    </TableCell>
                    <TableCell align="right">{entry.calories}</TableCell>
                    <TableCell>{entry.notes || "-"}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEditClick(entry)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(entry)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={entries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Calorie Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={editFormData.date}
            onChange={handleEditFormChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Calories"
            type="number"
            name="calories"
            value={editFormData.calories}
            onChange={handleEditFormChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Notes"
            name="notes"
            value={editFormData.notes}
            onChange={handleEditFormChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this calorie entry? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CalorieHistory;
