// src/components/RepairHistoryModal.jsx
import React, { useContext, useEffect } from 'react';
import { X, Clock, AlertCircle, Check, Clock4 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const RepairHistoryModal = ({ equipment, onClose }) => {
  const { requests } = useContext(AppContext);
  
  // Add effect for debugging
  useEffect(() => {
    console.log("RepairHistoryModal mounted with equipment:", equipment);
    console.log("Requests available:", requests.length);
    
    if (equipment) {
      const historyItems = requests.filter(req => req.equipmentId === equipment.id);
      console.log(`Found ${historyItems.length} repair history items for ${equipment.id}`);
    }
  }, [equipment, requests]);
  
  if (!equipment) {
    console.log("RepairHistoryModal: No equipment provided");
    return null;
  }
  
  // Get repair history for this equipment
  const repairHistory = requests
    .filter(req => req.equipmentId === equipment.id)
    .sort((a, b) => {
      // Sort by date descending (newest first)
      const dateA = new Date(a.dateRequested);
      const dateB = new Date(b.dateRequested);
      return dateB - dateA;
    });
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium dark:text-white">
            Repair History: {equipment.name} ({equipment.id})
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {repairHistory && repairHistory.length > 0 ? (
            <div className="space-y-6">
              {repairHistory.map(repair => (
                <div key={repair.id} className="border rounded-lg shadow-sm p-4 dark:border-gray-700">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 
                        ${repair.status === 'Awaiting Parts' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                          repair.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                          repair.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {repair.status === 'Awaiting Parts' ? <Clock4 size={16} /> : 
                         repair.status === 'In Progress' ? <Clock size={16} /> : 
                         repair.status === 'Completed' ? <Check size={16} /> : 
                         <AlertCircle size={16} />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium dark:text-white">{repair.id}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {repair.dateRequested} • {repair.requesterName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${repair.status === 'Awaiting Parts' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                          repair.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                          repair.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {repair.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Description</h5>
                    <p className="text-sm dark:text-gray-400">{repair.description}</p>
                  </div>
                  
                  {repair.partsRequired && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parts Required</h5>
                      <p className="text-sm dark:text-gray-400">{repair.partsRequired}</p>
                      {repair.partsVendor && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Ordered from {repair.partsVendor} on {repair.dateOrdered}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {repair.assignedTech && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Technician</h5>
                      <p className="text-sm dark:text-gray-400">{repair.assignedTech}</p>
                    </div>
                  )}
                  
                  {repair.dateCompleted && (
                    <div className="mb-0">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completion Date</h5>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">{repair.dateCompleted}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No repair history found for this equipment.</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairHistoryModal;