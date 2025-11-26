// src/pages/BorrowItem/components/BorrowQuantity.jsx

export default function BorrowQuantity({ item, quantity, setQuantity }) {
  const availableQty = item.quantity || 1;

  const increase = () => {
    if (quantity < availableQty) {
      setQuantity(quantity + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleManualInput = (e) => {
    let value = Number(e.target.value);

    if (value < 1) value = 1;
    if (value > availableQty) value = availableQty;

    setQuantity(value);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <h2 className="font-semibold mb-3 text-gray-800 text-lg">
        Select Quantity
      </h2>

      <div className="flex items-center gap-4">
        
        {/* Decrease Button */}
        <button
          onClick={decrease}
          disabled={quantity <= 1}
          className={`w-10 h-10 flex justify-center items-center rounded-lg border
            ${quantity <= 1 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          –
        </button>

        {/* Quantity Input */}
        <input
          type="number"
          value={quantity}
          min={1}
          max={availableQty}
          onChange={handleManualInput}
          className="w-20 text-center border rounded-lg py-2 focus:ring focus:ring-blue-300 outline-none"
        />

        {/* Increase Button */}
        <button
          onClick={increase}
          disabled={quantity >= availableQty}
          className={`w-10 h-10 flex justify-center items-center rounded-lg border
            ${quantity >= availableQty 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          +
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Available: <span className="font-semibold text-gray-700">{availableQty}</span>
      </p>

      {quantity >= availableQty && availableQty > 1 && (
        <p className="text-xs text-red-500 mt-1">
          Maximum available quantity reached.
        </p>
      )}
    </div>
  );
}
