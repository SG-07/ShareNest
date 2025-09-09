// src/pages/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem, createRequest } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchItem() {
      try {
        setLoading(true);
        const res = await getItem(id);
        if (!mounted) return;
        setItem(res.data);
        console.debug("[ItemDetails] loaded", res.data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || err.message || "Unable to load item"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchItem();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleRequest = async () => {
    try {
      setRequesting(true);
      const payload = { message: "Hi — can I borrow this for 3 days?" };
      const res = await createRequest(id, payload);
      setSuccessMsg(
        res?.data?.message || "Request created — owner will be notified"
      );
      console.debug("[ItemDetails] request response", res.data);
    } catch (err) {
      console.error("Request failed", err);
      setError(
        err?.response?.data?.message || err.message || "Unable to create request"
      );
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <Loading message="Loading item…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!item)
    return <div className="max-w-7xl mx-auto p-6">Item not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded shadow p-6">
        <div className="md:flex gap-6">
          <img
            src={item.image || "/placeholder-item.png"}
            alt={item.name || "Item"}
            className="w-full md:w-1/2 h-80 object-cover rounded"
          />
          <div className="mt-4 md:mt-0 md:flex-1">
            <h2 className="text-2xl font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {item.category || "Uncategorized"}
            </p>
            <p className="mt-4 text-gray-700">{item.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded text-sm ${
                  item.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.available ? "Available" : "Unavailable"}
              </span>

              <button
                onClick={handleRequest}
                disabled={!item.available || requesting}
                className="ml-auto btn-primary disabled:opacity-60"
              >
                {requesting ? "Requesting…" : "Request to Borrow"}
              </button>
            </div>

            {successMsg && (
              <div className="mt-4 text-green-700">{successMsg}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
