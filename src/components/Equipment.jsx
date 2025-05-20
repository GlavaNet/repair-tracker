// src/components/Equipment.jsx
import React, { useContext, useState } from 'react';
import { Filter } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import NewEquipmentModal from './NewEquipmentModal';
import EquipmentDetailsModal from './EquipmentDetailsModal';

const Equipment = () => {
  const { equipment, divisions } = useContext(AppContext);
  const [filterDivision, setFilterDivision] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  // State for new equipment modal
  const [showNewEquipmentModal, setShowNewEquipmentModal] = useState(false);

  // Filter equipment based on filters
  const filteredEquipment = equipment.filter(item => {
    const divisionMatch = filterDivision === 'All' || item.division === filterDivision;
    const searchMatch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return divisionMatch && searchMatch;
  });

  // Show equipment details
  const showEquipmentDetails = (equipmentId) => {
    const item = equipment.find(eq => eq.id === equipmentId);
    setSelectedEquipment(item);
  };

  return (
    <div className="p-6 dark:bg-gray-800">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Equipment Database</h2>
        <button 
          onClick={() => setShowNewEquipmentModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Equipment
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <Filter size={20} className="text-gray-400 dark:text-gray-300 mr-2" />
          <span className="text-sm font-medium mr-2 dark:text-white">Filters:</span>
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
          
          <input 
            type="text" 
            placeholder="Search equipment..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 text-sm min-w-[200px] dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>
      
      {/* Equipment Table */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Make/Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                VIN
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {item.division}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {item.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {item.make} {item.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate dark:text-gray-300">
                    {item.vin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => showEquipmentDetails(item.id)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      View
                    </button>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No equipment found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modals */}
      {showNewEquipmentModal && (
        <NewEquipmentModal onClose={() => setShowNewEquipmentModal(false)} />
      )}
      
      {selectedEquipment && (
        <EquipmentDetailsModal 
          equipment={selectedEquipment} 
          onClose={() => setSelectedEquipment(null)}
        />
      )}
    </div>
  );
};

export default Equipment;