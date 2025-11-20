// src/components/AddItem/DeliveryOptions.jsx
import React from "react";

export default function DeliveryOptions({ form, setField }) {
  return (
    <>
      <div>
        <label className="block font-medium mb-1">Delivery Options</label>
        <select
          name="deliveryOption"
          value={form.deliveryOption}
          onChange={(e) => setField("deliveryOption", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="PICKUP">Pickup only</option>
          <option value="DELIVERY">Delivery only</option>
          <option value="BOTH">Pickup & Delivery</option>
        </select>
      </div>

      {(form.deliveryOption === "DELIVERY" || form.deliveryOption === "BOTH") && (
        <div>
          <label className="block font-medium mb-1">Delivery Charge (₹)</label>
          <input
            type="number"
            name="deliveryCharge"
            value={form.deliveryCharge}
            onChange={(e) => setField("deliveryCharge", e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="0"
          />
        </div>
      )}
    </>
  );
}
