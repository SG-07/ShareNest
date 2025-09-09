// src/components/common/Loading.jsx
import React from 'react';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-indigo-500 mx-auto" />
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
