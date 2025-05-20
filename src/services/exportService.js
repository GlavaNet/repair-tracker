// Service for handling exports to Excel and PDF
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Export data to Excel
export const exportToExcel = (data, filename = 'export.xlsx') => {
  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
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