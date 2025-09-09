import { useState } from "react";

export default function ItemFilterBar({ onFilter }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");

  const handleChange = () => {
    onFilter({ query, category, availability });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
      {/* Search box */}
      <input
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onFilter({ query: e.target.value, category, availability });
        }}
        className="input w-full sm:w-1/3"
      />

      {/* Category filter */}
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          onFilter({ query, category: e.target.value, availability });
        }}
        className="input w-full sm:w-1/4"
      >
        <option value="">All Categories</option>
        <option value="Books">Books</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Misc">Misc</option>
      </select>

      {/* Availability filter */}
      <select
        value={availability}
        onChange={(e) => {
          setAvailability(e.target.value);
          onFilter({ query, category, availability: e.target.value });
        }}
        className="input w-full sm:w-1/4"
      >
        <option value="">All</option>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>
    </div>
  );
}
