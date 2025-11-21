// src/pages/BorrowItem/BorrowItem.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BorrowHeader from "./components/BorrowHeader";
import BorrowDetails from "./components/BorrowDetails";
import BorrowCalendar from "./components/BorrowCalendar";
import BorrowQuantity from "./components/BorrowQuantity";
import BorrowDeliveryOptions from "./components/DeliveryOptions";
import BorrowPaymentOptions from "./components/PaymentOptions";
// import BorrowDiscount from "./components/BorrowDiscount";
// import BorrowFees from "./components/BorrowFees";
import BorrowSummary from "./components/BorrowSummary";
import BorrowSubmit from "./components/BorrowSubmit";

import { getItem as getItemById } from "../../services/api";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import { toast } from "react-toastify";

export default function BorrowItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [dates, setDates] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("online");

  // NEW — Address object for home delivery
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  // NEW — Message to owner
  const [userMessage, setUserMessage] = useState("");

  // COMMENTED OUT – discount, tax, service fee
  // const [discountCode, setDiscountCode] = useState("");
  // const [appliedDiscount, setAppliedDiscount] = useState(0);
  // const [extraFees, setExtraFees] = useState({ tax: 0, serviceFee: 0 });

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

        // COMMENTED OUT – fees logic
        // setExtraFees({
        //   tax: 0.05,
        //   serviceFee: 0
        // });

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

      <BorrowHeader item={item} />
      <BorrowDetails item={item} />

      <BorrowCalendar
        item={item}
        dates={dates}
        setDates={setDates}
      />

      <BorrowQuantity
        item={item}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      <BorrowDeliveryOptions
        deliveryOption={deliveryOption}
        setDeliveryOption={setDeliveryOption}
        address={address}
        setAddress={setAddress}
      />

      <BorrowPaymentOptions
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* Message to owner */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Message to Owner (optional)</h2>
        <textarea
          className="w-full border rounded p-2"
          rows="3"
          placeholder="Any special instructions?"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        ></textarea>
      </div>

      <BorrowSummary
        item={item}
        dates={dates}
        quantity={quantity}
        deliveryOption={deliveryOption}
      />

      <BorrowSubmit
        item={item}
        dates={dates}
        quantity={quantity}
        deliveryOption={deliveryOption}
        paymentMethod={paymentMethod}
        address={address}
        userMessage={userMessage}
      />
    </div>
  );
}
