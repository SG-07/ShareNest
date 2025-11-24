// src/pages/UpdateItem/components/ImageUploader.jsx

export default function ImageUploader({ form, setForm }) {
  function handleUpload(files) {
    const newFiles = Array.from(files);
    setForm({ ...form, images: [...form.images, ...newFiles] });
  }

  function removeImage(index) {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="font-semibold text-lg mb-2">Images</h2>

      <input type="file" multiple onChange={(e) => handleUpload(e.target.files)} />

      <div className="grid grid-cols-3 gap-3 mt-3">
        {form.images?.map((img, i) => (
          <div key={i} className="relative border rounded overflow-hidden">
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt=""
              className="w-full h-24 object-cover"
            />
            <button
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
              onClick={() => removeImage(i)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
