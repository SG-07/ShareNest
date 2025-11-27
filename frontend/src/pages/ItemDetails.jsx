// src/pages/ItemDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItem, toggleItemStatus, deleteItem } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import { toast } from "react-toastify";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwner = loggedInUser?.id === item?.ownerId;

  /* Fetch Item */
  useEffect(() => {
    let mounted = true;

    async function fetchItem() {
      try {
        setLoading(true);
        const res = await getItem(id);
        if (!mounted) return;

        const data = res.data;
        setItem(data);

        setMainImage(
          data.imageUrls?.length > 0
            ? data.imageUrls[0]
            : "/placeholder-item.png"
        );
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load item");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchItem();
    return () => (mounted = false);
  }, [id]);

  /* Navigation */
  const goToBorrowPage = () => navigate(`/borrow/${id}`);
  const goToUpdatePage = () => navigate(`/update/${id}`);

  /* Confirm Toggle */
  const handleToggleConfirm = async () => {
    try {
      setUpdating(true);
      toast.info("Updating item status…");

      const res = await toggleItemStatus(id);

      setItem((prev) => ({
        ...prev,
        available: res.data.available,
      }));

      toast.success(
        res.data.available ? "Item activated!" : "Item deactivated!"
      );
    } catch (err) {
      toast.error("Failed to update item status");
    } finally {
      setUpdating(false);
      setShowToggleModal(false);
    }
  };

  /* DELETE Item Completely */
  const handleDeleteItem = async () => {
    try {
      setUpdating(true);
      toast.info("Deleting item…");

      await deleteItem(id);

      toast.success("Item deleted successfully!");
      navigate("/my-items");
    } catch (err) {
      toast.error("Failed to delete item");
    } finally {
      setUpdating(false);
      setShowDeleteModal(false);
    }
  };

  /* -----------------------------------
     UI STATES
  ----------------------------------- */
  if (loading) return <Loading message="Loading item…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!item) return <div className="max-w-7xl mx-auto p-6">Item not found</div>;

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
                    onClick={() => setMainImage(url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Panel */}
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

              {isOwner ? (
                <div className="ml-auto flex gap-3">

                  {/* Toggle Status */}
                  <button
                    onClick={() => setShowToggleModal(true)}
                    disabled={updating}
                    className={`px-4 py-2 rounded border text-sm ${
                      item.available
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    } disabled:opacity-60`}
                  >
                    {item.available ? "Deactivate" : "Activate"}
                  </button>

                  {/* Update */}
                  <button
                    onClick={goToUpdatePage}
                    className="btn-primary"
                  >
                    Update
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black"
                  >
                    Delete
                  </button>

                </div>
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

      {/* ------------------------------
          TOGGLE MODAL
      ------------------------------ */}
      {showToggleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">

            <h2 className="text-xl font-semibold mb-3">
              {item.available ? "Deactivate Item" : "Activate Item"}
            </h2>

            <p className="text-gray-700 mb-6">
              Are you sure you want to {item.available ? "deactivate" : "activate"} this item?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowToggleModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleToggleConfirm}
                disabled={updating}
                className={`px-4 py-2 rounded text-white ${
                  item.available ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {item.available ? "Yes, Deactivate" : "Yes, Activate"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------
          DELETE MODAL
      ------------------------------ */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">

            <h2 className="text-xl font-semibold mb-3 text-red-700">
              Delete Item
            </h2>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Do you want to <strong>deactivate</strong> this item or
              <strong> permanently delete</strong> it?  
              <br /><br />
              ⚠️ <strong>Deleted items cannot be recovered.</strong>
            </p>

            <div className="flex justify-between gap-3">

              {/* CLOSE */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              {/* DEACTIVATE OPTION */}
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setShowToggleModal(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Deactivate Instead
              </button>

              {/* DELETE OPTION */}
              <button
                onClick={handleDeleteItem}
                disabled={updating}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Permanently
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
