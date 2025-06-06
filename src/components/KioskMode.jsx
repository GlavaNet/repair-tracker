import React, { useState } from 'react';
import { Monitor, LogIn, Filter } from 'lucide-react';

const KioskMode = ({ requests, toggleKioskMode, divisions, isAuthenticated }) => {
  // Only show open requests in kiosk mode
  const openRequests = requests.filter(req => req.dateCompleted === null);
  
  // Filter options for kiosk view
  const [kioskStatusFilter, setKioskStatusFilter] = useState('All');
  const [kioskDivisionFilter, setKioskDivisionFilter] = useState('All');
  
  // Filter requests based on kiosk filters
  const filteredRequests = openRequests.filter(req => {
    const statusMatch = kioskStatusFilter === 'All' || req.status === kioskStatusFilter;
    const divisionMatch = kioskDivisionFilter === 'All' || req.division === kioskDivisionFilter;
    return statusMatch && divisionMatch;
  });

  return (
    <div className="h-screen bg-black text-white dark:bg-gray-900">
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Open Repair Requests</h1>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-800 dark:bg-gray-700 rounded px-2 py-1 flex items-center space-x-2">
              <Filter size={14} className="text-gray-400" />
              <select 
                value={kioskStatusFilter}
                onChange={(e) => setKioskStatusFilter(e.target.value)}
                className="bg-gray-800 dark:bg-gray-700 text-white border-none focus:ring-0"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Parts">Awaiting Parts</option>
              </select>
            </div>
            
            <div className="bg-gray-800 dark:bg-gray-700 rounded px-2 py-1">
              <select 
                value={kioskDivisionFilter}
                onChange={(e) => setKioskDivisionFilter(e.target.value)}
                className="bg-gray-800 dark:bg-gray-700 text-white border-none focus:ring-0"
              >
                <option value="All">All Divisions</option>
                {divisions && divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={toggleKioskMode}
              className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
            >
              {isAuthenticated ? (
                <>
                  <Monitor size={16} className="mr-1" /> Exit Kiosk
                </>
              ) : (
                <>
                  <LogIn size={16} className="mr-1" /> Sign in with Microsoft
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <div 
                key={request.id}
                className="bg-gray-800 dark:bg-gray-800 p-3 rounded-lg border border-gray-700 kiosk-fade-in"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold mr-3">{request.equipmentName}</h2>
                    <p className="text-sm text-gray-300">{request.division} - {request.jobLocation}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'Awaiting Parts' ? 'bg-yellow-600' : 
                      request.status === 'In Progress' ? 'bg-blue-600' : 
                      'bg-green-600'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mb-1 text-sm">
                  <div>
                    <p className="text-gray-400">Requested By:</p>
                    <p>{request.requesterName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Assigned To:</p>
                    <p>{request.assignedTech || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Issue:</p>
                    <p className="truncate">{request.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Parts Status:</p>
                    <p className="truncate">
                      {request.status === 'Awaiting Parts' 
                        ? `Expected ${request.expectedArrival}` 
                        : request.partsRequired || 'No parts required'}
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Request ID: {request.id} | Submitted: {request.dateRequested}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-xl">No open repair requests found.</p>
              <p className="text-gray-400 mt-2">All requests have been completed or don't match your filters.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer with auto-refresh information */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 dark:bg-gray-900 p-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-500">
            Auto-refreshing every 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default KioskMode;