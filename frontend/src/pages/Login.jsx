// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onChange = (e) => setCreds({ ...creds, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setBusy(true);
      await login(creds);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" value={creds.email} onChange={onChange} type="email" required className="w-full input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" value={creds.password} onChange={onChange} type="password" required className="w-full input" />
        </div>

        <div className="flex items-center justify-between">
          <button disabled={busy} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <Link to="/signup" className="text-sm text-indigo-600 hover:underline">Create account</Link>
        </div>
      </form>
    </div>
  );
}
