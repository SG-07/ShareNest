// src/pages/Borrow/components/OwnerCard.jsx
import React from "react";

export default function OwnerCard({ owner = {} }) {
  // owner: { name, username, trustScore, responseTime, avatarUrl }
  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex items-center gap-3">
        <img
          src={owner.avatarUrl || "/avatar-placeholder.png"}
          alt={owner.name || owner.username || "Owner"}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="font-medium">{owner.name || owner.username || "Owner"}</div>
          <div className="text-sm text-gray-500">
            Trust: {owner.trustScore ?? "–"} · Response: {owner.responseTime ?? "–"} hrs
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button className="btn-primary w-full">Message owner</button>
      </div>
    </div>
  );
}
