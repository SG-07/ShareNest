// src/components/AddItem/BasicDetails.jsx
export default function BasicDetails({ form, setField }) {
  return (
    <div className="space-y-4">
      
      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Item Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Drill Machine"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Explain item details..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Tools, Electronics, etc."
        />
      </div>

      {/* Condition */}
      <div>
        <label className="block font-medium mb-1">Condition</label>
        <select
          value={form.condition}
          onChange={(e) => setField("condition", e.target.value)}    
          className="w-full border p-2 rounded"
        >
          <option value="GOOD">Good</option>
          <option value="USED">Used</option>
          <option value="NEW">New</option>
          <option value="FAIR">Fair</option>
          <option value="OLD">Old</option>
          <option value="DAMAGED">Damaged</option>
        </select>
      </div>

      {/* ✅ Quantity */}
      <div>
        <label className="block font-medium mb-1">Quantity Available</label>
        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => setField("quantity", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="How many items available?"
        />
      </div>

    </div>
  );
}
