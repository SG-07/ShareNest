// src/pages/Requests/RequestsByItem.jsx

import { useLocation, useParams } from "react-router-dom";
import { acceptRequest, rejectRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

import ItemInfoCard from "../Item/ItemInfoCard";

export default function RequestsByItem() {
  const { itemId } = useParams();
  const location = useLocation();
  const item = location.state;

  if (!item) {
    return (
      <p className="text-red-600 p-4">
        No item data was passed. Try reopening the page from{" "}
        <strong>"Requests Received"</strong>.
      </p>
    );
  }

  const requests = item.requests || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  async function handleAccept(id) {
    try {
      toast.info(`Accepting request ${id}...`);
      await acceptRequest(id);
      toast.success("Request accepted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request");
    }
  }

  async function handleReject(id) {
    try {
      toast.info(`Rejecting request ${id}...`);
      await rejectRequest(id);
      toast.success("Request rejected!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* ITEM DETAILS CARD */}
      <div className="mb-8">
        <ItemInfoCard item={item} />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">
        Requests for: {item.name}
      </h2>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-gray-500">No requests for this item yet.</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="border p-4 rounded-lg bg-white shadow-sm"
            >
              <p>
                <strong>Borrower:</strong> {req.borrower.name}
              </p>

              <p>
                <strong>Trust Score:</strong> {req.borrower.trustScore}
              </p>

              <p>
                <strong>Duration:</strong> {formatDate(req.requestedFrom)} →{" "}
                {formatDate(req.requestedTill)}
              </p>

              <p>
                <strong>Delivery:</strong> {req.deliveryOption}
              </p>

              <p>
                <strong>Payment:</strong> {req.paymentMethod}
              </p>

              <p>
                <strong>Message:</strong> {req.message || "No message"}
              </p>

              <p className="mt-1 text-gray-600">
                Price/Day: <strong>₹{req.pricing?.pricePerDay}</strong>
                {" | "}
                <span className="relative group">
                  Security Deposit:
                  <strong className="text-blue-700">
                    {" "}
                    ₹{req.item.securityDeposit}
                  </strong>
                  {/* Tooltip */}
                  <span
                    className="absolute left-0 top-full mt-1 hidden group-hover:block 
                     bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10"
                  >
                    Held by company. Returned to borrower unless item is
                    damaged.
                  </span>
                </span>
                {" | "}
                Total Price: <strong>₹{req.pricing?.totalPrice}</strong>
              </p>

              {/* ACTIONS */}
              <div className="mt-3 flex gap-2">
                {req.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Check size={18} /> Accept
                    </button>

                    <button
                      onClick={() => handleReject(req.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X size={18} /> Reject
                    </button>
                  </>
                ) : req.status === "ACCEPTED" ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                    Accepted
                  </span>
                ) : req.status === "REJECTED" ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded">
                    Rejected
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
