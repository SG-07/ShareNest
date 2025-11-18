// src/components/AddItem/RentalRules.jsx
import React from "react";

export default function RentalRules({ form, setField }) {
  return (
    <>
      <div>
        <label className="block font-medium mb-1">Item Safety Notes</label>
        <textarea
          name="safetyNotes"
          value={form.safetyNotes}
          onChange={(e) => setField("safetyNotes", e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={2}
          placeholder="E.g., wear gloves, avoid water, handle carefully..."
        />
      </div>
    </>
  );
}
