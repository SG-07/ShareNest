// src/pages/UpdateItem/components/RentalRules.jsx

export default function RentalRules({ form, setForm }) {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="font-semibold text-lg">Item Safety Notes</h2>
      
      <textarea
        className="border p-2 w-full rounded"
        rows="4"
        placeholder="Safety notes (optional)"
        value={form.safetyNotes}
        onChange={(e) => setForm({ ...form, safetyNotes: e.target.value })}
      />
    </div>
  );
}
