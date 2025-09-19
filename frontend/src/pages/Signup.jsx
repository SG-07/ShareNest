// src/pages/Signup.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { devLog } from "../utils/devLog";
import { checkUsername, checkEmail } from "../services/api"; 

export default function Signup() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);

  // Username availability
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  // Email availability
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* -------------------------
     Debounced Username Check
     ------------------------- */
  useEffect(() => {
    if (!form.username) {
      setUsernameAvailable(null);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setCheckingUsername(true);
        devLog("Signup", "Checking username availability:", form.username);
        const res = await checkUsername(form.username);
        console.log("[Username check response]", res.data);
        devLog("Signup", "Username check response:", res.data);
        setUsernameAvailable(res.data?.available);
      } catch (err) {
        devLog("Signup", "Username check failed", err);
        setUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [form.username]);

  /* -------------------------
     Debounced Email Check
     ------------------------- */
  useEffect(() => {
    if (!form.email) {
      setEmailAvailable(null);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setCheckingEmail(true);
        devLog("Signup", "Checking email availability:", form.email);
        const res = await checkEmail(form.email);
        console.log("[Email check response]", res.data);
        devLog("Signup", "Email check response:", res.data);
        setEmailAvailable(res.data?.available);
      } catch (err) {
        devLog("Signup", "Email check failed", err);
        setEmailAvailable(false);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [form.email]);

  /* -------------------------
     Submit
     ------------------------- */
  const submit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      devLog("Signup", "Sending registration data:", form);

      const result = await register(form);
      console.log("[Signup response]", result);
      devLog("Signup", "Signup successful", result.user);

      toast.success(`Account created 🎉 Welcome, ${result.user?.name || ""}`);
      navigate(from, { replace: true });
    } catch (err) {
      devLog("Signup", "Registration failed", err);
      console.error("[Signup failed]", err);
      toast.error(err?.response?.data?.message || "Sign up failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <form
        onSubmit={submit}
        className="bg-white dark:bg-gray-900 p-6 rounded shadow space-y-4"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full input"
          />
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={onChange}
            required
            className="w-full input"
          />
          {checkingUsername && (
            <p className="text-sm text-gray-500">Checking availability…</p>
          )}
          {usernameAvailable === false && (
            <p className="text-sm text-red-500">❌ Username is already taken</p>
          )}
          {usernameAvailable === true && (
            <p className="text-sm text-green-600">✅ Username is available</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            required
            className="w-full input"
          />
          {checkingEmail && (
            <p className="text-sm text-gray-500">Checking availability…</p>
          )}
          {emailAvailable === false && (
            <p className="text-sm text-red-500">❌ Email is already taken</p>
          )}
          {emailAvailable === true && (
            <p className="text-sm text-green-600">✅ Email is available</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            required
            className="w-full input"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            disabled={
              busy ||
              checkingUsername ||
              checkingEmail ||
              usernameAvailable === false ||
              emailAvailable === false ||
              !usernameAvailable ||
              !emailAvailable
            }
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "Creating…" : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
}
