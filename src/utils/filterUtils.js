// Utility functions for filtering data

// Filter requests by division
export const filterByDivision = (requests, division) => {
  if (!division || division === 'All') return requests;
  return requests.filter(req => req.division === division);
};

// Filter requests by status
export const filterByStatus = (requests, status) => {
  if (!status || status === 'All') return requests;
  return requests.filter(req => req.status === status);
};

// Filter requests by date range
export const filterByDateRange = (requests, startDate, endDate) => {
  if (!startDate || !endDate) return requests;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return requests.filter(req => {
    const reqDate = new Date(req.dateRequested);
    return reqDate >= start && reqDate <= end;
  });
};

// Filter requests by completion status
export const filterByCompletion = (requests, isCompleted) => {
  if (isCompleted === null || isCompleted === undefined) return requests;
  
  return requests.filter(req => {
    const hasCompletionDate = !!req.dateCompleted;
    return isCompleted ? hasCompletionDate : !hasCompletionDate;
  });
};

// Search requests by text
export const searchRequests = (requests, searchTerm) => {
  if (!searchTerm) return requests;
  
  const term = searchTerm.toLowerCase();
  
  return requests.filter(req => 
    req.id.toLowerCase().includes(term) ||
    req.requesterName.toLowerCase().includes(term) ||
    req.equipmentName.toLowerCase().includes(term) ||
    req.description.toLowerCase().includes(term) ||
    (req.jobLocation && req.jobLocation.toLowerCase().includes(term))
  );
};

// Filter equipment by division
export const filterEquipmentByDivision = (equipment, division) => {
  if (!division || division === 'All') return equipment;
  return equipment.filter(item => item.division === division);
};

// Search equipment by text
export const searchEquipment = (equipment, searchTerm) => {
  if (!searchTerm) return equipment;
  
  const term = searchTerm.toLowerCase();
  
  return equipment.filter(item => 
    item.id.toLowerCase().includes(term) ||
    item.name.toLowerCase().includes(term) ||
    item.make.toLowerCase().includes(term) ||
    item.model.toLowerCase().includes(term) ||
    item.vin.toLowerCase().includes(term)
  );
};

export default {
  filterByDivision,
  filterByStatus,
  filterByDateRange,
  filterByCompletion,
  searchRequests,
  filterEquipmentByDivision,
  searchEquipment
};