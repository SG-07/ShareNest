// src/pages/UpdateItem/UpdateItem.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BasicDetails from "./components/BasicDetails";
import PricingDetails from "./components/PricingDetails";
import DeliveryOptions from "./components/DeliveryOptions";
import LocationPicker from "./components/LocationPicker";
import RentalRules from "./components/RentalRules";
import ImageUploader from "./components/ImageUploader";

import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";

import { getItem, updateItem } from "../../services/api";
import { toast } from "react-toastify";

export default function UpdateItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    condition: "GOOD",

    pricePerDay: "",
    securityDeposit: "",
    deliveryCharge: 0,
    deliveryOption: "PICKUP",

    latitude: "",
    longitude: "",
    city: "",
    state: "",
    country: "",
    street: "",
    pincode: "",

    minRentalDays: 1,
    maxRentalDays: 30,
    availableFrom: "",

    rules: "",
    unavailableDates: [],
    images: [],
    tags: "",
    quantity: 1,
  });

  // ------------------------------------------------------------
  // Load item data from backend
  // ------------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await getItem(itemId);

        setForm({
          ...res.data,

          condition: res.data.condition || "GOOD",

          images: res.data.imageUrls || [],

          // Convert array → comma string for input field
          tags: Array.isArray(res.data.tags)
            ? res.data.tags.join(", ")
            : "",

          unavailableDates: res.data.notAvailable || [],
        });
      } catch (e) {
        setError("Unable to load item");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [itemId]);

  // ------------------------------------------------------------
  // Build safe backend payload
  // ------------------------------------------------------------
  function buildPayload() {
    return {
      name: form.name,
      description: form.description,
      category: form.category,
      condition: (form.condition || "GOOD").toUpperCase(),

      imageUrls: form.images || [],

      // Convert comma string → array
      tags:
        Array.isArray(form.tags)
          ? form.tags
          : (form.tags || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),

      latitude: Number(form.latitude),
      longitude: Number(form.longitude),

      city: form.city,
      state: form.state,
      country: form.country,
      street: form.street,
      pincode: form.pincode,

      pricePerDay: Number(form.pricePerDay),
      securityDeposit: Number(form.securityDeposit),
      deliveryCharge: Number(form.deliveryCharge),

      quantity: form.quantity || 1,
      availableFrom: form.availableFrom || null,

      minRentalDays: Number(form.minRentalDays || 1),
      maxRentalDays: Number(form.maxRentalDays || 30),

      deliveryOption: form.deliveryOption,

      notAvailable: (form.unavailableDates || []).map((d) => ({
        startDate: d.startDate || d.start,
        endDate: d.endDate || d.end,
      })),
    };
  }

  // ------------------------------------------------------------
  // Confirm update and submit
  // ------------------------------------------------------------
  async function confirmUpdate() {
    const payload = buildPayload();

    console.log("📤 SENDING PAYLOAD TO BACKEND:");
    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await updateItem(itemId, payload);

      console.log("📥 BACKEND RESPONSE:");
      console.log(JSON.stringify(response.data, null, 2));

      toast.success("Item updated successfully!");
      navigate(`/items/${itemId}`);
    } catch (err) {
      console.error("❌ UPDATE FAILED");
      console.log("Error object:", err);

      if (err.response) {
        console.log("🔥 BACKEND ERROR RESPONSE DATA:");
        console.log(JSON.stringify(err.response.data, null, 2));
        console.log("📛 Status Code:", err.response.status);
        console.log("📛 Headers:", err.response.headers);
      } else if (err.request) {
        console.log("⚠️ No response received from backend:", err.request);
      } else {
        console.log("⚠️ Request setup error:", err.message);
      }

      toast.error("Update failed. Please try again.");
    } finally {
      setShowConfirmModal(false);
    }
  }

  if (loading) return <Loading message="Loading item..." />;
  if (error) return <Error message={error} />;

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <>
      <div className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
        <h1 className="text-2xl font-semibold">Update Item</h1>

        <BasicDetails form={form} setForm={setForm} />
        <PricingDetails form={form} setForm={setForm} />
        <DeliveryOptions form={form} setForm={setForm} />
        <LocationPicker form={form} setForm={setForm} />
        <RentalRules form={form} setForm={setForm} />
        <ImageUploader form={form} setForm={setForm} />

        {/* Side–by–side buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Update Item
          </button>

          <button
            onClick={() => navigate(`/items/${itemId}`)}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ---------- Modal ---------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-lg font-semibold mb-3">
              Are you sure you want to update this item?
            </h2>

            <p className="text-sm text-gray-600 mb-5">
              This will overwrite the existing details.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---------- End Modal ---------- */}
    </>
  );
}
