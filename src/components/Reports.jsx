// src/components/Reports.jsx
import React, { useContext, useState } from 'react';
import { FileText, File } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { 
  exportRequestsToExcel, 
  exportRequestsToPDF, 
  exportEquipmentToExcel 
} from '../services/exportService';

const Reports = () => {
  const { requests, equipment, divisions } = useContext(AppContext);
  
  const [reportType, setReportType] = useState('all');
  const [reportDivision, setReportDivision] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

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
    } else if (reportType === 'equipment') {
      // Special case for equipment report - return empty array for requests
      return [];
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
  
  // Get equipment for equipment report
  const getFilteredEquipment = () => {
    if (reportType !== 'equipment') {
      return [];
    }
    
    let filteredEquipment = [...equipment];
    
    // Filter by division
    if (reportDivision !== 'All') {
      filteredEquipment = filteredEquipment.filter(item => item.division === reportDivision);
    }
    
    return filteredEquipment;
  };

  // Handle excel export
  const handleExcelExport = async () => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      if (reportType === 'equipment') {
        // Export equipment to Excel
        const filteredEquipment = getFilteredEquipment();
        await exportEquipmentToExcel(filteredEquipment, {
          division: reportDivision
        });
      } else {
        // Export requests to Excel
        const filteredRequests = generateReport();
        await exportRequestsToExcel(filteredRequests, {
          division: reportDivision,
          status: reportType !== 'all' ? reportType : 'All',
          dateRange: dateRange.start && dateRange.end ? dateRange : null
        });
      }
    } catch (error) {
      console.error('Export to Excel failed:', error);
      setExportError('Failed to export to Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle PDF export
  const handlePDFExport = async () => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      if (reportType === 'equipment') {
        // Equipment doesn't have PDF export in this version
        setExportError('PDF export for equipment is not available yet.');
        return;
      }
      
      // Export requests to PDF
      const filteredRequests = generateReport();
      await exportRequestsToPDF(filteredRequests, {
        division: reportDivision,
        status: reportType !== 'all' ? reportType : 'All',
        dateRange: dateRange.start && dateRange.end ? dateRange : null
      });
    } catch (error) {
      console.error('Export to PDF failed:', error);
      setExportError('Failed to export to PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Get preview data based on report type
  const getPreviewData = () => {
    if (reportType === 'equipment') {
      return getFilteredEquipment();
    } else {
      return generateReport();
    }
  };

  return (
    <div className="p-6 dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Reports & Exports</h2>
      
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">Generate Report</h3>
        
        {exportError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 rounded">
            {exportError}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Report Type
            </label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              disabled={isExporting}
            >
              <option value="all">All Repair Requests</option>
              <option value="open">Open Requests</option>
              <option value="completed">Completed Requests</option>
              <option value="awaiting">Awaiting Parts</option>
              <option value="equipment">Equipment Inventory</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Division
            </label>
            <select 
              value={reportDivision}
              onChange={(e) => setReportDivision(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              disabled={isExporting}
            >
              <option value="All">All Divisions</option>
              {divisions.map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>
          
          <div className={reportType === 'equipment' ? 'hidden' : ''}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                disabled={isExporting || reportType === 'equipment'}
              />
              <span className="flex items-center dark:text-white">to</span>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                disabled={isExporting || reportType === 'equipment'}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExcelExport}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            disabled={isExporting}
          >
            <FileText size={18} className="mr-2" /> 
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
          <button 
            onClick={handlePDFExport}
            className={`bg-red-600 text-white px-4 py-2 rounded flex items-center ${
              reportType === 'equipment' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isExporting || reportType === 'equipment'}
            title={reportType === 'equipment' ? 'PDF export not available for equipment' : ''}
          >
            <File size={18} className="mr-2" /> 
            {isExporting ? 'Exporting...' : 'Export to PDF'}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
        <h3 className="font-medium mb-4 dark:text-white">Report Preview</h3>
        
        <div className="overflow-x-auto">
          {reportType === 'equipment' ? (
            // Equipment preview table
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Equipment ID
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
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {getFilteredEquipment().map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {item.division}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {item.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {item.make} {item.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {item.vin}
                    </td>
                  </tr>
                ))}
                {getFilteredEquipment().length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No equipment found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // Requests preview table
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {generateReport().map(request => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {request.division}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {request.equipmentName}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {request.dateRequested}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">
                      {request.dateCompleted || '-'}
                    </td>
                  </tr>
                ))}
                {generateReport().length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No requests found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;