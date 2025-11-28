// src/pages/MyItems.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyItems } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      console.log("📄 [MyItems.jsx] Mounted");
      console.log("➡️ [MyItems.jsx] Sending request: getMyItems()");

      try {
        const res = await getMyItems();

        console.group("⬅️ [MyItems.jsx] Backend Response");
        console.log("Status:", res.status);
        console.log("Data:", res.data);
        console.groupEnd();

        setItems(res.data || []);
      } catch (err) {
        console.group("❌ [MyItems.jsx] Error while fetching items");
        console.error(err);
        console.groupEnd();

        setError("Failed to load your items");
      } finally {
        setLoading(false);
        console.log("📄 [MyItems.jsx] Loading completed");
      }
    }
    load();
  }, []);

  if (loading) return <Loading message="Loading your items…" />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Items</h1>

      {items.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">
          You haven't added any items yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded shadow hover:shadow-lg transition p-4"
            >
              <img
                src={item.imageUrls?.[0] || "/placeholder-item.png"}
                alt={item.name}
                className="h-40 w-full object-cover rounded"
              />

              <h2 className="text-lg font-semibold mt-3">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.category}</p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
                  item.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.available ? "Available" : "Unavailable"}
              </span>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/items/${item.id}`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                >
                  VIEW
                </button>

                <button
                  onClick={() => navigate(`/update/${item.id}`)}
                  className="btn-primary"
                >
                  UPDATE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
