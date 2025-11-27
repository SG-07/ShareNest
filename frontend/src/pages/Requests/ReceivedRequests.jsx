// src/pages/Requests/ReceivedRequests.jsx

import { useEffect, useState } from "react";
import { getReceivedRequests } from "../../services/api";
import Loading from "../../components/common/Loading";
import { useNavigate } from "react-router-dom";
import { devLog } from "../../utils/devLog";

export default function ReceivedRequests() {
  const [groupedItems, setGroupedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    devLog("ReceivedRequests", "Calling getReceivedRequests()");
    try {
      const res = await getReceivedRequests();
      devLog("ReceivedRequests", "Raw response:", res);

      const raw = res.data || [];
      const grouped = {};

      raw.forEach((req) => {
        const itemId = req.item?.id;
        if (!itemId) return;

        if (!grouped[itemId]) {
          grouped[itemId] = {
            itemId,
            itemName: req.item.name,
            itemImage: req.item.image,
            requests: [],
          };
        }

        grouped[itemId].requests.push(req);
      });

      const finalGroups = Object.values(grouped);
      devLog("ReceivedRequests", "Grouped:", finalGroups);

      setGroupedItems(finalGroups);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Requests Received</h1>

      {groupedItems.length === 0 ? (
        <p className="text-gray-600">No requests received yet.</p>
      ) : (
        <div className="space-y-4">
          {groupedItems.map((g) => {
            const pending = g.requests.filter(r => r.status === "PENDING").length;
            const accepted = g.requests.filter(r => r.status === "ACCEPTED").length;
            const rejected = g.requests.filter(r => r.status === "REJECTED").length;
            const canceled = g.requests.filter(r => r.status === "CANCELED").length;

            return (
              <div
                key={g.itemId}
                className="border border-gray-300 p-4 rounded-lg bg-white shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={g.itemImage}
                    alt={g.itemName}
                    className="w-24 h-24 rounded object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{g.itemName}</h2>

                    <p>Total Requests: <strong>{g.requests.length}</strong></p>
                    <p>Pending: {pending}</p>
                    <p>Accepted: {accepted}</p>
                    <p>Rejected: {rejected}</p>
                    <p>Canceled: {canceled}</p>

                    <button
                      onClick={() => navigate(`/requests/item/${g.itemId}`, { state: g })}
                      className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View All Requests →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
