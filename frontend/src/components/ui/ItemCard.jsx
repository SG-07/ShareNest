import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  if (!item) return null;

  // Read first image from imageUrls[]
  const img =
    item.imageUrls?.[0] ||
    item.image || // fallback for old items
    "/placeholder-item.png";

  const id = item.id || item._id;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link to={`/items/${id}`}>
        <img
          className="h-48 w-full object-cover"
          src={img}
          alt={item.name || "Item"}
        />
      </Link>

      <div className="p-4 flex flex-col h-full">
        <div>
          <h3 className="font-semibold text-lg truncate">
            <Link
              to={`/items/${id}`}
              className="hover:text-indigo-600 transition-colors"
            >
              {item.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">
            {item.category || "Miscellaneous"}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.available ? "Available" : "Unavailable"}
          </span>

          <Link
            to={`/items/${id}`}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
