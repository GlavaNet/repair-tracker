// Service for managing localStorage interactions

// Storage keys
const STORAGE_KEYS = {
  AUTH: 'repair_tracker_auth',
  USER: 'repair_tracker_user',
  REQUESTS: 'repair_tracker_requests',
  EQUIPMENT: 'repair_tracker_equipment',
  SETTINGS: 'repair_tracker_settings'
};

// Save data to localStorage
const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to ${key}:`, error);
    return false;
  }
};

// Load data from localStorage
const loadData = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading data from ${key}:`, error);
    return defaultValue;
  }
};

// Remove data from localStorage
const removeData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from ${key}:`, error);
    return false;
  }
};

// Clear all application data
const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

// Get available storage space
const getStorageInfo = () => {
  try {
    const totalSize = 5 * 1024 * 1024; // Approximate localStorage limit (5MB)
    let usedSize = 0;
    
    // Calculate used storage size
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      usedSize += (key.length + value.length) * 2; // Unicode characters take 2 bytes
    }
    
    return {
      total: totalSize,
      used: usedSize,
      available: totalSize - usedSize,
      percentUsed: Math.round((usedSize / totalSize) * 100)
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

export default {
  STORAGE_KEYS,
  saveData,
  loadData,
  removeData,
  clearAllData,
  getStorageInfo
};