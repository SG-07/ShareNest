// src/pages/BorrowItem/components/BorrowCalendar.jsx
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function BorrowCalendar({ item, dates, setDates }) {
  const unavailableRanges = item.unavailableDates || [];

  // Convert ranges into individual disabled days
  const disabledDates = [];
  unavailableRanges.forEach(([start, end]) => {
    let current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      disabledDates.push(new Date(current).toDateString());
      current.setDate(current.getDate() + 1);
    }
  });

  const disableDates = ({ date }) =>
    disabledDates.includes(date.toDateString());

  // Check array vs single date
  const startDate =
    Array.isArray(dates) && dates[0] ? dates[0] : null;
  const endDate =
    Array.isArray(dates) && dates[1] ? dates[1] : null;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Select Borrow Period</h2>

      <Calendar
        selectRange={true}
        onChange={setDates}
        minDate={new Date()}
        tileDisabled={disableDates}
      />

      {startDate && (
        <div className="mt-3 text-sm">
          <p>
            <strong>Start:</strong> {startDate.toDateString()}
          </p>

          {endDate && (
            <p>
              <strong>End:</strong> {endDate.toDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
