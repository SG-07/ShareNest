/* src/hooks/useAuth.js */
import { createContext, useContext, useEffect, useState } from 'react';
import { login, register, logout, getCurrentUser } from '../services/apis';

/* ------------------------------------
 *  Auth Context
 * ------------------------------------ */
const AuthContext = createContext(null);

/**
 * AuthProvider – keeps the logged‑in user in state
 * and exposes helper functions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // the user object returned by /auth/me
  const [loading, setLoading] = useState(true); // while we fetch the current user

  /* Load user when the app starts */
  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await getCurrentUser();
        setUser(data);
      } catch (_) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* Helper that logs in the user & stores the JWT */
  const loginUser = async (creds) => {
    const { data } = await login(creds);
    // Assuming your backend sends the JWT in the response body
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);   // the payload that contains id, name, email …
  };

  /* Helper that registers a new account */
  const registerUser = async (creds) => {
    const { data } = await register(creds);
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);
  };

  /* Log out the user */
  const logoutUser = async () => {
    await logout(); // optional – only if you have a `/auth/logout` endpoint
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  /* The value that will be exposed through the context */
  const value = {
    user,
    loading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook that lets any component consume the AuthContext
 */
export const useAuth = () => useContext(AuthContext);