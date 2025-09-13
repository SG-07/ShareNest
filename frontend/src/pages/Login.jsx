// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { devLog } from "../utils/devLog";

export default function Login() {
  const { login } = useAuth();
  const [creds, setCreds] = useState({ identifier: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onChange = (e) =>
    setCreds({ ...creds, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      devLog("Login", "Sending credentials", creds);
      const result = await login(creds.identifier, creds.password);
      console.log("[Login response]", result);
      devLog("Login", "Login successful");
      toast.success("Welcome back 👋");
      navigate(from, { replace: true });
    } catch (err) {
      devLog("Login", "Login failed", err);
      console.error("[Login failed]", err);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium mb-1">
            Email or Username
          </label>
          <input
            id="identifier"
            name="identifier"
            value={creds.identifier}
            onChange={onChange}
            type="text"
            required
            className="w-full input"
            placeholder="Enter email or username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            value={creds.password}
            onChange={onChange}
            type="password"
            required
            className="w-full input"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            disabled={busy}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <Link
            to="/signup"
            state={{ from: location.state?.from }}
            className="text-sm text-indigo-600 hover:underline"
          >
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
