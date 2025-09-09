// src/components/ui/ItemCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  if (!item) return null;

  const img = item.image || '/placeholder-item.png';

  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <img className="h-48 w-full object-cover" src={img} alt={item.name} />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category || 'Misc'}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-sm font-medium ${item.available ? 'text-green-600' : 'text-red-600'}`}>
            {item.available ? 'Available' : 'Unavailable'}
          </span>
          <Link to={`/items/${item.id || item._id}`} className="text-indigo-600 hover:underline text-sm">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
