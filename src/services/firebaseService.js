// src/services/firebaseService.js
import { initializeApp } from "firebase/app";
import { getFirestore, 
 collection, addDoc, getDocs, updateDoc, doc, 
 deleteDoc, query, where, setDoc, serverTimestamp,
 writeBatch, onSnapshot, enableIndexedDbPersistence,
 getDoc
} from "firebase/firestore";
import { getAuth, 
 signInWithPopup, OAuthProvider, 
 signOut as firebaseSignOut, 
 onAuthStateChanged 
} from "firebase/auth";

// Your web app's Firebase configuration - use environment variables
const firebaseConfig = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
 projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
 storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
 messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
 appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline data persistence
try {
 enableIndexedDbPersistence(db)
   .then(() => {
     console.log("Offline persistence enabled");
   })
   .catch((err) => {
     if (err.code === 'failed-precondition') {
       console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
     } else if (err.code === 'unimplemented') {
       console.warn("The current browser does not support offline persistence.");
     }
   });
} catch (err) {
 console.error("Firebase persistence error:", err);
}

// =====================
// Auth Functions
// =====================

// Set up Microsoft provider for OAuth
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
 tenant: import.meta.env.VITE_MSAL_TENANT_ID,
 // Optional: specify which Microsoft Graph scopes to request
 scopes: ['user.read']
});

// Microsoft login function
export const signInWithMicrosoft = async () => {
 try {
   const result = await signInWithPopup(auth, microsoftProvider);
   console.log("Authentication successful", result.user);
   return {
     user: result.user,
     idToken: await result.user.getIdToken(),
     // This credential can be used to get access tokens from Microsoft Graph
     microsoftCredential: OAuthProvider.credentialFromResult(result)
   };
 } catch (error) {
   console.error("Authentication error:", error);
   throw error;
 }
};

// Sign out function
export const signUserOut = async () => {
 try {
   await firebaseSignOut(auth);
   console.log("Signed out successfully");
   return true;
 } catch (error) {
   console.error("Sign out error:", error);
   throw error;
 }
};

// Get current user
export const getCurrentUser = () => {
 return auth.currentUser;
};

// Subscribe to auth state changes (for use in components)
export const onAuthStateChange = (callback) => {
 return onAuthStateChanged(auth, callback);
};

// =====================
// Requests Collection Operations
// =====================

export const requestsCollection = collection(db, "requests");

// Create or update a request
export const saveRequest = async (request) => {
 try {
   // If it's a new request (no document ID from Firestore)
   if (!request.docId) {
     // Add timestamp fields
     const docWithTimestamps = {
       ...request,
       createdAt: serverTimestamp(),
       updatedAt: serverTimestamp()
     };
     
     // Remove isModified flag if it exists
     if (docWithTimestamps.isModified) {
       delete docWithTimestamps.isModified;
     }
     
     const docRef = await addDoc(requestsCollection, docWithTimestamps);
     console.log("Request created with ID:", docRef.id);
     return { ...request, docId: docRef.id };
   } else {
     // Update existing request
     const docRef = doc(db, "requests", request.docId);
     
     // Prepare update data
     const updateData = { ...request, updatedAt: serverTimestamp() };
     
     // Remove the docId and isModified flag from the data to update
     delete updateData.docId;
     if (updateData.isModified) {
       delete updateData.isModified;
     }
     
     await updateDoc(docRef, updateData);
     console.log("Request updated:", request.docId);
     return request;
   }
 } catch (error) {
   console.error("Error saving request:", error);
   throw error;
 }
};

// Load all requests
export const loadRequests = async () => {
 try {
   const snapshot = await getDocs(requestsCollection);
   console.log(`Loaded ${snapshot.docs.length} requests`);
   return snapshot.docs.map(doc => ({
     ...doc.data(),
     docId: doc.id  // Store the Firestore document ID
   }));
 } catch (error) {
   console.error("Error loading requests:", error);
   throw error;
 }
};

