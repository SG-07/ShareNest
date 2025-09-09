// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-indigo-600 hover:underline">Back to catalog</Link>
    </div>
  );
}
