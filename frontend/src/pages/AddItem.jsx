// src/pages/AddItem.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { createItem, geocodeAddress, uploadImage } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import { devLog } from "../utils/devLog";
import { toast } from "react-toastify";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet icons not showing in React
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
    condition: "GOOD",
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

  // Geocode using only pincode + state + country
  const handleGeocode = async () => {
    setError(null);
    if (!form.pincode || !form.state || !form.country) {
      setError("Please provide pincode, state and country to locate on map.");
      toast.error("Pincode, state and country required!", { autoClose: 3000 });
      return;
    }
    try {
      const { lat, lon } = await geocodeAddress(
        form.pincode.trim(),
        form.state.trim(),
        form.country.trim()
      );
      setForm((f) => ({
        ...f,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }));
      devLog("AddItem", "Geocode success", lat, lon);
    } catch (err) {
      const msg = err?.message || "Failed to fetch location.";
      setError(msg);
      devLog("AddItem", "Geocode failed", err);
      toast.error(msg, { autoClose: 3000 });
    }
  };

  // Submit item
  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!form.name) {
      toast.error("Item name is required.", { autoClose: 3000 });
      return;
    }
    if (!form.pincode || !form.state || !form.country) {
      setError("Please provide pincode, state and country.");
      toast.error("Please provide pincode, state and country.", {
        autoClose: 3000,
      });
      return;
    }
    if (!imageFile) {
      toast.error("Please upload an image for the item.", { autoClose: 3000 });
      return;
    }

    // Check authentication
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("jwtToken");
    if (!user || !token) {
      toast.error("You must be logged in to add an item.", { autoClose: 3000 });
      return;
    }

    if (!form.latitude || !form.longitude) {
      await handleGeocode();
      if (!form.latitude || !form.longitude) {
        // geocode failed
        return;
      }
    }

    try {
      setLoading(true);

      // Upload image (required)
      devLog("API", "Uploading image to Cloudinary…");
      const imageUrl = await uploadImage(imageFile);
      devLog("AddItem", "Image uploaded, url:", imageUrl);

      // Prepare payload with ownerId
      const itemPayload = {
        name: form.name,
        description: form.description,
        category: form.category,
        condition: form.condition,
        available: form.available,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        imageUrl,
        street: form.street,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: form.pincode,
        ownerId: user?.id || user?._id, // ✅ added ownerId from logged-in user
      };

      devLog("AddItem", "Sending item data to API", itemPayload);
      const res = await createItem(itemPayload);
      devLog("AddItem", "Item created successfully", res.data);

      toast.success("Item added successfully!", { autoClose: 3000 });

      const id = res?.data?.id || res?.data?._id;
      setTimeout(() => {
        navigate(id ? `/items/${id}` : "/");
      }, 700);
    } catch (err) {
      devLog("AddItem", "Failed to create item", err);
      const msg =
        err?.response?.data?.message || err.message || "Failed to create item";
      setError(msg);
      toast.error(msg, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Marker logic
  const LocationMarker = () => {
    const map = useMap();

    const position =
      form.latitude && form.longitude
        ? [Number(form.latitude), Number(form.longitude)]
        : null;

    useEffect(() => {
      if (position && map) {
        try {
          map.flyTo(position, 14, { duration: 0.7 });
        } catch (err) {}
      }
    }, [position, map]);

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const confirmUpdate = window.confirm(
          "Do you want to set this as the item’s location?"
        );
        if (confirmUpdate) {
          setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
          devLog("AddItem", "Map clicked, location updated", lat, lng);
        }
      },
    });

    if (!position) return null;

    return (
      <>
        <Marker
          draggable
          position={position}
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
              devLog("AddItem", "Marker dragged, new position", lat, lng);
            },
          }}
        />
        <Circle
          center={position}
          radius={100}
          pathOptions={{ color: "blue" }}
        />
      </>
    );
  };

  if (loading) return <Loading message="Creating item…" />;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Add new item</h1>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
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
            <option value="NEW">New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
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

        {/* Address */}
        <h2 className="text-lg font-semibold mt-4">Location</h2>

        <div>
          <label className="block font-medium mb-1">House/Colony</label>
          <input
            type="text"
            name="street"
            value={form.street}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
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

        {/* Map Preview */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Preview Location</h3>
          <MapContainer
            center={
              form.latitude && form.longitude
                ? [Number(form.latitude), Number(form.longitude)]
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
            Click on map to set pin or drag the marker to fine-tune.
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
            required
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
