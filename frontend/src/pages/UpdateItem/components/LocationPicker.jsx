// src/pages/UpdateItem/components/LocationPicker.jsx

import LocationPickerBase from "../../AddItem/components/LocationPicker";

export default function LocationPicker({ form, setForm }) {

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="font-semibold text-lg mb-2">Pickup Location</h2>

      <LocationPickerBase
        form={form}
        setField={setField}
      />
    </div>
  );
}
