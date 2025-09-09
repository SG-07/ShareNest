// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const { register: registerUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setBusy(true);
      await registerUser(form);
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Sign up failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={form.name} onChange={onChange} required className="w-full input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" value={form.email} onChange={onChange} type="email" required className="w-full input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" value={form.password} onChange={onChange} type="password" required className="w-full input" />
        </div>

        <div className="flex justify-end">
          <button disabled={busy} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  );
}
