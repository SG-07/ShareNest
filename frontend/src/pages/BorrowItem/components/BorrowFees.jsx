// src/pages/BorrowItem/components/BorrowFees.jsx
export default function BorrowFees({ item, extraFees, setExtraFees }) {
  const update = (field, value) => {
    setExtraFees((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Fees & Charges</h3>

      <div className="space-y-3">

        {/* Security deposit fixed from item */}
        <div className="flex justify-between">
          <span>Security Deposit</span>
          <span className="font-medium">₹{item.securityDeposit || 0}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between">
          <span>Tax (GST)</span>
          <span className="font-medium">
            {Math.round(extraFees.tax * 100)}%
          </span>
        </div>

        {/* Service fee */}
        <div className="flex justify-between">
          <span>Service Fee</span>
          <span className="font-medium">₹{extraFees.serviceFee}</span>
        </div>

      </div>
    </div>
  );
}
