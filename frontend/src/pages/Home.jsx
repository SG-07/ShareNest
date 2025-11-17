// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getItems } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorBanner from "../components/common/Error";
import ItemCard from "../components/ui/ItemCard";
import { useSearch } from "../context/SearchContext";
import { devLog } from "../utils/devLog"; 

function ItemFilterBar({ onFilter }) {
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <select
        value={category}
        onChange={(e) => {
          const v = e.target.value;
          setCategory(v);
          onFilter({ category: v, availability });
          devLog("Filter changed:", { category: v, availability });
        }}
        className="input w-full sm:w-1/4"
      >
        <option value="">All Categories</option>
        <option value="Books">Books</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Misc">Misc</option>
      </select>

      <select
        value={availability}
        onChange={(e) => {
          const v = e.target.value;
          setAvailability(v);
          onFilter({ category, availability: v });
          devLog("Availability filter changed:", v);
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
  const { query } = useSearch();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ category: "", availability: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchItems() {
      try {
        setLoading(true);
        devLog("Fetching items from API...");
        const res = await getItems();
        devLog("Items fetched:", res.data);
        if (!mounted) return;
        setItems(res.data || []);
      } catch (err) {
        devLog("Error fetching items:", err);
        setError(err?.response?.data?.message || err.message || "Unable to load items");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchItems();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loading message="Loading catalog..." />;
  if (error) return <ErrorBanner message={error} />;

  const filteredItems = items.filter((item) => {
    const matchQuery = !query || item.name?.toLowerCase().includes(query.toLowerCase());
    const matchCategory = !filters.category || item.category === filters.category;
    const matchAvailability =
      !filters.availability ||
      (filters.availability === "true" ? item.available : !item.available);

    return matchQuery && matchCategory && matchAvailability;
  });

  devLog("Filtered items to display:", filteredItems);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Catalog</h1>
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
