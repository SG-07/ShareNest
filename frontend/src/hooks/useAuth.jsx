/* src/hooks/useAuth.jsx */
import { createContext, useContext, useEffect, useState } from 'react';
import { login, register, logout, getCurrentUser } from '../services/api';

/* ------------------------------------
 *  Auth Context
 * ------------------------------------ */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user when the app starts, only if token exists
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getCurrentUser();
        setUser(data);
      } catch (_) {
        setUser(null);
        localStorage.removeItem('jwtToken');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loginUser = async (creds) => {
    const { data } = await login(creds);
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);
  };

  const registerUser = async (creds) => {
    const { data } = await register(creds);
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (_) {
      // ignore network errors on logout
    }
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  const value = { user, loading, login: loginUser, register: registerUser, logout: logoutUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
