// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { getItems } from '../services/api';
import Loading from '../components/common/Loading';
import ErrorBanner from '../components/common/Error';
import ItemCard from '../components/ui/ItemCard';

export default function Home() {
  const [items, setItems] = useState([]);
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
        console.debug('[Home] loaded items:', (res.data || []).length);
      } catch (err) {
        console.error('Failed to fetch items', err);
        setError(err?.response?.data?.message || err.message || 'Unable to load items');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchItems();
    return () => (mounted = false);
  }, []);

  if (loading) return <Loading message="Loading catalog..." />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catalog</h1>
        <div>
          {/* later: search / filter controls go here */}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No items yet — try adding one!</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <ItemCard key={it.id || it._id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
