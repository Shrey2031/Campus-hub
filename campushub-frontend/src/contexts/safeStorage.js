// utils/safeStorage.js - Create this file
const safeStorage = {
  // ✅ StrictMode safe - stores multiple places
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);  // Backup
    // Optional: document.cookie = `${key}=${value}; path=/`;
  },
  
  // ✅ Gets from any storage
  getItem: (key) => {
    return localStorage.getItem(key) || 
           sessionStorage.getItem(key) || 
           null;
  },
  
  // ✅ Clear all
  removeItem: (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
  
  // ✅ Check exists
  hasItem: (key) => !!safeStorage.getItem(key)
};

export default safeStorage;