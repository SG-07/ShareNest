// src/pages/BorrowItem/components/BorrowDiscount.jsx
import { useState } from "react";

export default function BorrowDiscount({
  discountCode,
  setDiscountCode,
  appliedDiscount,
  setAppliedDiscount
}) {
  const [checking, setChecking] = useState(false);

  const applyCoupon = () => {
    if (!discountCode.trim()) return;

    setChecking(true);

    setTimeout(() => {
      // Dummy coupon logic:
      if (discountCode.toLowerCase() === "SAVE10".toLowerCase()) {
        setAppliedDiscount(10); // ₹10 off
      } else if (discountCode.toLowerCase() === "SAVE20".toLowerCase()) {
        setAppliedDiscount(20); // ₹20 off
      } else {
        setAppliedDiscount(0);
        alert("Invalid coupon code");
      }
      setChecking(false);
    }, 600);
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Discount Coupon</h3>

      <div className="flex gap-2">
        <input
          type="text"
          className="input flex-1"
          placeholder="Enter coupon code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />

        <button
          className="btn btn-outline"
          onClick={applyCoupon}
          disabled={checking}
        >
          {checking ? "Checking…" : "Apply"}
        </button>
      </div>

      {appliedDiscount > 0 && (
        <p className="text-green-600 mt-2">
          Coupon applied: ₹{appliedDiscount} off
        </p>
      )}
    </div>
  );
}
