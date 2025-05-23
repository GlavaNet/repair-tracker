// src/components/Settings.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { exportRequestsToExcel, exportEquipmentToExcel } from '../services/exportService';
import { 
  saveDivisions, 
  exportDatabaseData, 
  importDatabaseData,
  deleteRequest,
  deleteEquipment 
} from '../services/firebaseService';

const Settings = () => {
  const { divisions, setDivisions, requests, equipment, setRequests, user } = useContext(AppContext);
  
  const [defaultDivision, setDefaultDivision] = useState('All');
  const [kioskRefreshRate, setKioskRefreshRate] = useState('30');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') 
    ? localStorage.getItem('darkMode') === 'true'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [newDivision, setNewDivision] = useState('');
  const [manageDivisionsOpen, setManageDivisionsOpen] = useState(false);
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  
  // Initialize dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === null) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
      localStorage.setItem('darkMode', isDarkMode.toString());
      applyDarkMode(isDarkMode);
    } else {
      const isDarkMode = savedDarkMode === 'true';
      setDarkMode(isDarkMode);
      applyDarkMode(isDarkMode);
    }
    
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('userSetDarkMode') !== 'true') {
        setDarkMode(e.matches);
        localStorage.setItem('darkMode', e.matches.toString());
        applyDarkMode(e.matches);
      }
    };
    
    if (darkModeMediaQuery.addEventListener) {
      darkModeMediaQuery.addEventListener('change', handleChange);
      return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    } else {
      darkModeMediaQuery.addListener(handleChange);
      return () => darkModeMediaQuery.removeListener(handleChange);
    }
  }, []);
  
  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    localStorage.setItem('userSetDarkMode', 'true');
    applyDarkMode(newDarkMode);
  };
  
  // Clear completed requests from Firebase
  const clearCompletedRequests = async () => {
    if (window.confirm('Are you sure you want to delete all completed requests? This action cannot be undone.')) {
      setIsOperationInProgress(true);
      try {
        const completedRequests = requests.filter(req => req.dateCompleted !== null);
        
        for (const request of completedRequests) {
          if (request.docId) {
            await deleteRequest(request.docId);
          }
        }
        
        alert(`${completedRequests.length} completed requests have been deleted from Firebase.`);
      } catch (error) {
        console.error('Error clearing completed requests:', error);
        alert('Failed to clear completed requests. Please try again.');
      } finally {
        setIsOperationInProgress(false);
      }
    }
  };
  
  // Export Firebase data as backup
  const handleFirebaseBackup = async () => {
    setIsOperationInProgress(true);
    try {
      const backupData = await exportDatabaseData();
      
      // Create and download backup file
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `repair-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Firebase backup created successfully');
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Failed to create backup. Please try again.');
    } finally {
      setIsOperationInProgress(false);
    }
  };
  
  // Import Firebase data from backup
  const handleFirebaseRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (window.confirm('WARNING: This will import data into Firebase. Existing data may be duplicated. Continue?')) {
      setIsOperationInProgress(true);
      try {
        const fileContent = await file.text();
        await importDatabaseData(fileContent);
        alert('Data successfully imported to Firebase');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data. Please check the file format and try again.');
      } finally {
        setIsOperationInProgress(false);
        // Reset file input
        event.target.value = '';
      }
    }
  };
  
  // Reset application data
  const resetApplication = () => {
    if (window.confirm('WARNING: This will clear all local settings and return to kiosk mode. Firebase data will remain unchanged. Continue?')) {
      // Clear only local storage settings
      localStorage.removeItem('darkMode');
      localStorage.removeItem('userSetDarkMode');
      alert('Local settings cleared. Please refresh the page.');
    }
  };
  
  // Add new division to Firebase
  const addDivision = async () => {
    if (newDivision.trim() === '') return;
    
    if (divisions.includes(newDivision.trim())) {
      alert('This division already exists');
      return;
    }
    
    setIsOperationInProgress(true);
    try {
      const updatedDivisions = [...divisions, newDivision.trim()];
      await saveDivisions(updatedDivisions);
      setDivisions(updatedDivisions);
      setNewDivision('');
    } catch (error) {
      console.error('Error adding division:', error);
      alert('Failed to add division. Please try again.');
    } finally {
      setIsOperationInProgress(false);
    }
  };
  
  // Remove division from Firebase
  const removeDivision = async (divisionToRemove) => {
    if (window.confirm(`Are you sure you want to remove the "${divisionToRemove}" division?`)) {
      setIsOperationInProgress(true);
      try {
        const updatedDivisions = divisions.filter(d => d !== divisionToRemove);
        await saveDivisions(updatedDivisions);
        setDivisions(updatedDivisions);
      } catch (error) {
        console.error('Error removing division:', error);
        alert('Failed to remove division. Please try again.');
      } finally {
        setIsOperationInProgress(false);
      }
    }
  };
  
  // Export data backup using existing Excel export
  const handleDataBackup = () => {
    try {
      exportRequestsToExcel(requests, { filename: 'backup_requests.xlsx' });
      
      setTimeout(() => {
        exportEquipmentToExcel(equipment, { filename: 'backup_equipment.xlsx' });
      }, 1000);
      
      alert('Excel backup files have been generated');
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Failed to create backup files');
    }
  };
  
  // Calculate Firebase storage info (simplified)
  const getFirebaseStorageInfo = () => {
    const totalItems = requests.length + equipment.length + divisions.length;
    const estimatedSize = totalItems * 1024; // Rough estimate
    
    return {
      totalItems,
      estimatedSize,
      requests: requests.length,
      equipment: equipment.length,
      divisions: divisions.length
    };
  };
  
  const storageInfo = getFirebaseStorageInfo();
  
  return (
    <div className="p-6 dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">User Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Default Division Filter</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Set your default division view</p>
            </div>
            <select 
              value={defaultDivision}
              onChange={(e) => setDefaultDivision(e.target.value)}
              className="border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="All">All Divisions</option>
              {divisions.map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Toggle dark mode for the application</p>
            </div>
            <div 
              onClick={toggleDarkMode}
              className={`relative inline-block w-12 h-6 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-200'} cursor-pointer transition-colors`}
            >
              <div 
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Kiosk Refresh Rate</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">How often the kiosk display refreshes</p>
            </div>
            <select 
              value={kioskRefreshRate}
              onChange={(e) => setKioskRefreshRate(e.target.value)}
              className="border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="900">15 minutes</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">Administration</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Manage Divisions</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Add, edit, or remove divisions</p>
            </div>
            <button 
              onClick={() => setManageDivisionsOpen(true)}
              disabled={isOperationInProgress}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Manage
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Excel Data Backup</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Export all data to Excel files</p>
            </div>
            <button 
              onClick={handleDataBackup}
              disabled={isOperationInProgress}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">Firebase Data Management</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Firebase Storage Usage</h4>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Requests:</span>
                <span>{storageInfo.requests} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Equipment:</span>
                <span>{storageInfo.equipment} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Divisions:</span>
                <span>{storageInfo.divisions} items</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total Items:</span>
                <span>{storageInfo.totalItems}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Firebase Backup</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Export complete Firebase data as JSON</p>
            </div>
            <button 
              onClick={handleFirebaseBackup}
              disabled={isOperationInProgress}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isOperationInProgress ? 'Exporting...' : 'Export Firebase Data'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Firebase Restore</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Import data backup to Firebase</p>
            </div>
            <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 inline-block">
              {isOperationInProgress ? 'Importing...' : 'Import Firebase Data'}
              <input 
                type="file" 
                accept=".json"
                onChange={handleFirebaseRestore}
                disabled={isOperationInProgress}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Clear Completed Requests</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Remove completed requests from Firebase</p>
            </div>
            <button 
              onClick={clearCompletedRequests}
              disabled={isOperationInProgress}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isOperationInProgress ? 'Clearing...' : 'Clear Completed'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reset Local Settings</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">Clear local preferences (Firebase data preserved)</p>
            </div>
            <button 
              onClick={resetApplication}
              disabled={isOperationInProgress}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Reset Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* User Info */}
      {user && (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h3 className="font-medium mb-4">Current User</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Divisions Management Modal */}
      {manageDivisionsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Manage Divisions</h3>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newDivision}
                  onChange={(e) => setNewDivision(e.target.value)}
                  placeholder="New division name"
                  disabled={isOperationInProgress}
                  className="flex-1 border rounded p-2 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50"
                />
                <button
                  onClick={addDivision}
                  disabled={isOperationInProgress || !newDivision.trim()}
                  className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50"
                >
                  {isOperationInProgress ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Division Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {divisions.map(division => (
                    <tr key={division} className="dark:text-white">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {division}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => removeDivision(division)}
                          disabled={isOperationInProgress}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          {isOperationInProgress ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setManageDivisionsOpen(false)}
                disabled={isOperationInProgress}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;