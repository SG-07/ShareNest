// src/pages/Signup.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { devLog } from "../utils/devLog";
import { checkUsername, checkEmail } from "../services/api";

const CITIES = [
  { value: "", label: "Select your city" },
  { value: "DELHI NCR", label: "Delhi NCR" },
  { value: "BENGALURU", label: "Bengaluru" },
];

export default function Signup() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    city: "",
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

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        devLog("Signup.jsx", "Checking username:", form.username);

        const res = await checkUsername(form.username);
        devLog("Signup.jsx", "Username check response:", res.data);

        setUsernameAvailable(res.data?.available);
      } catch (err) {
        devLog("Signup.jsx", "Username check failed", err);
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
        devLog("Signup.jsx", "Checking email:", form.email);

        const res = await checkEmail(form.email);
        devLog("Signup.jsx", "Email check response:", res.data);

        setEmailAvailable(res.data?.available);
      } catch (err) {
        devLog("Signup.jsx", "Email check failed", err);
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

    if (!form.city) {
      toast.error("Please select your city");
      return;
    }

    try {
      setBusy(true);

      devLog("Signup.jsx", "Submitting registration payload:", form);

      const result = await register(form);

      devLog("Signup.jsx", "Signup successful:", result.user);

      toast.success(`Account created 🎉 Welcome, ${result.user?.name || ""}`);
      navigate(from, { replace: true });
    } catch (err) {
      devLog("Signup.jsx", "Registration failed", err);
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
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full input"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
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
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
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

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>

          <select
            name="city"
            value={form.city}
            onChange={onChange}
            required
            className="w-full input"
          >
            {CITIES.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>

          <p className="text-xs text-gray-500 mt-1">
            We currently support limited cities. More locations are coming soon
            🚀
            <br />
            Your city helps us show faster, more relevant items near you.
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
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
              usernameAvailable !== true ||
              emailAvailable !== true ||
              !form.city
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
