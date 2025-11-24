// src/pages/BorrowItem/components/PaymentOptions.jsx

export default function PaymentOptions({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Payment Method</h3>

      <div className="space-y-3">

        {/* Disabled Online Payment */}
        <label
          className="flex items-center gap-3 cursor-not-allowed opacity-50"
          title="Coming Soon"
        >
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            disabled
            onChange={() => {}}
          />
          <span>
            Online Payment (UPI / Card) — <span className="text-sm text-blue-500">Coming Soon</span>
          </span>
        </label>

        {/* Cash on Pickup / Delivery */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
          />
          <span>Cash on Pickup / Delivery</span>
        </label>

      </div>
    </div>
  );
}
