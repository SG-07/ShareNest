// src/pages/Borrow/components/ImageCarousel.jsx
import React from "react";

export default function ImageCarousel({ images = [], alt = "Item" }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  // Simple carousel: show first image with thumbnails below
  return (
    <div>
      <div className="w-full h-64 rounded overflow-hidden bg-gray-100">
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex gap-2">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${alt} ${idx + 1}`}
              className="w-20 h-20 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
