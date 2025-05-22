// src/components/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  loadRequests, saveRequest, loadEquipment, 
  saveEquipment, loadDivisions, saveDivisions 
} from '../services/firebaseService';
// ...other imports remain the same

const App = () => {
  // State definitions remain the same...
  
  // Load data and check authentication on mount
  useEffect(() => {
    // For debugging - log if environment variables are present
    console.log('Environment variables check:', {
      clientId: Boolean(import.meta.env.VITE_MSAL_CLIENT_ID),
      tenantId: Boolean(import.meta.env.VITE_MSAL_TENANT_ID),
    });
    
    // Load data from Firebase
    loadDataFromFirebase();
    
    // Check for existing auth
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      setUser({
        name: accounts[0].name,
        email: accounts[0].username,
        role: 'user' // Role would be determined from claims in a real app
      });
      setIsAuthenticated(true);
      setIsKioskMode(false); // Exit kiosk mode when authenticated
    }
    
    setIsLoading(false);
  }, []);

  // Load data from Firebase
  const loadDataFromFirebase = async () => {
    try {
      setIsLoading(true);
      
      // Load divisions first
      const divisionsData = await loadDivisions();
      if (divisionsData && divisionsData.length > 0) {
        // Use loaded divisions
        setDivisions(divisionsData);
      } else {
        // Use initial divisions and save them to Firebase
        await saveDivisions(divisions);
      }
      
      // Load requests
      const requestsData = await loadRequests();
      if (requestsData && requestsData.length > 0) {
        setRequests(requestsData);
      } else {
        // If no requests are found, save the initial requests
        for (const request of initialRequests) {
          await saveRequest(request);
        }
        setRequests(initialRequests);
      }
      
      // Load equipment
      const equipmentData = await loadEquipment();
      if (equipmentData && equipmentData.length > 0) {
        setEquipment(equipmentData);
      } else {
        // If no equipment is found, save the initial equipment
        for (const item of initialEquipment) {
          await saveEquipment(item);
        }
        setEquipment(initialEquipment);
      }
    } catch (error) {
      console.error("Error loading data from Firebase:", error);
      // Fallback to local data
      setRequests(initialRequests);
      setEquipment(initialEquipment);
    } finally {
      setIsLoading(false);
    }
  };

  // Save requests to Firebase when they change
  useEffect(() => {
    const saveRequestsToFirebase = async () => {
      if (requests.length > 0 && !isLoading) {
        try {
          for (const request of requests) {
            if (!request.docId || request.isModified) {
              const updatedRequest = { ...request, isModified: false };
              await saveRequest(updatedRequest);
            }
          }
        } catch (error) {
          console.error("Error saving requests to Firebase:", error);
        }
      }
    };
    
    saveRequestsToFirebase();
  }, [requests]);
  
  // Save equipment to Firebase when it changes
  useEffect(() => {
    const saveEquipmentToFirebase = async () => {
      if (equipment.length > 0 && !isLoading) {
        try {
          for (const item of equipment) {
            if (!item.docId || item.isModified) {
              const updatedItem = { ...item, isModified: false };
              await saveEquipment(updatedItem);
            }
          }
        } catch (error) {
          console.error("Error saving equipment to Firebase:", error);
        }
      }
    };
    
    saveEquipmentToFirebase();
  }, [equipment]);
  
  // Save divisions to Firebase when they change
  useEffect(() => {
    const saveDivisionsToFirebase = async () => {
      if (!isLoading) {
        try {
          await saveDivisions(divisions);
        } catch (error) {
          console.error("Error saving divisions to Firebase:", error);
        }
      }
    };
    
    saveDivisionsToFirebase();
  }, [divisions]);

  // Rest of your App component remains the same...
};

export default App;