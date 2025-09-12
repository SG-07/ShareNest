// src/pages/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem, createRequest } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import { devLog } from "../utils/devLog";

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
        devLog("ItemDetails", `Fetching item ${id}`);
        const res = await getItem(id);
        if (!mounted) return;
        setItem(res.data);
        devLog("ItemDetails", "Item fetched", res.data);
      } catch (err) {
        devLog("ItemDetails", "Failed to fetch item", err);
        console.error(err);
        setError(
          err?.response?.data?.message || err.message || "Unable to load item"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchItem();
    return () => { mounted = false; };
  }, [id]);

  const handleRequest = async () => {
    try {
      setRequesting(true);
      const payload = { message: "Hi — can I borrow this for 3 days?" };
      devLog("ItemDetails", "Sending request", payload);
      const res = await createRequest(id, payload);
      setSuccessMsg(
        res?.data?.message || "Request created — owner will be notified"
      );
      devLog("ItemDetails", "Request response", res.data);
    } catch (err) {
      devLog("ItemDetails", "Request failed", err);
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
  if (!item) return <div className="max-w-7xl mx-auto p-6">Item not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* display code unchanged */}
    </div>
  );
}
