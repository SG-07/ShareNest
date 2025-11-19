// src/pages/Borrow/components/DeliveryOptions.jsx
import React from "react";

export default function DeliveryOptions({
  deliveryOption,
  deliveryCharge,
  onSelect,
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Delivery options</div>
      <div className="flex gap-3 items-center">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="delivery"
            value="PICKUP"
            checked={deliveryOption === "PICKUP"}
            onChange={() => onSelect("PICKUP")}
          />
          <span>Pickup (free)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="delivery"
            value="DELIVERY"
            checked={deliveryOption === "DELIVERY"}
            onChange={() => onSelect("DELIVERY")}
          />
          <span>Delivery ({deliveryCharge ? `₹${deliveryCharge}` : "charge"})</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="delivery"
            value="BOTH"
            checked={deliveryOption === "BOTH"}
            onChange={() => onSelect("BOTH")}
          />
          <span>Either</span>
        </label>
      </div>
    </div>
  );
}
