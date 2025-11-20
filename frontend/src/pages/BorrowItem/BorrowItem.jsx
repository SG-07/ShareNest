// src/pages/BorrowItem/BorrowItem.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BorrowHeader from "./components/BorrowHeader";
import BorrowDetails from "./components/BorrowDetails";
import BorrowCalendar from "./components/BorrowCalendar";
import BorrowQuantity from "./components/BorrowQuantity";
import BorrowDeliveryOptions from "./components/DeliveryOptions";
import BorrowPaymentOptions from "./components/PaymentOptions";
import BorrowDiscount from "./components/BorrowDiscount";
import BorrowFees from "./components/BorrowFees";
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
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [extraFees, setExtraFees] = useState({ tax: 0, serviceFee: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------
  // Load item data
  // --------------------------
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

        // Set service fees defaults
        setExtraFees({
          tax: 0.05,           // 5% GST
          serviceFee: 0       // Flat fee
        });

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

      {/* Item hero header (image gallery + title + rating) */}
      <BorrowHeader item={item} />

      {/* Address, distance, category, condition, owner profile */}
      <BorrowDetails item={item} />

      {/* Calendar (select borrow range) */}
      <BorrowCalendar
        item={item}
        dates={dates}
        setDates={setDates}
      />

      {/* Quantity selection (if item supports quantity) */}
      <BorrowQuantity
        item={item}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* Delivery / pickup options */}
      <BorrowDeliveryOptions
        deliveryOption={deliveryOption}
        setDeliveryOption={setDeliveryOption}
      />

      {/* Payment selection */}
      <BorrowPaymentOptions
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* Discount coupon input */}
      <BorrowDiscount
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
      />

      {/* Fees (tax, service fee, security deposit) */}
      <BorrowFees
        item={item}
        extraFees={extraFees}
        setExtraFees={setExtraFees}
      />

      {/* Final calculated price breakdown */}
      <BorrowSummary
        item={item}
        dates={dates}
        quantity={quantity}
        deliveryOption={deliveryOption}
        extraFees={extraFees}
        appliedDiscount={appliedDiscount}
      />

      {/* Submit request */}
      <BorrowSubmit
        item={item}
        dates={dates}
        quantity={quantity}
        deliveryOption={deliveryOption}
        paymentMethod={paymentMethod}
        appliedDiscount={appliedDiscount}
        extraFees={extraFees}
      />
    </div>
  );
}
