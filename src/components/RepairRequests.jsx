// src/components/RepairRequests.jsx
import React, { useContext, useState } from 'react';
import { Filter, Calendar } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import NewRequestModal from './NewRequestModal'; // Import the new component

const RepairRequests = () => {
 const { 
   requests, 
   divisions, 
   filterDivision, 
   setFilterDivision, 
   filterStatus, 
   setFilterStatus, 
   handleRequestClick,
   handleCompleteRequest
 } = useContext(AppContext);

 // State for search and date filters
 const [searchTerm, setSearchTerm] = useState('');
 const [dateRange, setDateRange] = useState({ start: '', end: '' });
 
 // State for new request modal
 const [showNewRequestModal, setShowNewRequestModal] = useState(false);

 // Generate new request ID
 const generateRequestId = () => {
   const year = new Date().getFullYear();
   const latestIdNum = Math.max(...requests.map(req => 
     parseInt(req.id.split('-')[2] || 0)
   ));
   return `REQ-${year}-${String(latestIdNum + 1).padStart(3, '0')}`;
 };

 // Filter requests based on filters
 const filteredRequests = requests.filter(req => {
   const divisionMatch = filterDivision === 'All' || req.division === filterDivision;
   const statusMatch = filterStatus === 'All' || req.status === filterStatus;
   const searchMatch = searchTerm === '' || 
     req.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     req.id.toLowerCase().includes(searchTerm.toLowerCase());
   
   // Date filtering
   let dateMatch = true;
   if (dateRange.start && dateRange.end) {
     const reqDate = new Date(req.dateRequested);
     const startDate = new Date(dateRange.start);
     const endDate = new Date(dateRange.end);
     dateMatch = reqDate >= startDate && reqDate <= endDate;
   }
   
   return divisionMatch && statusMatch && searchMatch && dateMatch;
 });

 return (
   <div className="p-6 dark:bg-gray-800 dark:text-white">
     <div className="flex justify-between mb-6">
       <h2 className="text-2xl font-bold">Repair Requests</h2>
       <button 
         onClick={() => setShowNewRequestModal(true)}
         className="bg-blue-600 text-white px-4 py-2 rounded"
       >
         + New Request
       </button>
     </div>
     
     {/* Filters */}
     <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-6">
       <div className="flex flex-wrap items-center gap-4">
         <div className="flex items-center">
           <Filter size={20} className="text-gray-400 dark:text-gray-300 mr-2" />
           <span className="text-sm font-medium">Filters:</span>
         </div>
         
         <div className="flex flex-wrap items-center gap-4">
           <select 
             value={filterDivision}
             onChange={(e) => setFilterDivision(e.target.value)}
             className="border rounded p-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
           >
             <option value="All">All Divisions</option>
             {divisions.map(division => (
               <option key={division} value={division}>{division}</option>
             ))}
           </select>
           
           <select 
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)}
             className="border rounded p-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
           >
             <option value="All">All Statuses</option>
             <option value="New">New</option>
             <option value="In Progress">In Progress</option>
             <option value="Awaiting Parts">Awaiting Parts</option>
             <option value="Completed">Completed</option>
           </select>
           
           <div className="flex items-center gap-2">
             <Calendar size={18} className="text-gray-400 dark:text-gray-300" />
             <input 
               type="date" 
               placeholder="Start Date"
               value={dateRange.start}
               onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
               className="border rounded p-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
             />
             <span>to</span>
             <input 
               type="date" 
               placeholder="End Date"
               value={dateRange.end}
               onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
               className="border rounded p-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
             />
           </div>
           
           <input 
             type="text" 
             placeholder="Search requests..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="border rounded p-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
           />
         </div>
       </div>
     </div>
     
     {/* Requests Table */}
     <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
         <thead className="bg-gray-50 dark:bg-gray-800">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Request ID
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Division
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Equipment
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Issue
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Requested
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Status
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Assigned To
             </th>
             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               Actions
             </th>
           </tr>
         </thead>
         <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
           {filteredRequests.length > 0 ? (
             filteredRequests.map(request => (
               <tr key={request.id} onClick={() => handleRequestClick(request.id)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                   {request.id}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                   {request.division}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                   {request.equipmentName}
                 </td>
                 <td className="px-6 py-4 text-sm max-w-xs truncate dark:text-gray-300">
                   {request.description}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                   {request.dateRequested}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 py-1 rounded-full text-xs ${
                     request.status === 'Awaiting Parts' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                     request.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                     request.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                     'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                   }`}>
                     {request.status}
                   </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                   {request.assignedTech || '-'}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       handleRequestClick(request.id);
                     }}
                     className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                   >
                     View
                   </button>
                   {!request.dateCompleted && (
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         handleCompleteRequest(request.id);
                       }}
                       className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                     >
                       Complete
                     </button>
                   )}
                 </td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                 No repair requests found matching your filters.
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
     
     {/* New Request Modal */}
     {showNewRequestModal && (
       <NewRequestModal onClose={() => setShowNewRequestModal(false)} />
     )}
   </div>
 );
};

export default RepairRequests;