// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('campusHubUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, name = 'Student') => {
    const fakeUser = { 
      id: Date.now(), 
      email, 
      name: name || 'Student User',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      role: 'student'
    };
    localStorage.setItem('campusHubUser', JSON.stringify(fakeUser));
    setUser(fakeUser);
    return fakeUser;
  };

  const signup = (email, password, name) => {
    return login(email, password, name);
  };

  const logout = () => {
    localStorage.removeItem('campusHubUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};