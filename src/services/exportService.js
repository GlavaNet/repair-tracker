// src/services/exportService.js
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {Object} options - Export options
 * @param {String} options.filename - Filename without extension
 * @param {Array} options.columns - Column definitions
 * @returns {Promise} - Promise resolving when export is complete
 */
export const exportToExcel = async (data, options = {}) => {
  try {
    const { 
      filename = 'export.xlsx',
      sheetName = 'Sheet1',
      columns = []
    } = options;
    
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    
    // If columns are provided, use them for headers
    if (columns.length > 0) {
      worksheet.columns = columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 20
      }));
      
      // Add data rows by column key
      const rows = data.map(item => {
        const row = {};
        columns.forEach(col => {
          row[col.key] = item[col.key];
        });
        return row;
      });
      worksheet.addRows(rows);
    } else {
      // If no columns specified, use all keys from the first data object
      if (data.length > 0) {
        const keys = Object.keys(data[0]);
        worksheet.columns = keys.map(key => ({
          header: key,
          key: key,
          width: 20
        }));
      }
      
      // Add rows directly
      worksheet.addRows(data);
    }
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    // Generate buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    // Create and click download link
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Excel export failed:', error);
    throw error;
  }
};

/**
 * Export data to PDF file
 * @param {Array} data - Array of objects to export
 * @param {Object} options - Export options
 * @param {String} options.filename - Filename without extension
 * @param {Array} options.columns - Column definitions
 * @param {String} options.title - Document title
 * @returns {Promise} - Promise resolving when export is complete
 */
export const exportToPDF = (data, options = {}) => {
  try {
    const {
      filename = 'export.pdf',
      title = 'Export Data',
      subtitle = `Generated on ${new Date().toLocaleDateString()}`,
      columns = []
    } = options;
    
    // Initialize PDF document (landscape or portrait based on columns)
    const orientation = columns.length > 5 ? 'landscape' : 'portrait';
    const doc = new jsPDF({ orientation });
    
    // Add title and subtitle
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(subtitle, 14, 30);
    
    // Prepare column headers and data for autotable
    let headers = [];
    let tableData = [];
    
    if (columns.length > 0) {
      // Use provided column definitions
      headers = columns.map(col => col.header);
      tableData = data.map(item => 
        columns.map(col => {
          const value = item[col.key];
          return value === null || value === undefined ? '' : String(value);
        })
      );
    } else if (data.length > 0) {
      // Use all keys from the first data object
      headers = Object.keys(data[0]);
      tableData = data.map(item => 
        headers.map(key => {
          const value = item[key];
          return value === null || value === undefined ? '' : String(value);
        })
      );
    }
    
    // Create table
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 }
    });
    
    // Save PDF
    doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

/**
 * Export repair requests to Excel
 * @param {Array} requests - Array of request objects
 * @param {Object} filters - Active filters for naming
 */
