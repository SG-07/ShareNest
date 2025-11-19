// src/pages/BorrowItem/components/BorrowQuantity.jsx
export default function BorrowQuantity({ item, quantity, setQuantity }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Quantity</h2>

      <input
        type="number"
        min={1}
        max={item.maxQuantity}
        className="input"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <p className="text-sm text-gray-500 mt-1">
        Available: {item.maxQuantity}
      </p>
    </div>
  );
}