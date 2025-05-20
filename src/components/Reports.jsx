import React, { useContext, useState } from 'react';
import { FileText, File } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';

const Reports = () => {
  const { requests, divisions } = useContext(AppContext);
  
  const [reportType, setReportType] = useState('all');
  const [reportDivision, setReportDivision] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Export to Excel
  const exportToExcel = () => {
    // In a real implementation, this would use the xlsx library
    // to generate and download an Excel file
    alert('Excel export would be generated here');
  };

  // Export to PDF
  const exportToPDF = () => {
    // In a real implementation, this would use jspdf and jspdf-autotable
    // to generate and download a PDF file
    alert('PDF export would be generated here');
  };

  // Generate report based on filters
  const generateReport = () => {
    // Filter requests based on report parameters
    let filteredRequests = [...requests];
    
    // Filter by type
    if (reportType === 'open') {
      filteredRequests = filteredRequests.filter(req => req.dateCompleted === null);
    } else if (reportType === 'completed') {
      filteredRequests = filteredRequests.filter(req => req.dateCompleted !== null);
    } else if (reportType === 'awaiting') {
      filteredRequests = filteredRequests.filter(req => req.status === 'Awaiting Parts');
    }
    
    // Filter by division
    if (reportDivision !== 'All') {
      filteredRequests = filteredRequests.filter(req => req.division === reportDivision);
    }
    
    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      filteredRequests = filteredRequests.filter(req => {
        const requestDate = new Date(req.dateRequested);
        return requestDate >= startDate && requestDate <= endDate;
      });
    }
    
    return filteredRequests;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reports & Exports</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">Generate Report</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="all">All Repair Requests</option>
              <option value="open">Open Requests</option>
              <option value="completed">Completed Requests</option>
              <option value="awaiting">Awaiting Parts</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select 
              value={reportDivision}
              onChange={(e) => setReportDivision(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="All">All Divisions</option>
              {divisions.map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full border rounded p-2" 
              />
              <span className="flex items-center">to</span>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full border rounded p-2" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={exportToExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FileText size={18} className="mr-2" /> Export to Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded flex items-center"
          >
            <File size={18} className="mr-2" /> Export to PDF
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium mb-4">Report Preview</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generateReport().map(request => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.division}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.equipmentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'Awaiting Parts' ? 'bg-yellow-100 text-yellow-800' : 
                      request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.dateRequested}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.dateCompleted || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;