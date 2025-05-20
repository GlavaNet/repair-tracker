// Service for handling exports to Excel and PDF
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Export data to Excel
export const exportToExcel = (data, filename = 'export.xlsx') => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  
  // Add headers
  if (data.length > 0) {
    worksheet.columns = Object.keys(data[0]).map(key => ({
      header: key,
      key: key,
      width: 20
    }));
  }
  
  // Add rows
  worksheet.addRows(data);
  
  // Write to file
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
};

// Export data to PDF
export const exportToPDF = (data, columns, filename = 'export.pdf') => {
  // Initialize PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Repair Request Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Format data for autotable
  const tableRows = data.map(row => columns.map(col => row[col.key]));
  
  // Create table
  doc.autoTable({
    head: [columns.map(col => col.label)],
    body: tableRows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Save PDF
  doc.save(filename);
};

// Export repair requests to Excel
export const exportRequestsToExcel = (requests, filters = {}) => {
  // Format data for export
  const formattedData = requests.map(req => ({
    'Request ID': req.id,
    'Division': req.division,
    'Requester': req.requesterName,
    'Date Requested': req.dateRequested,
    'Location': req.jobLocation,
    'Equipment': req.equipmentName,
    'Equipment ID': req.equipmentId,
    'Description': req.description,
    'Status': req.status,
    'Parts Required': req.partsRequired || '',
    'Date Ordered': req.dateOrdered || '',
    'Parts Vendor': req.partsVendor || '',
    'Expected Arrival': req.expectedArrival || '',
    'Assigned Technician': req.assignedTech || '',
    'Date Completed': req.dateCompleted || ''
  }));
  
  // Generate filename based on filters
  let filename = 'repair_requests';
  if (filters.division && filters.division !== 'All') {
    filename += `_${filters.division.toLowerCase()}`;
  }
  if (filters.status && filters.status !== 'All') {
    filename += `_${filters.status.toLowerCase().replace(' ', '_')}`;
  }
  filename += '.xlsx';
  
  // Export to Excel
  exportToExcel(formattedData, filename);
};

// Export repair requests to PDF
export const exportRequestsToPDF = (requests, filters = {}) => {
  // Define columns for PDF table
  const columns = [
    { key: 'id', label: 'Request ID' },
    { key: 'division', label: 'Division' },
    { key: 'equipmentName', label: 'Equipment' },
    { key: 'status', label: 'Status' },
    { key: 'dateRequested', label: 'Requested' },
    { key: 'dateCompleted', label: 'Completed' }
  ];
  
  // Generate filename based on filters
  let filename = 'repair_requests';
  if (filters.division && filters.division !== 'All') {
    filename += `_${filters.division.toLowerCase()}`;
  }
  if (filters.status && filters.status !== 'All') {
    filename += `_${filters.status.toLowerCase().replace(' ', '_')}`;
  }
  filename += '.pdf';
  
  // Export to PDF
  exportToPDF(requests, columns, filename);
};

// Export equipment list to Excel
export const exportEquipmentToExcel = (equipment, filters = {}) => {
  // Format data for export
  const formattedData = equipment.map(item => ({
    'Equipment ID': item.id,
    'Name': item.name,
    'Division': item.division,
    'Year': item.year,
    'Make': item.make,
    'Model': item.model,
    'VIN': item.vin,
    'Parts Make': item.partsMake,
    'Parts Model': item.partsModel,
    'Parts VIN': item.partsVin
  }));
  
  // Generate filename
  let filename = 'equipment_inventory';
  if (filters.division && filters.division !== 'All') {
    filename += `_${filters.division.toLowerCase()}`;
  }
  filename += '.xlsx';
  
  // Export to Excel
  exportToExcel(formattedData, filename);
};

export default {
  exportToExcel,
  exportToPDF,
  exportRequestsToExcel,
  exportRequestsToPDF,
  exportEquipmentToExcel
};