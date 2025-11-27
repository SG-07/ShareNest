// src/pages/Requests/MyRequests.jsx

import { useEffect, useState } from "react";
import { getMyRequests } from "../../services/api";
import MyRequestCard from "../Requests/MyRequestCard";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getMyRequests();
      console.log("🔍 /requests/my RAW:", res);

      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load my requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-gray-600">
        Loading your requests...
      </div>
    );

  if (requests.length === 0)
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold">No Requests Found</h2>
        <p className="text-gray-600 mt-2">
          You haven’t requested to borrow any items yet.
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">My Requests</h1>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <MyRequestCard key={req.id} req={req} refresh={load} />
        ))}
      </div>
    </div>
  );
}
