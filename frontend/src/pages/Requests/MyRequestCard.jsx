// src/components/requests/MyRequestCard.jsx

import { useState } from "react";
import { cancelRequest } from "../../services/api";
import ItemInfoCard from "../Item/ItemInfoCard";

export default function MyRequestCard({ req, refresh }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;

    try {
      await cancelRequest(req.id);
      refresh();
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Unable to cancel request.");
    }
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-200 text-gray-700",
  };

  const start = req.requestedFrom;
  const end = req.requestedTill;

  // Use backend-calculated days OR fallback
  const days =
    req.days && req.days > 0
      ? req.days
      : Math.max(
          1,
          (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
        );

  const totalPrice =
    req.totalPrice && req.totalPrice > 0
      ? req.totalPrice
      : days * (req.pricePerDay || 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition">
      
      {/* Top Section */}
      <div className="flex gap-4 cursor-pointer" onClick={() => setIsOpen(true)}>
        
        <img
          src={req.item?.image || "/placeholder-item.png"}
          className="w-28 h-28 rounded object-cover"
          alt=""
        />

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{req.item?.name}</h3>

          <p className="text-gray-600 text-sm mt-1">
            {start} → {end} ({days} days)
          </p>

          <span
            className={`mt-2 inline-block text-xs px-2 py-1 rounded-full font-medium ${statusColors[req.status]}`}
          >
            {req.status}
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="mt-3 text-sm text-gray-700">
        Price/Day: <strong>₹{req.pricePerDay}</strong> {" | "}
        Security Deposit:
        <strong className="text-blue-700 underline decoration-dotted">
          ₹{req.securityDeposit}
        </strong>
        {" | "}
        Total: <strong>₹{totalPrice}</strong>

        <p className="text-xs text-blue-600 mt-1 italic">
          * Security deposit is held by ShareNest & returned after item condition is approved.
        </p>
      </div>

      {/* Cancel button */}
      {req.status === "PENDING" && (
        <button
          onClick={handleCancel}
          className="mt-4 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Cancel Request
        </button>
      )}

      {/* Expandable Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full rounded-lg p-6 relative">

            <button
              className="absolute right-3 top-3 text-xl"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <ItemInfoCard item={req.item} />
          </div>
        </div>
      )}
    </div>
  );
}
