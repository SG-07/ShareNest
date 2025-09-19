/* src/hooks/useAuth.jsx */
import { createContext, useContext, useEffect, useState } from "react";
import { login, register, getCurrentUser } from "../services/api";
import { devLog } from "../utils/devLog";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on app load
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("jwtToken");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        devLog("Auth", "Restoring user from localStorage");
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } else {
        try {
          devLog("Auth", "Fetching current user with saved token");
          const { data } = await getCurrentUser();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } catch (err) {
          devLog("Auth", "Failed to fetch current user", err);
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("user");
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, []);

  // ✅ Login
  const loginUser = async (payload) => {
    devLog("Auth", "Logging in with payload", {
      ...payload,
      password: "***", // mask password
    });

    const { data: res } = await login(payload);
    devLog("Auth", "Login API response", res);

    // Save token + user
    localStorage.setItem("jwtToken", res.token);
    localStorage.setItem("user", JSON.stringify(res.user || null));
    setUser(res.user || null);

    return res; // { token, user }
  };

  // ✅ Register
  const registerUser = async (creds) => {
    devLog("Auth", "Registering user", {
      ...creds,
      password: "***", // mask password
    });

    const { data: res } = await register(creds);
    devLog("Auth", "Register API response", res);

    // Save token + user
    localStorage.setItem("jwtToken", res.token);
    localStorage.setItem("user", JSON.stringify(res.user || null));
    setUser(res.user || null);

    return res; // { token, user }
  };

  // ✅ Logout (frontend only)
  const logoutUser = () => {
    devLog("Auth", "Logging out user");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
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
