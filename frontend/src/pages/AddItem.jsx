// src/pages/AddItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";

export default function AddItem() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    condition: "good",
    available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onFile = (e) => setImageFile(e.target.files?.[0] || null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      const res = await createItem(fd);
      console.debug("createItem response", res.data);
      const id = res?.data?.id || res?.data?._id;
      navigate(id ? `/items/${id}` : "/");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || err.message || "Failed to create item"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Creating item…" />;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Add new item</h1>

      {error && <ErrorBanner message={error} />}

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
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
            placeholder="Cordless Drill"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={onChange}
            className="w-full input"
            placeholder="Tools"
          />
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium mb-1">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            value={form.condition}
            onChange={onChange}
            className="w-full input"
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            rows="4"
            className="w-full input"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Image
          </label>
          <input id="image" type="file" accept="image/*" onChange={onFile} />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={onChange}
            />
            <span className="text-sm">Available to lend</span>
          </label>

          <button
            type="submit"
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Item
          </button>
        </div>
      </form>
    </div>
  );
}
