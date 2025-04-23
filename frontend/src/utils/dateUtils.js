// Format date to YYYY-MM-DD (for input fields)
export const formatDateForInput = (date) => {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format date to readable format (e.g., "January 1, 2023")
export const formatDateToReadable = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get date range for the last 7 days
export const getLast7DaysRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6); // Last 7 days including today

  return {
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate),
  };
};

// Get date range for this month
export const getThisMonthRange = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = today;

  return {
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate),
  };
};

// Get date range for last month
export const getLastMonthRange = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endDate = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate),
  };
};

// Get array of dates between two dates (inclusive)
export const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(formatDateForInput(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
