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
// Modified version for exportToPDF function
export const exportToPDF = (data, options = {}) => {
  try {
    const {
      filename = 'export.pdf',
      title = 'Export Data',
      subtitle = `Generated on ${new Date().toLocaleDateString()}`,
      columns = []
    } = options;
    
    // Create document
    const doc = new jsPDF(columns.length > 5 ? 'landscape' : 'portrait');
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(subtitle, 14, 30);
    
    // Prepare headers and data
    let headers = [];
    let tableData = [];
    
    if (columns.length > 0) {
      headers = columns.map(col => col.header);
      tableData = data.map(item => 
        columns.map(col => item[col.key] || '')
      );
    } else if (data.length > 0) {
      headers = Object.keys(data[0]);
      tableData = data.map(item => 
        headers.map(key => item[key] || '')
      );
    }
    
    // Direct implementation without relying on the plugin's autoTable
    const startY = 35;
    const cellPadding = 5;
    const rowHeight = 10;
    let currentY = startY;
    
    // Draw header
    doc.setFillColor(66, 139, 202);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    
    let startX = 14;
    const colWidth = ((doc.internal.pageSize.width - 28) / headers.length);
    
    // Draw header cells
    headers.forEach((header, i) => {
      doc.rect(startX, currentY, colWidth, rowHeight, 'F');
      doc.text(header, startX + cellPadding, currentY + rowHeight - cellPadding);
      startX += colWidth;
    });
    
    currentY += rowHeight;
    
    // Draw data rows
    doc.setTextColor(0, 0, 0);
    tableData.forEach((row, rowIndex) => {
      startX = 14;
      
      // Set alternate row background
      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      
      // Draw row cells
      row.forEach((cell, i) => {
        doc.rect(startX, currentY, colWidth, rowHeight, 'F');
        doc.text(String(cell), startX + cellPadding, currentY + rowHeight - cellPadding);
        startX += colWidth;
      });
      
      currentY += rowHeight;
      
      // Add new page if needed
      if (currentY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 20;
      }
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
  try {
    // Generate filename based on filters
    let filename = 'repair_requests';
    if (filters.division && filters.division !== 'All') {
      filename += `_${filters.division.toLowerCase().replace(/\s+/g, '_')}`;
    }
    if (filters.status && filters.status !== 'All') {
      filename += `_${filters.status.toLowerCase().replace(/\s+/g, '_')}`;
    }
    
    // Create PDF document - use landscape for more space
    const doc = new jsPDF('landscape');
    
    // Add title
    doc.setFontSize(18);
    doc.text('Repair Requests Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Define table properties
    const headers = ['Request ID', 'Division', 'Equipment', 'Status', 'Requested', 'Completed'];
    const colWidths = [35, 35, 50, 30, 30, 30]; // Different widths for columns
    const rowHeight = 10;
    let y = 40;
    
    // Calculate column start positions
    const colStarts = [];
    let xPos = 14;
    colWidths.forEach(width => {
      colStarts.push(xPos);
      xPos += width;
    });
    
    // Draw table grid
    doc.setDrawColor(0); // Black borders
    doc.setLineWidth(0.1);
    
    // Draw header background
    doc.setFillColor(66, 139, 202);
    doc.rect(colStarts[0], y, xPos - colStarts[0], rowHeight, 'F');
    
    // Draw header text
    doc.setTextColor(255, 255, 255);
    headers.forEach((header, i) => {
      doc.text(header, colStarts[i] + 3, y + 7);
    });
    
    // Draw borders for header
    doc.setDrawColor(0);
    doc.line(colStarts[0], y, xPos, y); // Top horizontal
    doc.line(colStarts[0], y + rowHeight, xPos, y + rowHeight); // Bottom horizontal
    colStarts.forEach(x => {
      doc.line(x, y, x, y + rowHeight); // Vertical lines
    });
    doc.line(xPos, y, xPos, y + rowHeight); // Last vertical line
    
    // Reset text color for rows
    doc.setTextColor(0);
    
    // Draw rows
    requests.forEach((request, index) => {
      y += rowHeight;
      
      // Add new page if needed
      if (y > doc.internal.pageSize.height - 20) {
        doc.addPage('landscape');
        y = 20;
      }
      
      // Set alternating row background
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      
      // Draw row background
      doc.rect(colStarts[0], y, xPos - colStarts[0], rowHeight, 'F');
      
      // Draw row data
      const rowData = [
        request.id,
        request.division,
        request.equipmentName,
        request.status,
        request.dateRequested,
        request.dateCompleted || '-'
      ];
      
      rowData.forEach((text, i) => {
        // Truncate text if necessary
        let cellText = String(text);
        const maxChars = Math.floor(colWidths[i] / 2);
        if (cellText.length > maxChars) {
          cellText = cellText.substring(0, maxChars - 3) + '...';
        }
        
        doc.text(cellText, colStarts[i] + 3, y + 7);
      });
      
      // Draw cell borders
      doc.line(colStarts[0], y + rowHeight, xPos, y + rowHeight); // Bottom horizontal
      colStarts.forEach(x => {
        doc.line(x, y, x, y + rowHeight); // Vertical lines
      });
      doc.line(xPos, y, xPos, y + rowHeight); // Last vertical line
    });
    
    // Save PDF
    doc.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
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