// src/components/AddItem/PricingDetails.jsx
import React from "react";

export default function PricingDetails({ form, setField }) {
  return (
    <>
      <div>
        <label className="block font-medium mb-1">Price Per Day (₹)</label>
        <input
          type="number"
          name="pricePerDay"
          value={form.pricePerDay}
          onChange={(e) => setField("pricePerDay", e.target.value)}
          className="w-full border rounded px-3 py-2"
          min="1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Security Deposit (₹)</label>
          <input
            type="number"
            name="securityDeposit"
            value={form.securityDeposit}
            onChange={(e) => setField("securityDeposit", e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="0"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Min Rental Duration (days)</label>
          <input
            type="number"
            name="minRentalDays"
            value={form.minRentalDays}
            onChange={(e) => setField("minRentalDays", e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="1"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Max Rental Duration (days)</label>
          <input
            type="number"
            name="maxRentalDays"
            value={form.maxRentalDays}
            onChange={(e) => setField("maxRentalDays", e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="1"
          />
        </div>
      </div>
    </>
  );
}
