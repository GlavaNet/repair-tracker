// Microsoft Entra ID (formerly Azure AD) authentication service
import { PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  }
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Login scopes
const loginRequest = {
  scopes: ['User.Read']
};

// Handle login
export const login = async () => {
  try {
    // Login via popup
    const authResult = await msalInstance.loginPopup(loginRequest);
    return authResult;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
};

// Handle logout
export const logout = () => {
  msalInstance.logout();
};

// Get current user
export const getCurrentUser = () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    return null;
  }
  return accounts[0];
};

// Acquire token silently
export const getToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    return null;
  }
  
  const silentRequest = {
    scopes: ['User.Read'],
    account: accounts[0]
  };
  
  try {
    const response = await msalInstance.acquireTokenSilent(silentRequest);
    return response.accessToken;
  } catch (error) {
    // Fall back to interactive method if silent acquisition fails
    try {
      const response = await msalInstance.acquireTokenPopup(silentRequest);
      return response.accessToken;
    } catch (interactiveError) {
      console.error('Token acquisition failed:', interactiveError);
      return null;
    }
  }
};

// Check if user is in a specific role/group
export const isUserInRole = async (roleName) => {
  try {
    const token = await getToken();
    if (!token) return false;
    
    // In a real implementation, this would call Microsoft Graph API
    // to check group membership
    
    // Mock implementation for demo purposes
    const user = getCurrentUser();
    if (!user) return false;
    
    // Mock roles based on email domain
    if (user.username.includes('admin')) {
      return true; // Admin has all roles
    }
    
    if (roleName === 'requester') {
      return true; // All authenticated users can be requesters
    }
    
    if (roleName === 'shopCrew' && user.username.includes('maintenance')) {
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
  isUserInRole
};