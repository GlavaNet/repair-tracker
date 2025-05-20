import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const RequestDetails = () => {
  const { 
    selectedRequest, 
    equipment, 
    handleStatusChange, 
    handleCompleteRequest, 
    setActiveSection 
  } = useContext(AppContext);

  if (!selectedRequest) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center">
          <p className="dark:text-white">No request selected. Please select a request from the list.</p>
          <button 
            onClick={() => setActiveSection('requests')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Requests
          </button>
        </div>
      </div>
    );
  }

  // Find equipment details
  const equipmentDetails = equipment.find(eq => eq.id === selectedRequest.equipmentId);

  return (
    <div className="p-6 dark:bg-gray-800">
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => setActiveSection('requests')}
            className="mr-4 text-blue-600 dark:text-blue-400"
          >
            ← Back to Requests
          </button>
          <h2 className="text-2xl font-bold dark:text-white">Request {selectedRequest.id}</h2>
        </div>
        
        <div className="space-x-2">
          {!selectedRequest.dateCompleted && (
            <select 
              value={selectedRequest.status}
              onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value)}
              className="border rounded p-2 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Parts">Awaiting Parts</option>
              <option value="Completed">Completed</option>
            </select>
          )}
          
          {!selectedRequest.dateCompleted && (
            <button 
              onClick={() => handleCompleteRequest(selectedRequest.id)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Mark as Completed
            </button>
          )}
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Edit Request
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b dark:border-gray-600">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium dark:text-white">Request Details</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${
              selectedRequest.status === 'Awaiting Parts' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
              selectedRequest.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
              selectedRequest.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
              'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
            }`}>
              {selectedRequest.status}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 divide-x dark:divide-gray-600">
          {/* Requester Info */}
          <div className="p-6">
            <h4 className="font-medium mb-4 dark:text-white">Requester Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Division</p>
                <p className="dark:text-white">{selectedRequest.division}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Requester Name</p>
                <p className="dark:text-white">{selectedRequest.requesterName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date Requested</p>
                <p className="dark:text-white">{selectedRequest.dateRequested}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Job/Location</p>
                <p className="dark:text-white">{selectedRequest.jobLocation}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Equipment</p>
                <p className="dark:text-white">{selectedRequest.equipmentName} ({selectedRequest.equipmentId})</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Issue Description</p>
                <p className="dark:text-white">{selectedRequest.description}</p>
              </div>
            </div>
          </div>
          
          {/* Shop Crew Info */}
          <div className="p-6">
            <h4 className="font-medium mb-4 dark:text-white">Shop Crew Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts/Service Required</p>
                <p className="dark:text-white">{selectedRequest.partsRequired || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date Parts Ordered</p>
                <p className="dark:text-white">{selectedRequest.dateOrdered || 'Not ordered'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts Vendor</p>
                <p className="dark:text-white">{selectedRequest.partsVendor || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Arrival</p>
                <p className="dark:text-white">{selectedRequest.expectedArrival || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Assigned Technician</p>
                <p className="dark:text-white">{selectedRequest.assignedTech || 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date Completed</p>
                <p className="dark:text-white">{selectedRequest.dateCompleted || 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Equipment Details */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b dark:border-gray-600">
          <h3 className="text-lg font-medium dark:text-white">Equipment Details</h3>
        </div>
        
        <div className="p-6">
          {equipmentDetails ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Equipment ID</p>
                <p className="dark:text-white">{equipmentDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
                <p className="dark:text-white">{equipmentDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Division</p>
                <p className="dark:text-white">{equipmentDetails.division}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Year</p>
                <p className="dark:text-white">{equipmentDetails.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Make</p>
                <p className="dark:text-white">{equipmentDetails.make}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Model</p>
                <p className="dark:text-white">{equipmentDetails.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">VIN</p>
                <p className="dark:text-white">{equipmentDetails.vin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts Make</p>
                <p className="dark:text-white">{equipmentDetails.partsMake}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts Model</p>
                <p className="dark:text-white">{equipmentDetails.partsModel}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts VIN</p>
                <p className="dark:text-white">{equipmentDetails.partsVin}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Equipment details not found.</p>
          )}
        </div>
      </div>
      
      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b dark:border-gray-600">
          <h3 className="text-lg font-medium dark:text-white">Activity Timeline</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-400"></div>
                </div>
                <div className="h-full w-px bg-gray-200 dark:bg-gray-600 mx-auto mt-2"></div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium dark:text-white">Request Created</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.dateRequested}</p>
                <p className="mt-1 text-sm dark:text-gray-300">
                  {selectedRequest.requesterName} submitted a repair request for {selectedRequest.equipmentName}.
                </p>
              </div>
            </div>
            
            {selectedRequest.dateOrdered && (
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                  </div>
                  <div className="h-full w-px bg-gray-200 dark:bg-gray-600 mx-auto mt-2"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium dark:text-white">Parts Ordered</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.dateOrdered}</p>
                  <p className="mt-1 text-sm dark:text-gray-300">
                    {selectedRequest.partsRequired} ordered from {selectedRequest.partsVendor}.
                  </p>
                </div>
              </div>
            )}
            
            {selectedRequest.status === 'Awaiting Parts' && selectedRequest.expectedArrival && (
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-600 dark:bg-yellow-400"></div>
                  </div>
                  <div className="h-full w-px bg-gray-200 dark:bg-gray-600 mx-auto mt-2"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium dark:text-white">Awaiting Parts</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Status</p>
                  <p className="mt-1 text-sm dark:text-gray-300">
                    Parts expected to arrive on {selectedRequest.expectedArrival}.
                  </p>
                </div>
              </div>
            )}
            
            {selectedRequest.status === 'In Progress' && (
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                  </div>
                  <div className="h-full w-px bg-gray-200 dark:bg-gray-600 mx-auto mt-2"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium dark:text-white">Repair In Progress</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Status</p>
                  <p className="mt-1 text-sm dark:text-gray-300">
                    {selectedRequest.assignedTech || 'A technician'} is working on the repair.
                  </p>
                </div>
              </div>
            )}
            
            {selectedRequest.dateCompleted && (
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-400"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium dark:text-white">Request Completed</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.dateCompleted}</p>
                  <p className="mt-1 text-sm dark:text-gray-300">
                    Repair was completed by {selectedRequest.assignedTech || 'a technician'}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;