// src/components/AddItem/ImageUploader.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { devLog } from "../../utils/devLog";

/**
 * Props:
 *  - files: File[]
 *  - onChangeFiles: (files: File[]) => void
 */
export default function ImageUploader({ files = [], onChangeFiles }) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    // generate object URLs
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const onSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }
    if (selected.length < 1) {
      toast.error("Please select at least 1 image.");
      return;
    }
    onChangeFiles(selected);
  };

  const removeAt = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChangeFiles(next);
    devLog("ImageUploader", "Removed image at", index);
  };

  return (
    <div>
      <label className="block font-medium mb-1">Upload Images (max 3)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onSelect}
        className="w-full"
      />

      {files.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {previews.map((p, i) => (
            <div key={i} className="relative border rounded overflow-hidden">
              <img src={p} alt={`preview-${i}`} className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white px-2 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
