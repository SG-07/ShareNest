// src/pages/Borrow/components/MapPreview.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// fix icon paths (same as other pages)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function FlyToMarker({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos && map) {
      try {
        map.flyTo(pos, 13, { duration: 0.7 });
      } catch (e) {}
    }
  }, [pos, map]);
  return null;
}

export default function MapPreview({ latitude, longitude, radius = 100 }) {
  const center =
    latitude && longitude ? [Number(latitude), Number(longitude)] : [20.5937, 78.9629];

  if (!latitude || !longitude) {
    return (
      <div className="w-full h-48 rounded border bg-gray-50 flex items-center justify-center text-gray-500">
        Location not available
      </div>
    );
  }

  return (
    <div className="w-full h-48 rounded overflow-hidden border">
      <MapContainer center={center} zoom={13} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={center} />
        <Circle center={center} radius={radius} pathOptions={{ color: "blue" }} />
        <FlyToMarker pos={center} />
      </MapContainer>
    </div>
  );
}
