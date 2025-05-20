import React from 'react';
import { Monitor } from 'lucide-react';

const KioskMode = ({ requests, toggleKioskMode, filterDivision, filterStatus }) => {
  // Only show open requests in kiosk mode
  const openRequests = requests.filter(req => req.dateCompleted === null);

  return (
    <div className="h-screen bg-black text-white p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Open Repair Requests</h1>
        <button 
          onClick={toggleKioskMode}
          className="bg-gray-800 text-white px-3 py-1 rounded flex items-center"
        >
          <Monitor size={16} className="mr-1" /> Exit Kiosk
        </button>
      </div>
      
      <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {openRequests.length > 0 ? (
          openRequests.map(request => (
            <div 
              key={request.id}
              className="bg-gray-800 p-3 rounded-lg border border-gray-700 kiosk-fade-in"
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
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-xl">No open repair requests found.</p>
            <p className="text-gray-400 mt-2">All requests have been completed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KioskMode;