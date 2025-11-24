// src/pages/UpdateItem/components/RentalRules.jsx

export default function RentalRules({ form, setForm }) {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="font-semibold text-lg">Rental Rules</h2>
      
      <textarea
        className="border p-2 w-full rounded"
        rows="4"
        placeholder="Rules (optional)"
        value={form.rules}
        onChange={(e) => setForm({ ...form, rules: e.target.value })}
      />
    </div>
  );
}