// Listen for real-time updates to requests
export const subscribeToRequests = (callback) => {
 return onSnapshot(requestsCollection, (snapshot) => {
   const requests = snapshot.docs.map(doc => ({
     ...doc.data(),
     docId: doc.id
   }));
   callback(requests);
 }, (error) => {
   console.error("Error subscribing to requests:", error);
 });
};

// Delete a request
export const deleteRequest = async (docId) => {
 try {
   await deleteDoc(doc(db, "requests", docId));
   console.log("Request deleted:", docId);
   return true;
 } catch (error) {
   console.error("Error deleting request:", error);
   throw error;
 }
};

// Query requests by division
export const getRequestsByDivision = async (division) => {
 try {
   const q = query(requestsCollection, where("division", "==", division));
   const snapshot = await getDocs(q);
   return snapshot.docs.map(doc => ({
     ...doc.data(),
     docId: doc.id
   }));
 } catch (error) {
   console.error("Error querying requests by division:", error);
   throw error;
 }
};

// Query requests by status
export const getRequestsByStatus = async (status) => {
 try {
   const q = query(requestsCollection, where("status", "==", status));
   const snapshot = await getDocs(q);
   return snapshot.docs.map(doc => ({
     ...doc.data(),
     docId: doc.id
   }));
 } catch (error) {
   console.error("Error querying requests by status:", error);
   throw error;
 }
};

// Batch save multiple requests
export const batchSaveRequests = async (requests) => {
 try {
   const batch = writeBatch(db);
   
   for (const request of requests) {
     // For new requests without a docId
     if (!request.docId) {
       const newDocRef = doc(requestsCollection);
       const docData = { 
         ...request, 
         createdAt: serverTimestamp(), 
         updatedAt: serverTimestamp() 
       };
       if (docData.isModified) delete docData.isModified;
       
       batch.set(newDocRef, docData);
     } 
     // For existing requests with a docId
     else {
       const docRef = doc(db, "requests", request.docId);
       const updateData = { ...request, updatedAt: serverTimestamp() };
       delete updateData.docId;
       if (updateData.isModified) delete updateData.isModified;
       
       batch.update(docRef, updateData);
     }
   }
   
   await batch.commit();
   console.log(`Batch processed ${requests.length} requests`);
   return true;
 } catch (error) {
   console.error("Error batch saving requests:", error);
   throw error;
 }
};

// =====================
// Equipment Collection Operations
// =====================

export const equipmentCollection = collection(db, "equipment");

// Create or update equipment
export const saveEquipment = async (equipment) => {
 try {
   // If it's a new equipment item (no document ID from Firestore)
   if (!equipment.docId) {
     // Add timestamp fields
     const docWithTimestamps = {
       ...equipment,
       createdAt: serverTimestamp(),
       updatedAt: serverTimestamp()
     };
     
     // Remove isModified flag if it exists
     if (docWithTimestamps.isModified) {
       delete docWithTimestamps.isModified;
     }
     
     const docRef = await addDoc(equipmentCollection, docWithTimestamps);
     console.log("Equipment created with ID:", docRef.id);
     return { ...equipment, docId: docRef.id };
   } else {
     // Update existing equipment
     const docRef = doc(db, "equipment", equipment.docId);
     
     // Prepare update data
     const updateData = { ...equipment, updatedAt: serverTimestamp() };
     
     // Remove the docId and isModified flag from the data to update
     delete updateData.docId;
     if (updateData.isModified) {
       delete updateData.isModified;
     }
     
     await updateDoc(docRef, updateData);
     console.log("Equipment updated:", equipment.docId);
     return equipment;
   }
 } catch (error) {
   console.error("Error saving equipment:", error);
   throw error;
 }
};

// Load all equipment
export const loadEquipment = async () => {
 try {
   const snapshot = await getDocs(equipmentCollection);
   console.log(`Loaded ${snapshot.docs.length} equipment items`);
   return snapshot.docs.map(doc => ({
     ...doc.data(),
     docId: doc.id
   }));
 } catch (error) {
   console.error("Error loading equipment:", error);
   throw error;
 }
};

