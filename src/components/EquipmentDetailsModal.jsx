import React from 'react';

const EquipmentDetailsModal = ({ equipment, onClose }) => {
  if (!equipment) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{equipment.name}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Equipment ID</p>
              <p>{equipment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Division</p>
              <p>{equipment.division}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Year</p>
              <p>{equipment.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Make</p>
              <p>{equipment.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Model</p>
              <p>{equipment.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">VIN</p>
              <p>{equipment.vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Parts Make</p>
              <p>{equipment.partsMake}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Parts Model</p>
              <p>{equipment.partsModel}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Parts VIN</p>
              <p>{equipment.partsVin}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <button className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">
              Edit
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              View Repair History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsModal;