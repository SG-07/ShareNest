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
  appliedDiscount,
  extraFees,
}) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!dates) {
      toast.error("Please select a date range.", { autoClose: 2500 });
      return;
    }

    const payload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      quantity,
      deliveryOption,
      paymentMethod,
      discount: appliedDiscount,
      fees: extraFees,
    };

    try {
      const res = await createRequest(item.id, payload);

      toast.success("Borrow request submitted!", { autoClose: 2500 });

      setTimeout(() => {
        navigate("/"); // go to home page
      }, 1200);

    } catch (err) {
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
