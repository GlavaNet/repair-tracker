// src/components/NewRequestModal.jsx
import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const NewRequestModal = ({ onClose }) => {
  const { divisions, equipment, requests, setRequests } = useContext(AppContext);
  
  // Form state
  const [formData, setFormData] = useState({
    division: '',
    requesterName: '',
    jobLocation: '',
    equipmentId: '',
    description: '',
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate a new request ID
  const generateRequestId = () => {
    const year = new Date().getFullYear();
    const latestIdNum = Math.max(...requests.map(req => 
      parseInt(req.id.split('-')[2] || 0)
    ), 0);
    return `REQ-${year}-${String(latestIdNum + 1).padStart(3, '0')}`;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // If equipment is selected, auto-set division
    if (name === 'equipmentId' && value) {
      const selectedEquipment = equipment.find(eq => eq.id === value);
      if (selectedEquipment) {
        setFormData(prev => ({
          ...prev,
          division: selectedEquipment.division
        }));
      }
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!formData.requesterName.trim()) {
      newErrors.requesterName = 'Requester name is required';
    }
    
    if (!formData.equipmentId) {
      newErrors.equipmentId = 'Equipment selection is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.jobLocation.trim()) {
      newErrors.jobLocation = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Find equipment details
      const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
      
      // Create new request
      const newRequest = {
        id: generateRequestId(),
        division: formData.division || selectedEquipment.division,
        requesterName: formData.requesterName.trim(),
        dateRequested: new Date().toISOString().split('T')[0],
        jobLocation: formData.jobLocation.trim(),
        equipmentId: formData.equipmentId,
        equipmentName: selectedEquipment ? selectedEquipment.name : 'Unknown Equipment',
        description: formData.description.trim(),
        status: 'New',
        partsRequired: null,
        dateOrdered: null,
        partsVendor: null,
        expectedArrival: null,
        assignedTech: null,
        dateCompleted: null
      };
      
      // Add to requests array
      setRequests(prevRequests => [newRequest, ...prevRequests]);
      
      // Close form
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Create New Repair Request</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment *
              </label>
              <select 
                name="equipmentId"
                value={formData.equipmentId}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${errors.equipmentId ? 'border-red-500' : ''}`}
              >
                <option value="">Select Equipment</option>
                {equipment.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.id})
                  </option>
                ))}
              </select>
              {errors.equipmentId && (
                <p className="text-red-500 text-xs mt-1">{errors.equipmentId}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division
              </label>
              <select 
                name="division"
                value={formData.division}
                onChange={handleChange}
                className="w-full border rounded p-2"
                disabled={formData.equipmentId !== ''}
              >
                <option value="">Select Division</option>
                {divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Auto-selected from equipment</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requester Name *
              </label>
              <input 
                type="text"
                name="requesterName"
                value={formData.requesterName}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full border rounded p-2 ${errors.requesterName ? 'border-red-500' : ''}`}
              />
              {errors.requesterName && (
                <p className="text-red-500 text-xs mt-1">{errors.requesterName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job/Location *
              </label>
              <input 
                type="text"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
                placeholder="Where is the equipment located?"
                className={`w-full border rounded p-2 ${errors.jobLocation ? 'border-red-500' : ''}`}
              />
              {errors.jobLocation && (
                <p className="text-red-500 text-xs mt-1">{errors.jobLocation}</p>
              )}
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail"
                rows={4}
                className={`w-full border rounded p-2 ${errors.description ? 'border-red-500' : ''}`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequestModal;