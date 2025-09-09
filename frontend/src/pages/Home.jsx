// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getItems } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import ItemCard from "../components/ui/ItemCard";

// 🔹 small filter bar component (kept inline for simplicity)
function ItemFilterBar({ onFilter }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
      {/* Search */}
      <input
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onFilter({ query: v, category, availability });
        }}
        className="input w-full sm:w-1/3"
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => {
          const v = e.target.value;
          setCategory(v);
          onFilter({ query, category: v, availability });
        }}
        className="input w-full sm:w-1/4"
      >
        <option value="">All Categories</option>
        <option value="Books">Books</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Misc">Misc</option>
      </select>

      {/* Availability */}
      <select
        value={availability}
        onChange={(e) => {
          const v = e.target.value;
          setAvailability(v);
          onFilter({ query, category, availability: v });
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

export default function Home() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ query: "", category: "", availability: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchItems() {
      try {
        setLoading(true);
        const res = await getItems();
        if (!mounted) return;
        setItems(res.data || []);
        console.debug("[Home] loaded items:", (res.data || []).length);
      } catch (err) {
        console.error("Failed to fetch items", err);
        setError(err?.response?.data?.message || err.message || "Unable to load items");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchItems();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loading message="Loading catalog..." />;
  if (error) return <ErrorBanner message={error} />;

  // 🔹 Apply filtering
  const filteredItems = items.filter((item) => {
    const matchQuery =
      !filters.query ||
      item.name?.toLowerCase().includes(filters.query.toLowerCase());
    const matchCategory =
      !filters.category || item.category === filters.category;
    const matchAvailability =
      !filters.availability ||
      (filters.availability === "true" ? item.available : !item.available);

    return matchQuery && matchCategory && matchAvailability;
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catalog</h1>
      </div>

      {/* 🔹 Filter Bar */}
      <ItemFilterBar onFilter={setFilters} />

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No items found — try different filters!
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((it) => (
            <ItemCard key={it.id || it._id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
