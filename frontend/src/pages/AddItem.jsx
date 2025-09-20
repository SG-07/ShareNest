// src/pages/AddItem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { createItem, geocodeAddress } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import { devLog } from "../utils/devLog";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Fix Leaflet icons not showing in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function AddItem() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    condition: "good",
    available: true,
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onFile = (e) => setImageFile(e.target.files?.[0] || null);

  // 📍 Ask backend API to geocode
  const handleGeocode = async () => {
    const address = `${form.street}, ${form.city}, ${form.state}, ${form.pincode}, ${form.country}`;
    try {
      const { lat, lon } = await geocodeAddress(address);
      setForm((f) => ({
        ...f,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }));
      devLog("AddItem", "Geocode success", lat, lon);
    } catch (err) {
      setError(err.message || "Failed to geocode address");
      devLog("AddItem", "Geocode failed", err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !form.street ||
      !form.city ||
      !form.state ||
      !form.country ||
      !form.pincode
    ) {
      setError("Please provide complete address.");
      return;
    }

    if (!form.latitude || !form.longitude) {
      await handleGeocode();
      if (!form.latitude || !form.longitude) return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      devLog("AddItem", "Sending item data to API", form, imageFile);
      const res = await createItem(fd);
      devLog("AddItem", "Item created successfully", res.data);

      const id = res?.data?.id || res?.data?._id;
      navigate(id ? `/items/${id}` : "/");
    } catch (err) {
      devLog("AddItem", "Failed to create item", err);
      setError(
        err?.response?.data?.message || err.message || "Failed to create item"
      );
    } finally {
      setLoading(false);
    }
  };

  // 📍 Draggable + Clickable marker
  const LocationMarker = () => {
    const [position, setPosition] = useState(
      form.latitude && form.longitude ? [form.latitude, form.longitude] : null
    );

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const confirmUpdate = window.confirm(
          "Do you want to set this as the item’s location?"
        );
        if (confirmUpdate) {
          setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
          setPosition([lat, lng]);
          devLog("AddItem", "Map clicked, location updated", lat, lng);
        }
      },
    });

    if (!position) return null;

    return (
      <>
        <Marker
          draggable={true}
          position={position}
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              setPosition([lat, lng]);
              setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
              devLog("AddItem", "Marker dragged, new position", lat, lng);
            },
          }}
        />
        {/* Highlight circle around pin */}
        <Circle center={position} radius={100} pathOptions={{ color: "blue" }} />
      </>
    );
  };

  if (loading) return <Loading message="Creating item…" />;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Add new item</h1>

      {error && <ErrorBanner message={error} />}

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* Basic Info */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Condition</label>
          <select
            name="condition"
            value={form.condition}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={onChange}
            className="mr-2"
          />
          <label>Available</label>
        </div>

        {/* 📍 Address */}
        <h2 className="text-lg font-semibold mt-4">Location</h2>
        <div>
          <label className="block font-medium mb-1">Street</label>
          <input
            type="text"
            name="street"
            value={form.street}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGeocode}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Locate on Map
        </button>

        {/* 📍 Map Preview */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Preview Location</h3>
          <MapContainer
            center={
              form.latitude && form.longitude
                ? [form.latitude, form.longitude]
                : [20.5937, 78.9629]
            }
            zoom={form.latitude && form.longitude ? 14 : 4}
            className="w-full h-72 rounded border"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>
          <p className="text-sm text-gray-500 mt-1">
            Click anywhere on the map to set the pin (confirmation required) or drag the marker to fine-tune.
          </p>
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="w-full"
          />
        </div>

        {/* Submit */}
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
