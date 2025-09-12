/* src/hooks/useAuth.jsx */
import { createContext, useContext, useEffect, useState } from 'react';
import { login, register, logout, getCurrentUser } from '../services/api';
import { devLog } from '../utils/devLog';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        devLog("Auth", "Fetching current user");
        const { data } = await getCurrentUser();
        setUser(data);
      } catch (err) {
        devLog("Auth", "Failed to fetch current user", err);
        localStorage.removeItem('jwtToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loginUser = async (creds) => {
    devLog("Auth", "Logging in user", creds);
    const { data } = await login(creds);
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);
  };

  const registerUser = async (creds) => {
    devLog("Auth", "Registering user", creds);
    const { data } = await register(creds);
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);
  };

  const logoutUser = async () => {
    devLog("Auth", "Logging out user");
    try { await logout(); } catch (_) {}
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
