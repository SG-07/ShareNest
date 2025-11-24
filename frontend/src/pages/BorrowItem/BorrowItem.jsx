// src/pages/BorrowItem/BorrowItem.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BorrowHeader from "./components/BorrowHeader";
import BorrowDetails from "./components/BorrowDetails";
import BorrowCalendar from "./components/BorrowCalendar";
import BorrowQuantity from "./components/BorrowQuantity";
import DeliveryOptions from "./components/DeliveryOptions";
import BorrowPaymentOptions from "./components/PaymentOptions";
import BorrowSummary from "./components/BorrowSummary";
import BorrowSubmit from "./components/BorrowSubmit";

import MapPreview from "./components/MapPreview";

import { getItem as getItemById } from "../../services/api";

import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import { toast } from "react-toastify";

export default function BorrowItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  // Calendar selected dates
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [quantity, setQuantity] = useState(1);

  const [deliveryOption, setDeliveryOption] = useState("PICKUP");

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  // address required only for HOME_DELIVERY
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [userMessage, setUserMessage] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          toast.error("Please login first.", { autoClose: 3000 });
          navigate("/login");
          return;
        }

        const res = await getItemById(itemId);
        setItem(res.data);
      } catch (err) {
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [itemId, navigate]);

  if (loading) return <Loading message="Loading item..." />;
  if (error) return <Error message={error} />;
  if (!item) return <Error message="Item not found." />;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16">
      {/* Item Info */}
      <BorrowHeader item={item} />
      <BorrowDetails item={item} />

      {/* Calendar */}
      <BorrowCalendar item={item} dates={dates} setDates={setDates} />

      {/* Quantity */}
      <BorrowQuantity
        item={item}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* Delivery Options */}
      <DeliveryOptions
        deliveryOption={deliveryOption}
        setDeliveryOption={setDeliveryOption}
        deliveryCharge={item.deliveryCharge}
        ownerDeliveryOption={item.deliveryOption}
        address={address}
        setAddress={setAddress}
      />

      {/* Map Preview */}
      <MapPreview
        latitude={item.latitude}
        longitude={item.longitude}
        radius={150}
      />

      {/* Payment Options */}
      <BorrowPaymentOptions
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* Message */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          Message to Owner (optional)
        </h2>
        <textarea
          className="w-full border rounded p-2"
          rows="3"
          placeholder="Any special instructions?"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        ></textarea>
      </div>

      {/* Summary */}
      <BorrowSummary
        item={item}
        dates={dates}
        quantity={quantity}
        deliveryOption={deliveryOption}
      />

      {/* Submit */}
      <BorrowSubmit
        item={item}
        dates={dates}
        quantity={quantity}
        deliveryOption={deliveryOption}
        paymentMethod={paymentMethod}
        address={address}
        userMessage={userMessage}
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
      />
    </div>
  );
}
