// src/pages/BorrowItem/components/BorrowSubmit.jsx

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../../services/api";

export default function BorrowSubmit({
  item,
  dates,
  quantity,
  deliveryOption,
  paymentMethod,
  address,
  userMessage,
}) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!dates) {
      toast.error("Please select a date range.", { autoClose: 2500 });
      return;
    }

    if (deliveryOption === "delivery") {
      if (
        !address.street ||
        !address.city ||
        !address.state ||
        !address.country ||
        !address.pincode
      ) {
        toast.error("Please fill all delivery address details.", {
          autoClose: 2500,
        });
        return;
      }
    }

    const payload = {
      itemId: item.id,

      startDate: dates[0].toISOString().split("T")[0],
      endDate: dates[1].toISOString().split("T")[0],

      quantity,

      deliveryOption:
        deliveryOption === "pickup" ? "PICKUP" : "HOME_DELIVERY",

      deliveryAddress:
        deliveryOption === "pickup"
          ? null
          : {
              street: address.street,
              city: address.city,
              state: address.state,
              country: address.country,
              pincode: address.pincode,
            },

      paymentMethod: paymentMethod.toUpperCase(),

      message: userMessage || "",
      acceptTerms: true,
    };

    // 🌟 DEBUG LOGS
    console.log("📦 Borrow Request Payload:", payload);
    console.log("➡️ Sending Request for Item:", item.id);

    try {
      const res = await createRequest(item.id, payload);

      // Response Log
      console.log("✅ Backend Response:", res);

      toast.success("Borrow request submitted!", { autoClose: 2500 });

      setTimeout(() => {
        navigate("/dashboard/requests/sent");
      }, 1200);
    } catch (err) {
      console.error("❌ Request Error:", err);

      toast.error(
        err?.response?.data?.message || "Failed to submit request!",
        { autoClose: 3000 }
      );
    }
  };

  return (
    <button
      className="btn btn-primary w-full py-3 text-lg"
      onClick={handleSubmit}
    >
      Send Borrow Request
    </button>
  );
}
