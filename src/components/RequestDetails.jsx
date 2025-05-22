// src/components/RequestDetails.jsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';
import { saveRequest } from '../services/firebaseService';

const RequestDetails = () => {
 const { 
   selectedRequest, 
   equipment, 
   handleStatusChange, 
   handleCompleteRequest, 
   setActiveSection,
   requests,
   setRequests 
 } = useContext(AppContext);

 // State for edit modal
 const [showEditModal, setShowEditModal] = useState(false);
 // State for edited request data
 const [editData, setEditData] = useState({});

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

 // Handler for back button click
 const handleBackClick = (e) => {
   e.preventDefault();
   setActiveSection('requests');
 };

 // Handler for status change
 const onStatusChange = async (e) => {
   const newStatus = e.target.value;
   try {
     // Update the request with new status
     const updatedRequest = { ...selectedRequest, status: newStatus };
     await saveRequest(updatedRequest);
     handleStatusChange(selectedRequest.id, newStatus);
   } catch (error) {
     console.error("Error updating request status:", error);
     alert("Failed to update request status. Please try again.");
   }
 };

 // Handler for mark as completed
 const onCompleteRequest = async () => {
   try {
     const updatedRequest = {
       ...selectedRequest,
       status: 'Completed',
       dateCompleted: new Date().toISOString().split('T')[0]
     };
     await saveRequest(updatedRequest);
     handleCompleteRequest(selectedRequest.id);
   } catch (error) {
     console.error("Error completing request:", error);
     alert("Failed to complete request. Please try again.");
   }
 };

 // Handler for edit request
 const onEditRequest = () => {
   // Initialize edit data with current request data
   setEditData({
     ...selectedRequest,
   });
   setShowEditModal(true);
 };

 // Handle form input changes in edit modal
 const handleEditChange = (e) => {
   const { name, value } = e.target;
   setEditData({
     ...editData,
     [name]: value
   });
 };

 // Save edited request
 const saveEditedRequest = async () => {
   try {
     // Save to Firebase
     const savedRequest = await saveRequest(editData);
     
     // Update the requests array
     const updatedRequests = requests.map(req => 
       req.id === selectedRequest.id ? savedRequest : req
     );
     
     // Update context
     setRequests(updatedRequests);
     
     // Close modal
     setShowEditModal(false);
   } catch (error) {
     console.error("Error saving edited request:", error);
     alert("Failed to save changes. Please try again.");
   }
 };

 return (
   <div className="p-6 dark:bg-gray-800">
     <div className="flex justify-between mb-6">
       <div className="flex items-center">
         <button 
           onClick={handleBackClick}
           className="mr-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
         >
           ← Back to Requests
         </button>
         <h2 className="text-2xl font-bold dark:text-white">Request {selectedRequest.id}</h2>
       </div>
       
       <div className="space-x-2">
         {!selectedRequest.dateCompleted && (
           <select 
             value={selectedRequest.status}
             onChange={onStatusChange}
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
             onClick={onCompleteRequest}
             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
           >
             Mark as Completed
           </button>
         )}
         
         <button 
           onClick={onEditRequest}
           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
         >
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

     {/* Edit Request Modal */}
     {showEditModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
           <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
             <h3 className="text-lg font-medium dark:text-white">Edit Request</h3>
             <button 
               onClick={() => setShowEditModal(false)}
               className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
             >
               <X size={20} />
             </button>
           </div>
           
           <div className="p-6">
             <div className="grid grid-cols-2 gap-4 mb-6">
               {/* Basic Info */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Requester Name
                 </label>
                 <input 
                   type="text"
                   name="requesterName"
                   value={editData.requesterName || ''}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Job/Location
                 </label>
                 <input 
                   type="text"
                   name="jobLocation"
                   value={editData.jobLocation || ''}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 />
               </div>
               
               <div className="col-span-2">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Issue Description
                 </label>
                 <textarea
                   name="description"
                   value={editData.description || ''}
                   onChange={handleEditChange}
                   rows={3}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 ></textarea>
               </div>
               
               {/* Shop Crew Info */}
               <div className="col-span-2 border-t dark:border-gray-700 pt-4 mt-2">
                 <h4 className="font-medium mb-2 dark:text-white">Shop Crew Information</h4>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Parts/Service Required
                 </label>
                 <input 
                   type="text"
                   name="partsRequired"
                   value={editData.partsRequired || ''}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Date Parts Ordered
                 </label>
                 <input 
                   type="date"
                   name="dateOrdered"
                   value={editData.dateOrdered || ''}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Parts Vendor
                 </label>
                 <input 
                   type="text"
                   name="partsVendor"
                   value={editData.partsVendor || ''}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Expected Arrival
                 </label>
                 <input 
                   type="date"
                   name="expectedArrival"
                   value={editData.expectedArrival || ''}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Assigned Technician
                 </label>
                 <input 
                   type="text"
                   name="assignedTech"
                   value={editData.assignedTech || ''}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Status
                 </label>
                 <select 
                   name="status"
                   value={editData.status || 'New'}
                   onChange={handleEditChange}
                   className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                 >
                   <option value="New">New</option>
                   <option value="In Progress">In Progress</option>
                   <option value="Awaiting Parts">Awaiting Parts</option>
                   <option value="Completed">Completed</option>
                 </select>
               </div>
             </div>
             
             <div className="flex justify-end space-x-3">
               <button 
                 onClick={() => setShowEditModal(false)}
                 className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
               >
                 Cancel
               </button>
               <button 
                 onClick={saveEditedRequest}
                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
               >
                 Save Changes
               </button>
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default RequestDetails;