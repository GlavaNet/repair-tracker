// Utility functions for date handling and formatting

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toISOString().split('T')[0];
};

// Format date to localized string (e.g., "May 20, 2025")
export const formatDateLocalized = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString();
};

// Calculate days between two dates
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Check for valid dates
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
  
  // Calculate difference in days
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Check if a date is in the past
export const isDatePast = (date) => {
  const d = new Date(date);
  const today = new Date();
  
  // Set hours to 0 for date-only comparison
  today.setHours(0, 0, 0, 0);
  
  return d < today;
};

// Check if a date is in the future
export const isDateFuture = (date) => {
  const d = new Date(date);
  const today = new Date();
  
  // Set hours to 0 for date-only comparison
  today.setHours(0, 0, 0, 0);
  
  return d > today;
};

// Get date X days from now
export const getDateDaysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export default {
  formatDate,
  formatDateLocalized,
  daysBetween,
  isDatePast,
  isDateFuture,
  getDateDaysFromNow
};