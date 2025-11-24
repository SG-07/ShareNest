// src/pages/ItemDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItem } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import { devLog } from "../utils/devLog";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");

  // ✔ Clean owner detection (your backend ALWAYS returns ownerId)
  const isOwner = loggedInUser?.id === item?.ownerId;

  // Fetch Item
  useEffect(() => {
    let mounted = true;

    async function fetchItem() {
      try {
        setLoading(true);
        devLog("📦 ItemDetails → Fetching item:", id);

        const res = await getItem(id);
        if (!mounted) return;

        const data = res.data;
        devLog("📦 ItemDetails → Response:", data);

        devLog("🟨 ownerId:", data.ownerId);
        devLog("🟥 loggedInUser:", loggedInUser);

        setItem(data);

        setMainImage(
          data.imageUrls?.length > 0
            ? data.imageUrls[0]
            : "/placeholder-item.png"
        );
      } catch (err) {
        devLog("❌ ItemDetails → Fetch failed:", err);

        setError(
          err?.response?.data?.message || err.message || "Unable to load item"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchItem();
    return () => (mounted = false);
  }, [id]);

  // Navigate to Borrow Page
  const goToBorrowPage = () => {
    devLog("➡️ Navigating to borrow page:", `/borrow/${id}`);
    navigate(`/borrow/${id}`);
  };

  // Navigate to Update Page
  const goToUpdatePage = () => {
    devLog("➡️ Navigating to update page:", `/update/${id}`);
    navigate(`/update/${id}`);
  };

  // UI STATES
  if (loading) return <Loading message="Loading item…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!item) return <div className="max-w-7xl mx-auto p-6">Item not found</div>;

  // UI
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded shadow p-6">
        <div className="md:flex gap-6">

          {/* Main Image */}
          <div className="w-full md:w-1/2">
            <img
              src={mainImage}
              alt={item.name}
              className="w-full h-80 object-cover rounded"
            />

            {/* Thumbnails */}
            {item.imageUrls?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {item.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Thumbnail ${idx}`}
                    className={`h-20 w-20 object-cover rounded cursor-pointer border ${
                      mainImage === url
                        ? "border-indigo-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
                      devLog("🖼 Selected Image:", url);
                      setMainImage(url);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Item Info */}
          <div className="mt-4 md:mt-0 md:flex-1">
            <h2 className="text-2xl font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
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

              {/* Owner vs Borrower Button */}
              {isOwner ? (
                <button
                  onClick={goToUpdatePage}
                  className="ml-auto btn-primary"
                >
                  Update Item
                </button>
              ) : (
                <button
                  onClick={goToBorrowPage}
                  disabled={!item.available}
                  className="ml-auto btn-primary disabled:opacity-60"
                >
                  Request to Borrow
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
