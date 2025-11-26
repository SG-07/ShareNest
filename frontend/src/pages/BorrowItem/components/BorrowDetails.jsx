// src/pages/BorrowItem/components/BorrowDetails.jsx
import { useEffect, useState } from "react";

export default function BorrowDetails({ item }) {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Calculate user <-> item distance
    navigator.geolocation.getCurrentPosition((pos) => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      const distanceKm = getDistance(
        userLat,
        userLng,
        item.location.lat,
        item.location.lng
      );
      setDistance(distanceKm.toFixed(1));
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-1">
      <p className="text-lg font-semibold">₹{item.pricePerDay}/day</p>
      <p>Security Deposit: ₹{item.securityDeposit}</p>
      {distance && <p>Distance: {distance} km away</p>}
      <p>Min Days: {item.minRentalDays}</p>
      <p>Max Days: {item.maxRentalDays}</p>
    </div>
  );
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}