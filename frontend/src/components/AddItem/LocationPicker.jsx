// src/components/AddItem/LocationPicker.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { geocodeAddress } from "../../services/api";
import { toast } from "react-toastify";
import { devLog } from "../../utils/devLog";

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

export default function LocationPicker({ form, setField }) {
  const handleGeocode = async () => {
    if (!form.pincode || !form.state || !form.country) {
      toast.error("Pincode, state and country required to locate on map.");
      return;
    }
    try {
      const { lat, lon } = await geocodeAddress(form.pincode.trim(), form.state.trim(), form.country.trim());
      setField("latitude", parseFloat(lat));
      setField("longitude", parseFloat(lon));
      devLog("LocationPicker", "Geocode success", lat, lon);
    } catch (err) {
      const msg = err?.message || "Failed to geocode address";
      devLog("LocationPicker", "Geocode failed", err);
      toast.error(msg);
    }
  };

  const LocationMarker = () => {
    const map = useMap();
    const position = form.latitude && form.longitude ? [Number(form.latitude), Number(form.longitude)] : null;

    useEffect(() => {
      if (position && map) {
        try { map.flyTo(position, 14, { duration: 0.7 }); } catch (err) {}
      }
    }, [position, map]);

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const confirmUpdate = window.confirm("Do you want to set this as the item’s location?");
        if (confirmUpdate) {
          setField("latitude", lat);
          setField("longitude", lng);
          devLog("LocationPicker", "Map clicked, location updated", lat, lng);
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
              setField("latitude", lat);
              setField("longitude", lng);
              devLog("LocationPicker", "Marker dragged, new position", lat, lng);
            },
          }}
        />
        <Circle center={position} radius={100} pathOptions={{ color: "blue" }} />
      </>
    );
  };

  return (
    <>
      <h2 className="text-lg font-semibold mt-4">Location</h2>

      <div>
        <label className="block font-medium mb-1">House/Colony</label>
        <input
          type="text"
          name="street"
          value={form.street}
          onChange={(e) => setField("street", e.target.value)}
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
            onChange={(e) => setField("city", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
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
            onChange={(e) => setField("country", e.target.value)}
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
            onChange={(e) => setField("pincode", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="mt-2">
        <button
          type="button"
          onClick={handleGeocode}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Locate on Map
        </button>
      </div>

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
        <p className="text-sm text-gray-500 mt-1">Click on map to set pin or drag the marker to fine-tune.</p>
      </div>
    </>
  );
}
