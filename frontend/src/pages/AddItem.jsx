// src/pages/AddItem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import { devLog } from "../utils/devLog";

export default function AddItem() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    condition: "good",
    available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onFile = (e) => setImageFile(e.target.files?.[0] || null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      devLog("AddItem", "Sending item data to API", form, imageFile);
      const res = await createItem(fd);
      devLog("AddItem", "Item created successfully", res.data);

      const id = res?.data?.id || res?.data?._id;
      navigate(id ? `/items/${id}` : "/");
    } catch (err) {
      devLog("AddItem", "Failed to create item", err);
      console.error(err);
      setError(
        err?.response?.data?.message || err.message || "Failed to create item"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Creating item…" />;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Add new item</h1>

      {error && <ErrorBanner message={error} />}

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* form fields remain same */}
      </form>
    </div>
  );
}
