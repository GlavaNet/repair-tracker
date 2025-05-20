// src/components/DeleteConfirmationModal.jsx
import React, { useContext } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const DeleteConfirmationModal = ({ equipment, onClose }) => {
  const { setEquipment, requests } = useContext(AppContext);
  
  if (!equipment) return null;
  
  // Check if equipment has any associated repair requests
  const hasRepairRequests = requests.some(req => req.equipmentId === equipment.id);
  
  const handleDelete = () => {
    // Remove equipment from the list
    setEquipment(prev => prev.filter(item => item.id !== equipment.id));
    
    // Close modal
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium dark:text-white">Confirm Deletion</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-3">
              <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-lg font-medium dark:text-white">Delete Equipment?</h4>
          </div>
          
          <p className="mb-4 dark:text-gray-300">
            Are you sure you want to delete <strong>{equipment.name}</strong> ({equipment.id})?
            This action cannot be undone.
          </p>
          
          {hasRepairRequests && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    <strong>Warning:</strong> This equipment has repair requests associated with it.
                    Deleting it may affect historical records.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;