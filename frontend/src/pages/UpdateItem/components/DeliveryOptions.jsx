// src/pages/UpdateItem/components/DeliveryOptions.jsx

export default function DeliveryOptions({ form, setForm }) {
  return (
    <div className="bg-white p-4 shadow rounded-lg space-y-2">
      <h2 className="font-semibold text-lg">Delivery Options</h2>

      <select
        className="border p-2 rounded w-full"
        value={form.deliveryOption}
        onChange={(e) => setForm({ ...form, deliveryOption: e.target.value })}
      >
        <option value="PICKUP">Pickup Only</option>
        <option value="DELIVERY">Delivery Only</option>
        <option value="BOTH">Pickup & Delivery</option>
      </select>

      {(form.deliveryOption === "DELIVERY" ||
        form.deliveryOption === "BOTH") && (
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Delivery Charge"
          value={form.deliveryCharge}
          onChange={(e) =>
            setForm({ ...form, deliveryCharge: Number(e.target.value) })
          }
        />
      )}
    </div>
  );
}
