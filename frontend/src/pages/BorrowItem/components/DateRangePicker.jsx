// src/pages/Borrow/components/DateRangePicker.jsx
import React from "react";

/**
 * Props:
 *  - startDate, endDate (YYYY-MM-DD or empty)
 *  - onChange({ startDate, endDate })
 *  - minDate, maxDate (optional, YYYY-MM-DD)
 *  - minDays, maxDays (optional numbers)
 */
export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  minDays,
  maxDays,
}) {
  const handleStart = (e) => {
    const s = e.target.value;
    onChange({ startDate: s, endDate });
  };

  const handleEnd = (e) => {
    const en = e.target.value;
    onChange({ startDate, endDate: en });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">Start date</label>
        <input
          type="date"
          value={startDate || ""}
          onChange={handleStart}
          min={minDate}
          max={maxDate}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End date</label>
        <input
          type="date"
          value={endDate || ""}
          onChange={handleEnd}
          min={startDate || minDate}
          max={maxDate}
          className="w-full border rounded px-3 py-2"
        />
      </div>
    </div>
  );
}
