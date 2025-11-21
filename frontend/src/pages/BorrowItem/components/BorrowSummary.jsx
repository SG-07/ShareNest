// src/pages/BorrowItem/components/BorrowSummary.jsx

export default function BorrowSummary({ item, dates, quantity }) {
  if (!dates) return null;

  const start = new Date(dates[0].setHours(0, 0, 0, 0));
  const end = new Date(dates[1].setHours(0, 0, 0, 0));

  const days =
    Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

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