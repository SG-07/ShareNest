// src/pages/Borrow/components/QuantitySelector.jsx
import React from "react";

export default function QuantitySelector({ value, onChange, max = 1, min = 1 }) {
  const inc = () => {
    if (value < max) onChange(value + 1);
  };
  const dec = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={dec}
        className="w-8 h-8 flex items-center justify-center border rounded"
      >
        -
      </button>
      <div className="px-3">{value}</div>
      <button
        type="button"
        onClick={inc}
        className="w-8 h-8 flex items-center justify-center border rounded"
      >
        +
      </button>
      <div className="text-sm text-gray-500 ml-4">available: {max}</div>
    </div>
  );
}
