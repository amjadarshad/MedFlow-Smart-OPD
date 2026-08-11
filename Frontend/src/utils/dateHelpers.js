// Returns the next 7 days starting today, used for the Book Appointment
// Schedule step's date picker (BookAppointment.jsx)
export function getUpcomingDates() {
  const weekdayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      key: date.toISOString().slice(0, 10),
      weekday: weekdayFmt.format(date),
      day: date.getDate(),
      month: monthFmt.format(date),
    };
  });
}