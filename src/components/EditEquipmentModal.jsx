// src/components/EditEquipmentModal.jsx
import React, { useState, useContext, useEffect } from 'react';
import { X } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { saveEquipment } from '../services/firebaseService';

const EditEquipmentModal = ({ equipment, onClose }) => {
 const { divisions, setEquipment } = useContext(AppContext);
 
 // Form state
 const [formData, setFormData] = useState({
   id: '',
   name: '',
   division: '',
   year: '',
   make: '',
   model: '',
   vin: '',
   partsMake: '',
   partsModel: '',
   partsVin: '',
   docId: '' // Firebase document ID
 });
 
 // Load equipment data when modal opens
 useEffect(() => {
   if (equipment) {
     setFormData({
       id: equipment.id,
       name: equipment.name,
       division: equipment.division,
       year: equipment.year,
       make: equipment.make,
       model: equipment.model,
       vin: equipment.vin,
       partsMake: equipment.partsMake,
       partsModel: equipment.partsModel,
       partsVin: equipment.partsVin,
       docId: equipment.docId || '' // Include Firebase document ID
     });
   }
 }, [equipment]);
 
 // Validation state
 const [errors, setErrors] = useState({});
 const [isSubmitting, setIsSubmitting] = useState(false);
 
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
 };
 
 // Validate form
 const validateForm = () => {
   const newErrors = {};
   
   // Check required fields
   if (!formData.name.trim()) {
     newErrors.name = 'Equipment name is required';
   }
   
   if (!formData.division) {
     newErrors.division = 'Division is required';
   }
   
   if (!formData.make.trim()) {
     newErrors.make = 'Make is required';
   }
   
   if (!formData.model.trim()) {
     newErrors.model = 'Model is required';
   }
   
   // Validate year
   const yearNum = parseInt(formData.year);
   const currentYear = new Date().getFullYear();
   if (!formData.year || isNaN(yearNum)) {
     newErrors.year = 'Valid year is required';
   } else if (yearNum < 1900 || yearNum > currentYear + 1) {
     newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
   }
   
   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
 };
 
 // Submit form
 const handleSubmit = async () => {
   if (validateForm()) {
     setIsSubmitting(true);
     
     try {
       // Prepare equipment data for Firebase
       const updatedEquipment = {
         id: formData.id,
         name: formData.name.trim(),
         division: formData.division,
         year: formData.year,
         make: formData.make.trim(),
         model: formData.model.trim(),
         vin: formData.vin.trim(),
         partsMake: formData.partsMake.trim(),
         partsModel: formData.partsModel.trim(),
         partsVin: formData.partsVin.trim(),
         docId: formData.docId // Include Firebase document ID for updates
       };
       
       // Save to Firebase
       const savedEquipment = await saveEquipment(updatedEquipment);
       
       // Update equipment list in state
       setEquipment(prevEquipment => 
         prevEquipment.map(item => 
           item.id === formData.id ? savedEquipment : item
         )
       );
       
       // Close form
       onClose();
     } catch (error) {
       console.error("Error updating equipment:", error);
       alert("There was an error updating the equipment. Please try again.");
       setIsSubmitting(false);
     }
   }
 };

 if (!equipment) return null;

 return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
       <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
         <h3 className="text-lg font-medium dark:text-white">Edit Equipment</h3>
         <button 
           onClick={onClose}
           className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
         >
           <X size={20} />
         </button>
       </div>
       
       <div className="p-6">
         <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="col-span-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Equipment ID
             </label>
             <input 
               type="text"
               value={formData.id}
               className="w-full border rounded p-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
               disabled
             />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Equipment ID cannot be changed</p>
           </div>
           
           <div className="col-span-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Equipment Name *
             </label>
             <input 
               type="text"
               name="name"
               value={formData.name}
               onChange={handleChange}
               placeholder="Descriptive name (e.g. Forklift #3)"
               className={`w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
             />
             {errors.name && (
               <p className="text-red-500 text-xs mt-1">{errors.name}</p>
             )}
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Division *
             </label>
             <select 
               name="division"
               value={formData.division}
               onChange={handleChange}
               className={`w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.division ? 'border-red-500 dark:border-red-500' : ''}`}
             >
               <option value="">Select Division</option>
               {divisions.map(division => (
                 <option key={division} value={division}>{division}</option>
               ))}
             </select>
             {errors.division && (
               <p className="text-red-500 text-xs mt-1">{errors.division}</p>
             )}
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Year *
             </label>
             <input 
               type="number"
               name="year"
               min="1900"
               max={new Date().getFullYear() + 1}
               value={formData.year}
               onChange={handleChange}
               className={`w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.year ? 'border-red-500 dark:border-red-500' : ''}`}
             />
             {errors.year && (
               <p className="text-red-500 text-xs mt-1">{errors.year}</p>
             )}
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Make *
             </label>
             <input 
               type="text"
               name="make"
               value={formData.make}
               onChange={handleChange}
               placeholder="Manufacturer"
               className={`w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.make ? 'border-red-500 dark:border-red-500' : ''}`}
             />
             {errors.make && (
               <p className="text-red-500 text-xs mt-1">{errors.make}</p>
             )}
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Model *
             </label>
             <input 
               type="text"
               name="model"
               value={formData.model}
               onChange={handleChange}
               placeholder="Model number/name"
               className={`w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.model ? 'border-red-500 dark:border-red-500' : ''}`}
             />
             {errors.model && (
               <p className="text-red-500 text-xs mt-1">{errors.model}</p>
             )}
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               VIN/Serial Number
             </label>
             <input 
               type="text"
               name="vin"
               value={formData.vin}
               onChange={handleChange}
               placeholder="Identification number"
               className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
             />
           </div>
           
           <div className="col-span-2 border-t dark:border-gray-700 pt-4 mt-2">
             <h4 className="font-medium mb-2 dark:text-white">Parts Information</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
               This information helps with ordering replacement parts.
             </p>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Parts Make
             </label>
             <input 
               type="text"
               name="partsMake"
               value={formData.partsMake}
               onChange={handleChange}
               placeholder="Parts manufacturer"
               className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
             />
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Parts Model
             </label>
             <input 
               type="text"
               name="partsModel"
               value={formData.partsModel}
               onChange={handleChange}
               placeholder="Parts model/number"
               className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
             />
           </div>
           
           <div className="col-span-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Parts VIN/Reference
             </label>
             <input 
               type="text"
               name="partsVin"
               value={formData.partsVin}
               onChange={handleChange}
               placeholder="Parts reference number"
               className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
             />
           </div>
         </div>
         
         <div className="flex justify-end space-x-3">
           <button 
             type="button"
             onClick={onClose}
             className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
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
             {isSubmitting ? 'Saving...' : 'Save Changes'}
           </button>
         </div>
       </div>
     </div>
   </div>
 );
};

export default EditEquipmentModal;