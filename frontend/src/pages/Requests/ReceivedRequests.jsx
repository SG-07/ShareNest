// src/pages/Requests/ReceivedRequests.jsx

import { useEffect, useState } from "react";
import {
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
} from "../../services/api";
import Loading from "../../components/common/Loading";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";

export default function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      console.log("[DEBUG][ReceivedRequests] Calling getReceivedRequests()");
      const data = await getReceivedRequests();

      console.log("[DEBUG][ReceivedRequests] Raw response:", data);

      // If API returns axios response -> data.data
      const finalData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : data?.data?.content ?? data; // fallback if wrapped in content

      console.log("[DEBUG][ReceivedRequests] Parsed requests:", finalData);
      console.log("[DEBUG] Is array?", Array.isArray(finalData));

      setRequests(finalData);
    } catch (err) {
      console.error("[DEBUG][ReceivedRequests] ERROR:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(id) {
    try {
      toast.info(`Accepting request #${id}...`);
      await acceptRequest(id);
      toast.success("Request accepted!");
      loadRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request");
    }
  }

  async function handleReject(id) {
    try {
      toast.info(`Rejecting request #${id}...`);
      await rejectRequest(id);
      toast.success("Request rejected!");
      loadRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Requests Received</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No requests received yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{req.itemName}</h2>
                <p className="text-gray-600">
                  Borrower: <strong>{req.borrowerName}</strong>
                </p>

                <p className="text-gray-600">
                  Duration: {req.requestedFrom} → {req.requestedTill}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Requested on: {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 mt-3 md:mt-0">
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
                ) : req.status === "CANCELLED" ? (
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded">
                    Cancelled by borrower
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
