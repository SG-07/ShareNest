// src/components/items/ItemInfoCard.jsx

export default function ItemInfoCard({ item }) {
  console.log("🟦 [ItemInfoCard] Received item:", item);

  if (!item) {
    console.log("🟥 [ItemInfoCard] No item received");
    return null;
  }

  // Support both real item objects and grouped-requests objects
  const mainImage =
    item.image ||
    item.itemImage ||              // from grouped response
    "/placeholder-item.png";

  const itemName =
    item.name ||
    item.itemName ||              // from grouped response
    "Unnamed Item";

  const securityDeposit =
    item.securityDeposit ||
    item.securityDeposit ||
    item.securityDeposit ||
    (item.item ? item.item.securityDeposit : undefined);

  console.log("🟦 [ItemInfoCard] image:", item.image);
  console.log("🟦 [ItemInfoCard] itemImage:", item.itemImage);
  console.log("🟩 [ItemInfoCard] mainImage being rendered:", mainImage);

  return (
    <div className="bg-white rounded shadow p-5 mb-6">
      <div className="md:flex gap-6">

        {/* Main Image */}
        <div className="w-full md:w-1/2">
          <img
            src={mainImage}
            alt={itemName}
            className="w-full h-72 object-cover rounded"
          />
        </div>

        {/* Item Info */}
        <div className="mt-4 md:mt-0 md:flex-1">

          {/* Name */}
          <h2 className="text-xl font-semibold">{itemName}</h2>

          {/* Description */}
          {item.description && (
            <p className="mt-3 text-gray-700">{item.description}</p>
          )}

          {/* Status */}
          {item.available !== undefined && (
            <span
              className={`inline-block mt-4 px-3 py-1 rounded text-sm ${
                item.available
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.available ? "Available" : "Unavailable"}
            </span>
          )}

          {/* Pricing */}
          <div className="mt-4 text-gray-700">
            {item.pricePerDay !== undefined && (
              <p><strong>Price/Day:</strong> ₹{item.pricePerDay}</p>
            )}

            {securityDeposit !== undefined && (
              <p><strong>Security Deposit:</strong> ₹{securityDeposit}</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
