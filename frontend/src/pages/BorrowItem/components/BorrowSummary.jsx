// src/pages/BorrowItem/components/BorrowSummary.jsx

export default function BorrowSummary({ item, dates, quantity }) {
  // If no selection made → return nothing
  if (!dates) return null;

  // Ensure dates is a range array
  if (!Array.isArray(dates) || !dates[0] || !dates[1]) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-lg">
        <p>Select a start and end date to see summary.</p>
      </div>
    );
  }

  const startDate = new Date(dates[0]);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(dates[1]);
  endDate.setHours(0, 0, 0, 0);

  const days =
    Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const rentCost = days * item.pricePerDay * quantity;
  const deposit = item.securityDeposit * quantity;

  return (
    <div className="bg-white p-4 rounded-lg shadow text-lg">
      <p>Days: {days}</p>
      <p>Rent Cost: ₹{rentCost}</p>
      <p>Security Deposit: ₹{deposit}</p>

      <p className="font-bold mt-2">
        Total: ₹{rentCost + deposit}
      </p>
    </div>
  );
}
