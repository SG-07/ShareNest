// src/pages/BorrowItem/components/BorrowCalendar.jsx
import Calendar from "react-calendar";

export default function BorrowCalendar({ item, dates, setDates }) {
  const unavailable = item.unavailableDates || [];

  const disableDates = ({ date }) =>
    unavailable.some(
      (blocked) =>
        new Date(blocked).toDateString() === date.toDateString()
    );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Select Borrow Period</h2>

      <Calendar
        selectRange={true}
        onChange={setDates}
        minDate={new Date()}
        tileDisabled={disableDates}
      />

      {dates && (
        <div className="mt-3 text-sm">
          <p>
            <strong>Start:</strong> {dates[0].toDateString()}
          </p>
          <p>
            <strong>End:</strong> {dates[1].toDateString()}
          </p>
        </div>
      )}
    </div>
  );
}