// src/components/AddItem/CalendarSection.jsx
import React from "react";

export default function CalendarSection({ form, setField }) {
  return (
    <>
      <h2 className="text-lg font-semibold mt-4">Availability</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Available From</label>
          <input
            type="date"
            name="availableFrom"
            value={form.availableFrom}
            onChange={(e) => setField("availableFrom", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Available Until</label>
          <input
            type="date"
            name="availableUntil"
            value={form.availableUntil}
            onChange={(e) => setField("availableUntil", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Use these fields to indicate the general availability window. (For advanced blocking or calendars, we'll add a calendar component later.)
      </p>
    </>
  );
}
