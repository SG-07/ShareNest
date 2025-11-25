// src/pages/AddItem/AddItem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem, uploadImage } from "../../services/api";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/Error";
import { devLog } from "../../utils/devLog";
import { toast } from "react-toastify";

/* Centralized Component Imports */
import {
  BasicDetails,
  PricingDetails,
  RentalRules,
  DeliveryOptions,
  ImageUploader,
  LocationPicker,
} from "./components";

export default function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    condition: "GOOD",
    available: true,
    pricePerDay: "",
    quantity: "",
    tags: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
    safetyNotes: "",
    deliveryOption: "PICKUP",
    deliveryCharge: "",
    minRentalDays: "",
    maxRentalDays: "",
    securityDeposit: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setField = (name, value) => {

    // Extra debug logs
    if (name === "tags") devLog("🏷 Tags Updated", value);
    if (name === "deliveryCharge") devLog("💰 Delivery Charge Updated", value);
    if (name === "deliveryOption") devLog("🚚 Delivery Option Updated", value);
    if (["street", "city", "state", "country", "pincode"].includes(name))
      devLog("📍 Address Updated", { [name]: value });

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    devLog("🔍 Validate", "Validation started", form);

    if (!form.name) return toast.error("Item name is required.");
    if (!form.pincode || !form.state || !form.country)
      return toast.error("Pincode, state and country are required.");

    if (!form.pricePerDay || Number(form.pricePerDay) <= 0)
      return toast.error("Price per day must be greater than 0.");

    if (!form.quantity || Number(form.quantity) <= 0)
      return toast.error("Quantity must be at least 1.");

    if (imageFiles.length < 1)
      return toast.error("Please upload at least 1 image.");
    if (imageFiles.length > 3)
      return toast.error("Maximum 3 images allowed.");

    if (form.minRentalDays && form.maxRentalDays) {
      if (Number(form.minRentalDays) > Number(form.maxRentalDays))
        return toast.error("Min rental duration cannot exceed max.");
    }

    if (["DELIVERY", "BOTH"].includes(form.deliveryOption)) {
      if (form.deliveryCharge === "" || Number(form.deliveryCharge) < 0)
        return toast.error("Invalid delivery charge.");
    }

    devLog("✔ Validate", "All validations passed");
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    devLog("📨 Submit", "Submit triggered");

    if (!validate()) {
      devLog("❌ Submit", "Validation failed → Submission stopped");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("jwtToken");

    if (!user || !token) {
      devLog("❌ Submit", "User not logged in");
      return toast.error("You must be logged in to add an item.");
    }

    setLoading(true);

    try {
      // Upload images
      const uploadedUrls = [];
      for (let f of imageFiles) {
        const url = await uploadImage(f);
        uploadedUrls.push(url);
      }

      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        condition: form.condition,
        available: form.available,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        imageUrls: uploadedUrls,
        pricePerDay: Number(form.pricePerDay),

        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],

        street: form.street,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: form.pincode,

        safetyNotes: form.safetyNotes,
        deliveryOption: form.deliveryOption,
        deliveryCharge:
          form.deliveryOption === "PICKUP"
            ? 0
            : Number(form.deliveryCharge || 0),

        minRentalDays: form.minRentalDays ? Number(form.minRentalDays) : null,
        maxRentalDays: form.maxRentalDays ? Number(form.maxRentalDays) : null,
        securityDeposit: form.securityDeposit
          ? Number(form.securityDeposit)
          : 0,

        quantity: Number(form.quantity),

        ownerId: user?.id || user?._id,
      };

      const res = await createItem(payload);

      toast.success("Item added successfully!");

      const itemId = res?.data?.id || res?.data?._id;

      navigate(itemId ? `/items/${itemId}` : "/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to create item";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Creating item…" />;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Add new item</h1>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <BasicDetails form={form} setField={setField} />
        <PricingDetails form={form} setField={setField} />
        <RentalRules form={form} setField={setField} />
        <DeliveryOptions form={form} setField={setField} />
        <LocationPicker form={form} setField={setField} />
        <ImageUploader files={imageFiles} onChangeFiles={setImageFiles} />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
