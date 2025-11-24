// src/pages/BorrowItem/components/DeliveryOptions.jsx

export default function DeliveryOptions({
  deliveryOption,
  setDeliveryOption,
  deliveryCharge,
  ownerDeliveryOption,
  address,
  setAddress,
}) {
  // Allowed conditions
  const pickupAllowed =
    ownerDeliveryOption === "PICKUP" || ownerDeliveryOption === "BOTH";

  const deliveryAllowed =
    ownerDeliveryOption === "DELIVERY" || ownerDeliveryOption === "BOTH";

  return (
    <div className="bg-white shadow p-4 rounded-lg space-y-4">
      <h2 className="text-lg font-semibold">Delivery Options</h2>

      {/* Delivery Choices */}
      <div className="space-y-2">

        {/* Pickup Option */}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="delivery"
            value="PICKUP"
            checked={deliveryOption === "PICKUP"}
            onChange={() => pickupAllowed && setDeliveryOption("PICKUP")}
            disabled={!pickupAllowed}
          />

          <span className={!pickupAllowed ? "text-gray-400" : ""}>
            Pickup (free)
          </span>
        </label>

        {!pickupAllowed && (
          <p className="text-sm text-red-600 ml-6">
            Owner does not allow pickup for this item.
          </p>
        )}

        {/* Delivery Option */}
        <label className="flex items-center gap-2 mt-1">
          <input
            type="radio"
            name="delivery"
            value="DELIVERY"
            checked={deliveryOption === "DELIVERY"}
            onChange={() => deliveryAllowed && setDeliveryOption("DELIVERY")}
            disabled={!deliveryAllowed}
          />

          <span className={!deliveryAllowed ? "text-gray-400" : ""}>
            Home Delivery{" "}
            {deliveryCharge ? `(₹${deliveryCharge})` : "(delivery charge applies)"}
          </span>
        </label>

        {!deliveryAllowed && (
          <p className="text-sm text-red-600 ml-6">
            Owner does not offer delivery for this item.
          </p>
        )}
      </div>

      {/* Address Form — Only when delivery is selected */}
      {deliveryOption === "DELIVERY" && deliveryAllowed && (
        <div className="space-y-3 mt-4">
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
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) =>
              setAddress({ ...address, state: e.target.value })
            }
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