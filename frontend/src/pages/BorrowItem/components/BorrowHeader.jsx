// src/pages/BorrowItem/components/BorrowHeader.jsx
export default function BorrowHeader({ item }) {
  return (
    <div className="flex gap-4">
      <img
        src={item.imageUrls?.[0]}
        className="w-40 h-40 object-cover rounded-lg"
      />

      <div>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <p className="text-gray-600">{item.description}</p>
        <p className="mt-2 font-semibold">📍 {item.street}</p>
        <p className="mt-2 font-semibold"> {item.city}</p>
        <p className="mt-2 font-semibold"> {item.state}</p>
        <p className="mt-2 font-semibold">{item.pincode}</p>
        <p className="mt-2 font-semibold"> {item.country}</p>
      </div>
    </div>
  );
}