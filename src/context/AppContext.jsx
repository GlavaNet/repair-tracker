import { createContext } from 'react';

// Create context with default empty values
export const AppContext = createContext({
  requests: [],
  setRequests: () => {},
  equipment: [],
  setEquipment: () => {},
  divisions: [],
  selectedRequest: null,
  setSelectedRequest: () => {},
  filterDivision: 'All',
  setFilterDivision: () => {},
  filterStatus: 'All',
  setFilterStatus: () => {},
  handleRequestClick: () => {},
  handleStatusChange: () => {},
  handleCompleteRequest: () => {},
  user: null
});