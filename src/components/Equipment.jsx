import React, { useContext, useState } from 'react';
import { Filter } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Equipment = () => {
  const { equipment, divisions } = useContext(AppContext);
  const [filterDivision, setFilterDivision] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);

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
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Equipment Database</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Equipment
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <Filter size={20} className="text-gray-400 mr-2" />
          <span className="text-sm font-medium mr-2">Filters:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <select 
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="border rounded p-2 text-sm"
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
            className="border rounded p-2 text-sm min-w-[200px]"
          />
        </div>
      </div>
      
      {/* Equipment Details Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{selectedEquipment.name}</h3>
                <button 
                  onClick={() => setSelectedEquipment(null)}
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
                  <p>{selectedEquipment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Division</p>
                  <p>{selectedEquipment.division}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Year</p>
                  <p>{selectedEquipment.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Make</p>
                  <p>{selectedEquipment.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Model</p>
                  <p>{selectedEquipment.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">VIN</p>
                  <p>{selectedEquipment.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Parts Make</p>
                  <p>{selectedEquipment.partsMake}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Parts Model</p>
                  <p>{selectedEquipment.partsModel}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Parts VIN</p>
                  <p>{selectedEquipment.partsVin}</p>
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
      )}
      
      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Make/Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VIN
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.division}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.make} {item.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate">
                    {item.vin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => showEquipmentDetails(item.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No equipment found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Equipment;