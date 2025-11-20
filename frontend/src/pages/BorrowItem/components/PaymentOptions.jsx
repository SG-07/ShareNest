// src/pages/BorrowItem/components/PaymentOptions.jsx
export default function PaymentOptions({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Payment Method</h3>

      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />
          <span>Online Payment (UPI / Card)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
          />
          <span>Cash on Pickup</span>
        </label>
      </div>
    </div>
  );
}