// Listen for real-time updates to equipment
export const subscribeToEquipment = (callback) => {
 return onSnapshot(equipmentCollection, (snapshot) => {
   const equipment = snapshot.docs.map(doc => ({
     ...doc.data(),
     docId: doc.id
   }));
   callback(equipment);
 }, (error) => {
   console.error("Error subscribing to equipment:", error);
 });
};

// Delete an equipment item
export const deleteEquipment = async (docId) => {
 try {
   await deleteDoc(doc(db, "equipment", docId));
   console.log("Equipment deleted:", docId);
   return true;
 } catch (error) {
   console.error("Error deleting equipment:", error);
   throw error;
 }
};

// Query equipment by division
export const getEquipmentByDivision = async (division) => {
 try {
   const q = query(equipmentCollection, where("division", "==", division));
   const snapshot = await getDocs(q);
   return snapshot.docs.map(doc => ({
     ...doc.data(),
     docId: doc.id
   }));
 } catch (error) {
   console.error("Error querying equipment by division:", error);
   throw error;
 }
};

// Batch save multiple equipment items
export const batchSaveEquipment = async (equipmentItems) => {
 try {
   const batch = writeBatch(db);
   
   for (const item of equipmentItems) {
     // For new items without a docId
     if (!item.docId) {
       const newDocRef = doc(equipmentCollection);
       const docData = { 
         ...item, 
         createdAt: serverTimestamp(), 
         updatedAt: serverTimestamp() 
       };
       if (docData.isModified) delete docData.isModified;
       
       batch.set(newDocRef, docData);
     } 
     // For existing items with a docId
     else {
       const docRef = doc(db, "equipment", item.docId);
       const updateData = { ...item, updatedAt: serverTimestamp() };
       delete updateData.docId;
       if (updateData.isModified) delete updateData.isModified;
       
       batch.update(docRef, updateData);
     }
   }
   
   await batch.commit();
   console.log(`Batch processed ${equipmentItems.length} equipment items`);
   return true;
 } catch (error) {
   console.error("Error batch saving equipment:", error);
   throw error;
 }
};

// =====================
// Divisions Operations
// =====================

export const divisionsCollection = collection(db, "divisions");
const DIVISIONS_DOC_ID = "divisions-list"; // Fixed document ID for divisions

// Save divisions
export const saveDivisions = async (divisions) => {
 try {
   await setDoc(doc(db, "divisions", DIVISIONS_DOC_ID), { 
     list: divisions,
     updatedAt: serverTimestamp()
   });
   console.log("Divisions saved");
   return divisions;
 } catch (error) {
   console.error("Error saving divisions:", error);
   throw error;
 }
};

// Load divisions
export const loadDivisions = async () => {
 try {
   const docRef = doc(db, "divisions", DIVISIONS_DOC_ID);
   const docSnap = await getDoc(docRef);
   
   if (docSnap.exists()) {
     console.log("Divisions loaded");
     return docSnap.data().list;
   } else {
     console.log("No divisions found, creating default document");
     // Return empty array if no divisions document exists
     return [];
   }
 } catch (error) {
   console.error("Error loading divisions:", error);
   throw error;
 }
};

// Subscribe to divisions changes
export const subscribeToDivisions = (callback) => {
 const docRef = doc(db, "divisions", DIVISIONS_DOC_ID);
 return onSnapshot(docRef, (doc) => {
   if (doc.exists()) {
     callback(doc.data().list);
   } else {
     callback([]);
   }
 }, (error) => {
   console.error("Error subscribing to divisions:", error);
 });
};

// =====================
// Utility Functions
// =====================

