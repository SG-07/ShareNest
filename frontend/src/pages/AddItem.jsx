// src/pages/AddItem/AddItem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem, uploadImage } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import { devLog } from "../utils/devLog";
import { toast } from "react-toastify";

/* Components */
import BasicDetails from "../components/AddItem/BasicDetails";
import PricingDetails from "../components/AddItem/PricingDetails";
import RentalRules from "../components/AddItem/RentalRules";
import CalendarSection from "../components/AddItem/CalendarSection";
import DeliveryOptions from "../components/AddItem/DeliveryOptions";
import ImageUploader from "../components/AddItem/ImageUploader";
import LocationPicker from "../components/AddItem/LocationPicker";

export default function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    condition: "GOOD",
    available: true,
    pricePerDay: "",
    tags: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",

    // NEW fields
    availableFrom: "",
    availableUntil: "",
    safetyNotes: "",
    deliveryOption: "PICKUP", // PICKUP | DELIVERY | BOTH
    deliveryCharge: "",
    minRentalDays: "",
    maxRentalDays: "",
    securityDeposit: "",
  });

  // images managed here (parent performs upload)
  const [imageFiles, setImageFiles] = useState([]); // File[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // generic field updater used by children
  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name) {
      toast.error("Item name is required.");
      return false;
    }
    if (!form.pincode || !form.state || !form.country) {
      toast.error("Pincode, state and country are required.");
      return false;
    }
    if (!form.pricePerDay || Number(form.pricePerDay) <= 0) {
      toast.error("Price per day must be greater than 0.");
      return false;
    }
    if (form.minRentalDays && form.maxRentalDays) {
      if (Number(form.minRentalDays) > Number(form.maxRentalDays)) {
        toast.error(
          "Min rental duration cannot be greater than max rental duration."
        );
        return false;
      }
    }
    if (form.deliveryOption === "DELIVERY" || form.deliveryOption === "BOTH") {
      if (form.deliveryCharge === "" || Number(form.deliveryCharge) < 0) {
        toast.error("Please provide a valid delivery charge.");
        return false;
      }
    }
    if (imageFiles.length < 1) {
      toast.error("Please upload at least 1 image.");
      return false;
    }
    if (imageFiles.length > 3) {
      toast.error("Maximum 3 images allowed.");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("jwtToken");
    if (!user || !token) {
      toast.error("You must be logged in to add an item.");
      return;
    }

    setLoading(true);
    try {
      devLog("API", "Uploading images to Cloudinary…");
      const uploadedImageUrls = [];
      for (let file of imageFiles) {
        const url = await uploadImage(file);
        devLog("AddItem", "Image uploaded:", url);
        uploadedImageUrls.push(url);
      }

      const itemPayload = {
        name: form.name,
        description: form.description,
        category: form.category,
        condition: form.condition,
        available: form.available,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        imageUrls: uploadedImageUrls,
        pricePerDay: Number(form.pricePerDay),
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        street: form.street,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: form.pincode,

        // new fields
        availableFrom: form.availableFrom || null,
        availableUntil: form.availableUntil || null,
        safetyNotes: form.safetyNotes || "",
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

        ownerId: user?.id || user?._id,
      };

      devLog("AddItem", "Sending item data to API", itemPayload);
      const res = await createItem(itemPayload);
      devLog("AddItem", "Item created successfully", res.data);

      toast.success("Item added successfully!");
      const id = res?.data?.id || res?.data?._id;
      navigate(id ? `/items/${id}` : "/");
    } catch (err) {
      devLog("AddItem", "Failed to create item", err);
      const msg =
        err?.response?.data?.message || err.message || "Failed to create item";
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

        <div>
          <label className="block font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={(e) => setField("tags", e.target.value)}
            placeholder="e.g., electric machine, tools, drill"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add multiple tags separated by commas.
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="available"
            checked={!!form.available}
            onChange={(e) => setField("available", e.target.checked)}
            className="mr-2"
          />
          <label>Available</label>
        </div>

        <LocationPicker form={form} setField={setField} />

        <CalendarSection form={form} setField={setField} />

        <RentalRules form={form} setField={setField} />

        <DeliveryOptions form={form} setField={setField} />

        <ImageUploader files={imageFiles} onChangeFiles={setImageFiles} />

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}
