// src/pages/UpdateItem/components/PricingDetails.jsx

export default function PricingDetails({ form, setForm }) {
  return (
    <div className="bg-white p-4 shadow rounded-lg space-y-3">
      <h2 className="font-semibold text-lg">Pricing</h2>

      <input
        type="number"
        className="border p-2 w-full rounded"
        placeholder="Price Per Day"
        value={form.pricePerDay}
        onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
      />

      <input
        type="number"
        className="border p-2 w-full rounded"
        placeholder="Security Deposit"
        value={form.securityDeposit}
        onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
      />
    </div>
  );
}