export const exportRequestsToExcel = (requests, filters = {}) => {
  // Define columns for Excel export
  const columns = [
    { header: 'Request ID', key: 'id', width: 15 },
    { header: 'Division', key: 'division', width: 15 },
    { header: 'Requester', key: 'requesterName', width: 20 },
    { header: 'Date Requested', key: 'dateRequested', width: 15 },
    { header: 'Location', key: 'jobLocation', width: 20 },
    { header: 'Equipment', key: 'equipmentName', width: 20 },
    { header: 'Equipment ID', key: 'equipmentId', width: 15 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Parts Required', key: 'partsRequired', width: 20 },
    { header: 'Date Ordered', key: 'dateOrdered', width: 15 },
    { header: 'Parts Vendor', key: 'partsVendor', width: 20 },
    { header: 'Expected Arrival', key: 'expectedArrival', width: 15 },
    { header: 'Assigned Technician', key: 'assignedTech', width: 20 },
    { header: 'Date Completed', key: 'dateCompleted', width: 15 }
  ];
  
  // Generate filename based on filters
  let filename = 'repair_requests';
  if (filters.division && filters.division !== 'All') {
    filename += `_${filters.division.toLowerCase().replace(/\s+/g, '_')}`;
  }
  if (filters.status && filters.status !== 'All') {
    filename += `_${filters.status.toLowerCase().replace(/\s+/g, '_')}`;
  }
  if (filters.dateRange?.start && filters.dateRange?.end) {
    filename += `_${filters.dateRange.start}_to_${filters.dateRange.end}`;
  }
  
  // Export to Excel
  return exportToExcel(requests, {
    filename: `${filename}.xlsx`,
    sheetName: 'Repair Requests',
    columns
  });
};

/**
 * Export repair requests to PDF
 * @param {Array} requests - Array of request objects
 * @param {Object} filters - Active filters for naming
 */
export const exportRequestsToPDF = (requests, filters = {}) => {
  // Define columns for PDF export (fewer columns for readability)
  const columns = [
    { header: 'Request ID', key: 'id' },
    { header: 'Division', key: 'division' },
    { header: 'Equipment', key: 'equipmentName' },
    { header: 'Status', key: 'status' },
    { header: 'Requested', key: 'dateRequested' },
    { header: 'Completed', key: 'dateCompleted' }
  ];
  
  // Generate filename based on filters
  let filename = 'repair_requests';
  if (filters.division && filters.division !== 'All') {
    filename += `_${filters.division.toLowerCase().replace(/\s+/g, '_')}`;
  }
  if (filters.status && filters.status !== 'All') {
    filename += `_${filters.status.toLowerCase().replace(/\s+/g, '_')}`;
  }
  
  // Create title based on filters
  let title = 'Repair Requests Report';
  let filterDetails = [];
  
  if (filters.division && filters.division !== 'All') {
    filterDetails.push(`Division: ${filters.division}`);
  }
  if (filters.status && filters.status !== 'All') {
    filterDetails.push(`Status: ${filters.status}`);
  }
  if (filters.dateRange?.start && filters.dateRange?.end) {
    filterDetails.push(`Period: ${filters.dateRange.start} to ${filters.dateRange.end}`);
  }
  
  const subtitle = filterDetails.length > 0 
    ? `Generated on ${new Date().toLocaleDateString()} | ${filterDetails.join(' | ')}`
    : `Generated on ${new Date().toLocaleDateString()}`;
  
  // Export to PDF
  return exportToPDF(requests, {
    filename: `${filename}.pdf`,
    title,
    subtitle,
    columns
  });
};

/**
 * Export equipment list to Excel
 * @param {Array} equipment - Array of equipment objects
 * @param {Object} filters - Active filters for naming
 */
export const exportEquipmentToExcel = (equipment, filters = {}) => {
  // Define columns for Excel export
  const columns = [
    { header: 'Equipment ID', key: 'id', width: 15 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Division', key: 'division', width: 15 },
    { header: 'Year', key: 'year', width: 10 },
    { header: 'Make', key: 'make', width: 15 },
    { header: 'Model', key: 'model', width: 15 },
    { header: 'VIN', key: 'vin', width: 25 },
    { header: 'Parts Make', key: 'partsMake', width: 15 },
    { header: 'Parts Model', key: 'partsModel', width: 15 },
    { header: 'Parts VIN', key: 'partsVin', width: 25 }
  ];
  
  // Generate filename based on filters
  let filename = 'equipment_inventory';
  if (filters.division && filters.division !== 'All') {
    filename += `_${filters.division.toLowerCase().replace(/\s+/g, '_')}`;
  }
  
  // Export to Excel
  return exportToExcel(equipment, {
    filename: `${filename}.xlsx`,
    sheetName: 'Equipment Inventory',
    columns
  });
};

// Export all functions as a default object
export default {
  exportToExcel,
  exportToPDF,
  exportRequestsToExcel,
  exportRequestsToPDF,
  exportEquipmentToExcel
};