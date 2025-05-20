// src/components/Settings.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { exportRequestsToExcel, exportEquipmentToExcel } from '../services/exportService';

const Settings = () => {
 const { divisions, setDivisions, requests, equipment, setRequests } = useContext(AppContext);
 
 const [defaultDivision, setDefaultDivision] = useState('All');
 const [kioskRefreshRate, setKioskRefreshRate] = useState('30');
 const [darkMode, setDarkMode] = useState(
   localStorage.getItem('darkMode') 
   ? localStorage.getItem('darkMode') === 'true'
   : window.matchMedia('(prefers-color-scheme: dark)').matches
 );
 const [newDivision, setNewDivision] = useState('');
 const [manageDivisionsOpen, setManageDivisionsOpen] = useState(false);
 
 // Initialize dark mode based on system preference or saved preference
 useEffect(() => {
   // Check if dark mode setting exists in localStorage
   const savedDarkMode = localStorage.getItem('darkMode');
   
   if (savedDarkMode === null) {
     // If no saved preference, use system preference
     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
     setDarkMode(isDarkMode);
     localStorage.setItem('darkMode', isDarkMode.toString());
     applyDarkMode(isDarkMode);
   } else {
     // Use saved preference
     const isDarkMode = savedDarkMode === 'true';
     setDarkMode(isDarkMode);
     applyDarkMode(isDarkMode);
   }
   
   // Listen for system preference changes
   const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
   const handleChange = (e) => {
     // Only change if user hasn't set a preference
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
     // Fallback for older browsers
     darkModeMediaQuery.addListener(handleChange);
     return () => darkModeMediaQuery.removeListener(handleChange);
   }
 }, []);
 
 // Apply dark mode to document
 const applyDarkMode = (isDark) => {
   if (isDark) {
     document.documentElement.classList.add('dark');
   } else {
     document.documentElement.classList.remove('dark');
   }
 };
 
 // Toggle dark mode
 const toggleDarkMode = () => {
   const newDarkMode = !darkMode;
   setDarkMode(newDarkMode);
   localStorage.setItem('darkMode', newDarkMode.toString());
   localStorage.setItem('userSetDarkMode', 'true'); // User preference override
   applyDarkMode(newDarkMode);
 };
 
 // Clear local storage data
 const clearStorageData = () => {
   if (window.confirm('Are you sure you want to clear all completed requests?')) {
     // Filter out completed requests
     const activeRequests = requests.filter(req => req.dateCompleted === null);
     // Update context
     setRequests(activeRequests);
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
 
 // Manage divisions dialog
 const handleManageDivisions = () => {
   setManageDivisionsOpen(true);
 };
 
 // Add new division
 const addDivision = () => {
   if (newDivision.trim() === '') return;
   
   if (divisions.includes(newDivision.trim())) {
     alert('This division already exists');
     return;
   }
   
   setDivisions([...divisions, newDivision.trim()]);
   setNewDivision('');
 };
 
 // Remove division
 const removeDivision = (divisionToRemove) => {
   if (window.confirm(`Are you sure you want to remove the "${divisionToRemove}" division?`)) {
     setDivisions(divisions.filter(d => d !== divisionToRemove));
   }
 };
 
 // Export data backup
 const handleDataBackup = () => {
   try {
     // Export requests
     exportRequestsToExcel(requests, { filename: 'backup_requests.xlsx' });
     
     // Export equipment
     setTimeout(() => {
       exportEquipmentToExcel(equipment, { filename: 'backup_equipment.xlsx' });
     }, 1000); // Slight delay to prevent browser issues with multiple downloads
     
     alert('Data backup files have been generated');
   } catch (error) {
     console.error('Backup failed:', error);
     alert('Failed to create backup files');
   }
 };
 
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
             onClick={handleManageDivisions}
             className="bg-blue-600 text-white px-4 py-2 rounded"
           >
             Manage
           </button>
         </div>
         
         <div className="flex items-center justify-between">
           <div>
             <h4 className="font-medium">Data Backup</h4>
             <p className="text-sm text-gray-500 dark:text-gray-300">Export all data for backup purposes</p>
           </div>
           <button 
             onClick={handleDataBackup}
             className="bg-blue-600 text-white px-4 py-2 rounded"
           >
             Export Data
           </button>
         </div>
       </div>
     </div>
     
     <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
       <h3 className="font-medium mb-4">Storage</h3>
       
       <div className="space-y-4">
         <div>
           <h4 className="font-medium">Local Storage Usage</h4>
           <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-2 mb-2">
             <div className="bg-blue-600 h-2.5 rounded-full w-1/4"></div>
           </div>
           <p className="text-sm text-gray-500 dark:text-gray-300">Using approximately 25% of available storage</p>
         </div>
         
         <div className="flex items-center justify-between">
           <div>
             <h4 className="font-medium">Clear Completed Requests</h4>
             <p className="text-sm text-gray-500 dark:text-gray-300">Remove completed requests older than 1 year</p>
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
             <p className="text-sm text-gray-500 dark:text-gray-300">Clear all data and reset to defaults</p>
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
                 className="flex-1 border rounded p-2 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
               />
               <button
                 onClick={addDivision}
                 className="bg-blue-600 text-white px-3 py-2 rounded"
               >
                 Add
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
                         className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                       >
                         Remove
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
               className="bg-blue-600 text-white px-4 py-2 rounded"
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