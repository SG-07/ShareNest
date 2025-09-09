// src/components/common/Error.jsx
import React from 'react';

export default function ErrorBanner({ message = 'Something went wrong.' }) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3">
        <strong className="block font-medium">Error</strong>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
