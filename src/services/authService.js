// src/services/authService.js
import { auth } from './firebaseService';
import { 
  signInWithMicrosoft, 
  signUserOut, 
  getCurrentUser as getFirebaseUser,
  onAuthStateChange
} from './firebaseService';

/**
 * Handle login - now uses Firebase Authentication with Microsoft provider
 * @returns {Promise} Authentication result
 */
export const login = async () => {
  try {
    const result = await signInWithMicrosoft();
    return result;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
};

/**
 * Handle logout
 */
export const logout = async () => {
  try {
    await signUserOut();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Get current user
 * @returns {Object|null} User object or null if not signed in
 */
export const getCurrentUser = () => {
  const firebaseUser = getFirebaseUser();
  
  if (!firebaseUser) {
    return null;
  }
  
  return {
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    role: 'user' // Default role - can be enhanced with custom claims
  };
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChange((user) => {
    if (user) {
      callback({
        name: user.displayName,
        email: user.email,
        role: 'user' // Default role
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Get authentication token for API calls
 * @returns {Promise<string|null>} Token or null if not signed in
 */
export const getToken = async () => {
  const user = getFirebaseUser();
  if (!user) {
    return null;
  }
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Token acquisition failed:', error);
    return null;
  }
};

/**
 * Check if user is in a specific role
 * @param {string} roleName Role to check
 * @returns {Promise<boolean>} True if user is in role
 */
export const isUserInRole = async (roleName) => {
  const user = getFirebaseUser();
  if (!user) return false;
  
  try {
    // In a real scenario, this would check custom claims
    // For now we'll use a simple email-based check similar to the original
    if (user.email.includes('admin')) {
      return true; // Admin has all roles
    }
    
    if (roleName === 'requester') {
      return true; // All authenticated users can be requesters
    }
    
    if (roleName === 'shopCrew' && user.email.includes('maintenance')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Role check failed:', error);
    return false;
  }
};

export default {
  login,
  logout,
  getCurrentUser,
  getToken,
  isUserInRole,
  subscribeToAuthChanges
};