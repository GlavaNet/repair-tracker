import React, { useState, useEffect } from 'react';
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

const App = () => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [filterDivision, setFilterDivision] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [user, setUser] = useState(null);
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
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
    
    // Force logout on page load
    localStorage.removeItem('repair_tracker_auth');
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('repair_tracker_requests', JSON.stringify(requests));
    }
    if (equipment.length > 0) {
      localStorage.setItem('repair_tracker_equipment', JSON.stringify(equipment));
    }
  }, [requests, equipment]);

  // Handle login button click - just show confirmation dialog
  const handleLoginClick = () => {
    setShowLoginConfirm(true);
  };
  
  // Actual login function - separate from button handler
  const confirmLogin = () => {
    setIsAuthenticated(true);
    setUser({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    });
    setShowLoginConfirm(false);
  };
  
  // Cancel login
  const cancelLogin = () => {
    setShowLoginConfirm(false);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('repair_tracker_auth');
    setUser(null);
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
    setIsKioskMode(!isKioskMode);
  };

  // Filter requests based on current filters
  const filteredRequests = requests.filter(req => {
    const divisionMatch = filterDivision === 'All' || req.division === filterDivision;
    const statusMatch = filterStatus === 'All' || req.status === filterStatus;
    return divisionMatch && statusMatch;
  });

  // Render login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Repair Request Tracker</h1>
          <p className="mb-6 text-center text-gray-600">Sign in with your Microsoft account</p>
          
          {showLoginConfirm ? (
            <div>
              <p className="mb-4 text-center">This is a demo login. Would you like to continue?</p>
              <div className="flex space-x-4">
                <button 
                  onClick={cancelLogin}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogin}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Confirm Login
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLoginClick}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Sign In with Microsoft
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render kiosk mode if enabled
  if (isKioskMode) {
    return (
      <KioskMode 
        requests={filteredRequests} 
        toggleKioskMode={toggleKioskMode} 
        filterDivision={filterDivision}
        filterStatus={filterStatus}
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

  // Main application interface
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