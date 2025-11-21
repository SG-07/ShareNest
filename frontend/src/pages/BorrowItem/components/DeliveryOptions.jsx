// src/pages/BorrowItem/components/DeliveryOptions.jsx

export default function DeliveryOptions({
  deliveryOption,
  setDeliveryOption,
  deliveryCharge
}) {
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Delivery Options</h3>

      <div className="space-y-2">

        {/* Pickup */}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="delivery"
            value="PICKUP"
            checked={deliveryOption === "PICKUP"}
            onChange={() => setDeliveryOption("PICKUP")}
          />
          <span>Pickup (free)</span>
        </label>

        {/* Delivery */}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="delivery"
            value="DELIVERY"
            checked={deliveryOption === "DELIVERY"}
            onChange={() => setDeliveryOption("DELIVERY")}
          />
          <span>Delivery ({deliveryCharge ? `₹${deliveryCharge}` : "charge"})</span>
        </label>

        {/* Both */}
        {/* <label className="flex items-center gap-2">
          <input
            type="radio"
            name="delivery"
            value="BOTH"
            checked={deliveryOption === "BOTH"}
            onChange={() => setDeliveryOption("BOTH")}
          />
          <span>Either</span>
        </label> */}
      </div>
    </div>
  );
}
