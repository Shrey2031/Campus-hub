import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import safeStorage from './safeStorage';

export default function useLogout() {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = safeStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/users/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Logged out successfully! 👋');
    } catch (error) {
      console.error('Logout API error:', error);
      toast.error('Logged out locally');
    } finally {
      safeStorage.removeItem('token');
      safeStorage.removeItem('user');
      safeStorage.removeItem('refreshToken');
      safeStorage.removeItem('userId');
      setLoggingOut(false);
      navigate('/auth', { replace: true });
    }
  };

  return { handleLogout, loggingOut };
}