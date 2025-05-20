import React, { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import RepairRequests from './RepairRequests';
import RequestDetails from './RequestDetails';
import Equipment from './Equipment';
import Reports from './Reports';
import Settings from './Settings';
import KioskMode from './KioskMode';
import { AppContext } from '../context/AppContext';

// Import mock data
import { divisions } from '../data/divisions';
import { requests as initialRequests } from '../data/requests';
import { equipment as initialEquipment } from '../data/equipment';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || 'mock-client-id',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID || 'mock-tenant-id'}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  }
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Login request scopes
const loginRequest = {
  scopes: ['User.Read']
};

const App = () => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isKioskMode, setIsKioskMode] = useState(true); // Default to kiosk mode
  const [filterDivision, setFilterDivision] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data and check authentication on mount
  useEffect(() => {
    // Load data regardless of authentication
    loadData();
    
    // Check for existing auth
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      setUser({
        name: accounts[0].name,
        email: accounts[0].username,
        role: 'user' // Role would be determined from claims in a real app
      });
      setIsAuthenticated(true);
      setIsKioskMode(false); // Exit kiosk mode when authenticated
    }
    
    setIsLoading(false);
  }, []);

  // Load data from localStorage or use initial data
  const loadData = () => {
    // Load saved requests or use mock data
    const savedRequests = localStorage.getItem('repair_tracker_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      setRequests(initialRequests);
    }

    // Load saved equipment or use mock data
    const savedEquipment = localStorage.getItem('repair_tracker_equipment');
    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
    } else {
      setEquipment(initialEquipment);
    }
  };

  // Save data to localStorage when it changes
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('repair_tracker_requests', JSON.stringify(requests));
    }
    if (equipment.length > 0) {
      localStorage.setItem('repair_tracker_equipment', JSON.stringify(equipment));
    }
  }, [requests, equipment]);

  // Handle login with MSAL
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const authResult = await msalInstance.loginPopup(loginRequest);
      
      if (authResult) {
        setUser({
          name: authResult.account.name,
          email: authResult.account.username,
          role: 'user' // Role would be determined from claims in a real app
        });
        setIsAuthenticated(true);
        setIsKioskMode(false); // Exit kiosk mode upon successful login
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Fallback for demo purposes
      setUser({
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin'
      });
      setIsAuthenticated(true);
      setIsKioskMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await msalInstance.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAuthenticated(false);
    setUser(null);
    setIsKioskMode(true); // Return to kiosk mode on logout
  };

  // Handle request selection
  const handleRequestClick = (requestId) => {
    const request = requests.find(req => req.id === requestId);
    setSelectedRequest(request);
    setActiveSection('requestDetail');
  };

  // Handle status change
  const handleStatusChange = (requestId, newStatus) => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        return {...req, status: newStatus};
      }
      return req;
    }));
  };

  // Mark request as completed
  const handleCompleteRequest = (requestId) => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req, 
          status: 'Completed', 
          dateCompleted: new Date().toISOString().split('T')[0]
        };
      }
      return req;
    }));
  };

  // Toggle kiosk mode
  const toggleKioskMode = () => {
    if (!isAuthenticated && !isKioskMode) {
      // Can't exit kiosk mode without authentication
      return;
    }
    setIsKioskMode(!isKioskMode);
  };

  // Enter admin mode from kiosk
  const enterAdminMode = () => {
    if (!isAuthenticated) {
      handleLogin();
    } else {
      setIsKioskMode(false);
    }
  };

  // Filter requests based on current filters
  const filteredRequests = requests.filter(req => {
    const divisionMatch = filterDivision === 'All' || req.division === filterDivision;
    const statusMatch = filterStatus === 'All' || req.status === filterStatus;
    return divisionMatch && statusMatch;
  });

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Render kiosk mode
  if (isKioskMode) {
    return (
      <KioskMode 
        requests={filteredRequests} 
        toggleKioskMode={enterAdminMode}
        filterDivision={filterDivision}
        filterStatus={filterStatus}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // Context value
  const contextValue = {
    requests,
    setRequests,
    equipment,
    setEquipment,
    divisions,
    selectedRequest,
    setSelectedRequest,
    filterDivision, 
    setFilterDivision,
    filterStatus, 
    setFilterStatus,
    handleRequestClick,
    handleStatusChange,
    handleCompleteRequest,
    user
  };

  // Main application interface (only shown when authenticated)
  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex h-screen bg-gray-50">
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          toggleKioskMode={toggleKioskMode}
          handleLogout={handleLogout}
          user={user}
        />

        <div className="flex-1 overflow-y-auto">
          {activeSection === 'dashboard' && <Dashboard />}
          {activeSection === 'requests' && <RepairRequests />}
          {activeSection === 'requestDetail' && <RequestDetails />}
          {activeSection === 'equipment' && <Equipment />}
          {activeSection === 'reports' && <Reports />}
          {activeSection === 'settings' && <Settings />}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;