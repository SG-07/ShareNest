// src/pages/BorrowItem/components/BorrowCalendar.jsx
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarOverrides.css";

export default function BorrowCalendar({ item, dates, setDates }) {
  const unavailableRanges = item.unavailableDateRanges || [];

  // Convert unavailable date ranges → list of disabled days
  const disabledDates = [];
  unavailableRanges.forEach((range) => {
    const start = new Date(range.start);
    const end = new Date(range.end);

    let curr = new Date(start);
    while (curr <= end) {
      disabledDates.push(curr.toDateString());
      curr.setDate(curr.getDate() + 1);
    }
  });

  const disableDates = ({ date }) =>
    disabledDates.includes(date.toDateString());

  const isValidDate = (d) => d instanceof Date && !isNaN(d);

  let startDate = null;
  let endDate = null;

  if (Array.isArray(dates)) {
    startDate = isValidDate(dates[0]) ? dates[0] : null;
    endDate = isValidDate(dates[1]) ? dates[1] : null;
  } else {
    startDate = isValidDate(dates) ? dates : null;
  }

  const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (normalize(endDate) - normalize(startDate)) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <h2 className="font-semibold text-lg mb-4 text-gray-800">
        Select Borrow Period
      </h2>

      {/* ➜ Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT → Calendar */}
        <div className="flex justify-center">
          <Calendar
            selectRange={true}
            onChange={setDates}
            minDate={new Date()}
            tileDisabled={disableDates}
            tileClassName={({ date }) => {
              if (disabledDates.includes(date.toDateString())) {
                return "unavailable-date";
              }
            }}
          />
        </div>

        {/* RIGHT → Date Summary */}
        <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg flex flex-col justify-center">
          <h3 className="font-semibold text-gray-700 mb-4 text-lg">
            Selection Summary
          </h3>

          {!startDate && (
            <p className="text-gray-500 text-sm">
              Select a start and end date from the calendar.
            </p>
          )}

          {startDate && (
            <p className="text-gray-700 mb-3">
              <strong className="text-gray-900">Start Date:</strong>
              <br />
              {startDate.toDateString()}
            </p>
          )}

          {endDate && (
            <p className="text-gray-700 mb-3">
              <strong className="text-gray-900">End Date:</strong>
              <br />
              {endDate.toDateString()}
            </p>
          )}

          {startDate && endDate && (
            <p className="text-gray-700 mt-3 p-3 text-sm bg-white rounded-md border w-fit shadow-sm">
              <strong className="text-gray-900">Total Days:</strong>{" "}
              <span className="text-blue-600 font-semibold">
                {totalDays} day(s)
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
