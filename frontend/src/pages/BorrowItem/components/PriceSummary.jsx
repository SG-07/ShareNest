// src/pages/Borrow/components/PriceSummary.jsx
import React, { useMemo } from "react";

/**
 * Props:
 *  - pricePerDay
 *  - days
 *  - quantity
 *  - deliveryCharge
 *  - securityDeposit
 *  - discountRules (array of { minDays, pct })
 */
export default function PriceSummary({
  pricePerDay,
  days,
  quantity,
  deliveryCharge = 0,
  securityDeposit = 0,
  discountRules = [
    { minDays: 30, pct: 0.2 },
    { minDays: 7, pct: 0.1 },
  ],
}) {
  const subtotal = useMemo(() => pricePerDay * days * quantity, [pricePerDay, days, quantity]);

  const discountPct = useMemo(() => {
    const rule = discountRules
      .slice()
      .sort((a, b) => b.minDays - a.minDays)
      .find((r) => days >= r.minDays);
    return rule ? rule.pct : 0;
  }, [days, discountRules]);

  const discountAmount = subtotal * discountPct;
  const total = subtotal - discountAmount + (deliveryCharge || 0) + (securityDeposit || 0);

  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="text-lg font-semibold mb-2">Price summary</h3>
      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span>Price / day</span>
          <span>₹{pricePerDay?.toFixed(2) ?? "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>Days</span>
          <span>{days}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantity</span>
          <span>{quantity}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        {discountPct > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Discount ({Math.round(discountPct * 100)}%)</span>
            <span>- ₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹{Number(deliveryCharge || 0).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Security deposit</span>
          <span>₹{Number(securityDeposit || 0).toFixed(2)}</span>
        </div>

        <div className="flex justify-between pt-2 border-t font-semibold">
          <span>Total</span>
          <span>₹{Number(total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
