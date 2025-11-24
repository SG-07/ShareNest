// src/pages/UpdateItem/components/BasicDetails.jsx

export default function BasicDetails({ form, setForm }) {
  return (
    <div className="bg-white p-4 shadow rounded-lg space-y-3">
      <h2 className="font-semibold text-lg">Basic Details</h2>

      <input
        className="border p-2 w-full rounded"
        placeholder="Item Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        className="border p-2 w-full rounded"
        placeholder="Description"
        rows="3"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        className="border p-2 w-full rounded"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <select
        className="border p-2 w-full rounded"
        value={form.condition}
        onChange={(e) => setForm({ ...form, condition: e.target.value })}
      >
        <option value="GOOD">Good</option>
        <option value="USED">Used</option>
        <option value="NEW">New</option>
        <option value="FAIR">Fair</option>
        <option value="OLD">Old</option>
        <option value="DAMAGED">Damaged</option>
      </select>
    </div>
  );
}
