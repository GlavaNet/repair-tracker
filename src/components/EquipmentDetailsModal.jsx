import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const EquipmentDetailsModal = ({ equipment, onClose, onEditClick, onHistoryClick }) => {
  const { setEquipment } = useContext(AppContext);
  
  if (!equipment) return null;
  
  // Function to handle edit button click
  const handleEditClick = () => {
    // Signal to parent component to show edit modal
    onClose();
    // Add small delay to prevent UI glitches
    setTimeout(() => {
      if (onEditClick) onEditClick(equipment);
    }, 50);
  };
  
  // Function to handle repair history button click
  const handleHistoryClick = () => {
    console.log("View Repair History clicked for equipment:", equipment);
    
    // Close this modal
    onClose();
    
    // Signal to parent component to show history modal
    if (onHistoryClick) {
      onHistoryClick(equipment);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium dark:text-white">{equipment.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Equipment ID</p>
              <p className="dark:text-white">{equipment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Division</p>
              <p className="dark:text-white">{equipment.division}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Year</p>
              <p className="dark:text-white">{equipment.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Make</p>
              <p className="dark:text-white">{equipment.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Model</p>
              <p className="dark:text-white">{equipment.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">VIN</p>
              <p className="dark:text-white">{equipment.vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts Make</p>
              <p className="dark:text-white">{equipment.partsMake}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts Model</p>
              <p className="dark:text-white">{equipment.partsModel}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parts VIN</p>
              <p className="dark:text-white">{equipment.partsVin}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <button 
              onClick={handleEditClick} 
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Edit
            </button>
            <button 
              onClick={handleHistoryClick}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Repair History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsModal;