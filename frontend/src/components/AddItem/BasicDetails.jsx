// src/components/AddItem/BasicDetails.jsx
import React from "react";

export default function BasicDetails({ form, setField }) {
  return (
    <>
      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Condition</label>
        <select
          name="condition"
          value={form.condition}
          onChange={(e) => setField("condition", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="NEW">New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
      </div>
    </>
  );
}
