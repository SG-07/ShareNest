// src/pages/BorrowItem/components/DeliveryOptions.jsx

import React from "react";

export default function BorrowDeliveryOptions({
  deliveryOption,
  setDeliveryOption,
  address,
  setAddress,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold">Delivery Method</h2>

      {/* Option Select */}
      <select
        value={deliveryOption}
        onChange={(e) => setDeliveryOption(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="pickup">Pickup</option>
        <option value="delivery">Home Delivery</option>
      </select>

      {/* Address Form (visible only when delivery = HOME_DELIVERY) */}
      {deliveryOption === "delivery" && (
        <div className="space-y-3 mt-3">
          <h3 className="font-medium">Delivery Address</h3>

          <input
            type="text"
            placeholder="Street"
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) =>
              setAddress({ ...address, pincode: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      )}
    </div>
  );
}