// Initialize database with default data (useful for first-time setup)
export const initializeDatabase = async (initialDivisions, initialRequests, initialEquipment) => {
 try {
   // Check if database already has data
   const divisionsSnapshot = await getDocs(divisionsCollection);
   const requestsSnapshot = await getDocs(requestsCollection);
   const equipmentSnapshot = await getDocs(equipmentCollection);
   
   // Create batch operation
   const batch = writeBatch(db);
   
   // Initialize divisions if none exist
   if (divisionsSnapshot.empty && initialDivisions && initialDivisions.length > 0) {
     const divisionsRef = doc(db, "divisions", DIVISIONS_DOC_ID);
     batch.set(divisionsRef, { 
       list: initialDivisions,
       createdAt: serverTimestamp(),
       updatedAt: serverTimestamp()
     });
   }
   
   // Initialize requests if none exist
   if (requestsSnapshot.empty && initialRequests && initialRequests.length > 0) {
     initialRequests.forEach(request => {
       const docRef = doc(requestsCollection);
       batch.set(docRef, {
         ...request,
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp()
       });
     });
   }
   
   // Initialize equipment if none exist
   if (equipmentSnapshot.empty && initialEquipment && initialEquipment.length > 0) {
     initialEquipment.forEach(item => {
       const docRef = doc(equipmentCollection);
       batch.set(docRef, {
         ...item,
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp()
       });
     });
   }
   
   // Commit the batch
   await batch.commit();
   console.log("Database initialized with default data");
   return true;
 } catch (error) {
   console.error("Error initializing database:", error);
   throw error;
 }
};

// Export data for backup
export const exportDatabaseData = async () => {
 try {
   // Get all collections
   const requestsData = await loadRequests();
   const equipmentData = await loadEquipment();
   
   // Get divisions
   let divisionsData = [];
   try {
     divisionsData = await loadDivisions();
   } catch (error) {
     console.warn("No divisions found for export");
   }
   
   // Combine into a single export object
   const exportData = {
     requests: requestsData,
     equipment: equipmentData,
     divisions: divisionsData,
     exportDate: new Date().toISOString()
   };
   
   // Return as JSON string
   return JSON.stringify(exportData, null, 2);
 } catch (error) {
   console.error("Error exporting database:", error);
   throw error;
 }
};

// Import data from backup
export const importDatabaseData = async (jsonData) => {
 try {
   // Parse the data
   const importData = JSON.parse(jsonData);
   
   // Create batch operations for better performance
   const batch = writeBatch(db);
   
   // Import divisions
   if (importData.divisions && importData.divisions.length > 0) {
     const divisionsRef = doc(db, "divisions", DIVISIONS_DOC_ID);
     batch.set(divisionsRef, { 
       list: importData.divisions,
       updatedAt: serverTimestamp(),
       importedAt: serverTimestamp()
     });
   }
   
   // Import requests - create new documents to avoid conflicts
   if (importData.requests && importData.requests.length > 0) {
     importData.requests.forEach(request => {
       // Create a new document for each request, preserving the original ID
       const requestData = { ...request };
       
       // Remove Firestore-specific fields
       if (requestData.docId) delete requestData.docId;
       if (requestData.createdAt) delete requestData.createdAt;
       if (requestData.updatedAt) delete requestData.updatedAt;
       
       // Add import metadata
       requestData.importedAt = serverTimestamp();
       requestData.updatedAt = serverTimestamp();
       
       const docRef = doc(requestsCollection);
       batch.set(docRef, requestData);
     });
   }
   
   // Import equipment - create new documents to avoid conflicts
   if (importData.equipment && importData.equipment.length > 0) {
     importData.equipment.forEach(item => {
       // Create a new document for each equipment item, preserving the original ID
       const equipmentData = { ...item };
       
       // Remove Firestore-specific fields
       if (equipmentData.docId) delete equipmentData.docId;
       if (equipmentData.createdAt) delete equipmentData.createdAt;
       if (equipmentData.updatedAt) delete equipmentData.updatedAt;
       
       // Add import metadata
       equipmentData.importedAt = serverTimestamp();
       equipmentData.updatedAt = serverTimestamp();
       
       const docRef = doc(equipmentCollection);
       batch.set(docRef, equipmentData);
     });
   }
   
   // Commit all changes
   await batch.commit();
   console.log("Database import completed successfully");
   return true;
 } catch (error) {
   console.error("Error importing database:", error);
   throw error;
 }
};

// Export everything needed
export { app, db, auth };