// src/pages/BorrowItem/components/BorrowSubmit.jsx
export default function BorrowSubmit({ item, dates, quantity }) {
  const handleSubmit = () => {
    if (!dates) return alert("Please select a date range");

    alert("Borrow request submitted!");
  };

  return (
    <button
      className="btn btn-primary w-full py-3 text-lg"
      onClick={handleSubmit}
    >
      Send Borrow Request
    </button>
  );
}