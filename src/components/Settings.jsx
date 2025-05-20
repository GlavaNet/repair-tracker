import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Settings = () => {
  const { divisions } = useContext(AppContext);
  
  const [defaultDivision, setDefaultDivision] = useState('All');
  const [kioskRefreshRate, setKioskRefreshRate] = useState('30');
  const [darkMode, setDarkMode] = useState(false);
  
  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would apply dark mode styling
  };
  
  // Clear local storage data
  const clearStorageData = () => {
    if (window.confirm('Are you sure you want to clear all completed requests?')) {
      // In a real implementation, this would filter out completed requests
      alert('Completed requests have been cleared');
    }
  };
  
  // Reset application
  const resetApplication = () => {
    if (window.confirm('WARNING: This will delete ALL data and reset the application to default settings. This action cannot be undone. Continue?')) {
      localStorage.clear();
      alert('Application has been reset. The page will now reload.');
      window.location.reload();
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">User Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Default Division Filter</h4>
              <p className="text-sm text-gray-500">Set your default division view</p>
            </div>
            <select 
              value={defaultDivision}
              onChange={(e) => setDefaultDivision(e.target.value)}
              className="border rounded p-2"
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
              <p className="text-sm text-gray-500">Toggle dark mode for the application</p>
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
              <p className="text-sm text-gray-500">How often the kiosk display refreshes</p>
            </div>
            <select 
              value={kioskRefreshRate}
              onChange={(e) => setKioskRefreshRate(e.target.value)}
              className="border rounded p-2"
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="900">15 minutes</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">Administration</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Microsoft Entra ID Integration</h4>
              <p className="text-sm text-gray-500">Configure authentication settings</p>
            </div>
            <button 
              onClick={() => alert('This would open Entra ID configuration')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Configure
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Manage Divisions</h4>
              <p className="text-sm text-gray-500">Add, edit, or remove divisions</p>
            </div>
            <button 
              onClick={() => alert('This would open division management')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Manage
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Backup</h4>
              <p className="text-sm text-gray-500">Export all data for backup purposes</p>
            </div>
            <button 
              onClick={() => alert('This would download a backup file')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium mb-4">Storage</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Local Storage Usage</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full w-1/4"></div>
            </div>
            <p className="text-sm text-gray-500">Using approximately 25% of available storage</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Clear Completed Requests</h4>
              <p className="text-sm text-gray-500">Remove completed requests older than 1 year</p>
            </div>
            <button 
              onClick={clearStorageData}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear Data
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reset Application</h4>
              <p className="text-sm text-gray-500">Clear all data and reset to defaults</p>
            </div>
            <button 
              onClick={resetApplication}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;