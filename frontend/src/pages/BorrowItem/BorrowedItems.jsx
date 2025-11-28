// src/pages/BorrowedItems.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBorrowedItems } from "../../services/api";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/Error";

export default function BorrowedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("📄 [BorrowedItems.jsx] Mounted");
    console.log("➡️ [BorrowedItems.jsx] Sending request: getBorrowedItems()");

    async function load() {
      try {
        const res = await getBorrowedItems();

        console.group("⬅️ [BorrowedItems.jsx] Backend Response");
        console.log("Status:", res.status);
        console.log("Data:", res.data);
        console.groupEnd();

        setItems(res.data || []);
      } catch (err) {
        console.group("❌ [BorrowedItems.jsx] Error while fetching borrowed items");
        console.error(err);
        console.groupEnd();

        setError("Failed to load borrowed items");
      } finally {
        setLoading(false);
        console.log("📄 [BorrowedItems.jsx] Loading completed");
      }
    }

    load();
  }, []);

  if (loading) return <Loading message="Loading borrowed items…" />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-6">Borrowed Items</h1>

      {items.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">
          You have not borrowed any items yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {items.map((entry) => (
            <div
              key={entry.requestId}
              className="bg-white rounded shadow hover:shadow-lg transition p-4"
            >
              <img
                src={entry.imageUrls?.[0] || "/placeholder-item.png"}
                alt={entry.itemName}
                className="h-40 w-full object-cover rounded"
              />

              {/* Item Name */}
              <h2 className="text-lg font-semibold mt-3">
                {entry.itemName}
              </h2>

              {/* Owner */}
              <p className="text-sm text-gray-500">
                Owner: {entry.ownerName}
              </p>

              {/* Borrow Status */}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
                  entry.status === "ACTIVE"
                    ? "bg-blue-100 text-blue-700"
                    : entry.status === "ACCEPTED"
                    ? "bg-yellow-100 text-yellow-700"
                    : entry.status === "RETURNED"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {entry.status}
              </span>

              {/* Start / End Date */}
              <div className="text-sm text-gray-600 mt-2">
                <p>
                  <b>From:</b>{" "}
                  {new Date(entry.startDate).toLocaleDateString()}
                </p>
                <p>
                  <b>To:</b>{" "}
                  {new Date(entry.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Total Price */}
              <p className="text-sm mt-2 font-medium text-gray-700">
                Total Price: ₹{entry.totalPrice}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/items/${entry.itemId}`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                >
                  View Item
                </button>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
