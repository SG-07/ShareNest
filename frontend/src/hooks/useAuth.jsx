/* src/hooks/useAuth.jsx */
import { createContext, useContext, useEffect, useState } from "react";
import { login, register, logout, getCurrentUser } from "../services/api";
import { devLog } from "../utils/devLog";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on app load
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        devLog("Auth", "Fetching current user with saved token");
        const { data } = await getCurrentUser();
        setUser(data);
      } catch (err) {
        devLog("Auth", "Failed to fetch current user", err);
        localStorage.removeItem("jwtToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Login
  const loginUser = async (identifier, password) => {
    devLog("Auth", "Logging in user", { identifier, password: "***" });

    const data = {};
    if (identifier.includes("@")) {
      data.email = email;
    } else {
      data.username = username;
    }
    data.password = password;

    const { data: res } = await login(data); // <-- login API accepts full body now
    console.log("[Auth login API response]", res);

    localStorage.setItem("jwtToken", res.token);
    setUser(res.user || null);
    return res;
  };

  // Register
  const registerUser = async (creds) => {
    devLog("Auth", "Registering user", creds);
    const { data } = await register(creds);
    devLog("Auth", "Register response", data);

    // Save token first
    localStorage.setItem("jwtToken", data.token);

    // Fetch user with token
    const { data: userData } = await getCurrentUser();
    setUser(userData);
  };

  // Logout
  const logoutUser = async () => {
    devLog("Auth", "Logging out user");
    try {
      await logout();
    } catch (_) {}
    localStorage.removeItem("jwtToken");
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
