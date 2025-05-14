export const BookingStatus = {
  Booked: "Booked",
  CheckedIn: "CheckedIn",
  CheckedOut: "CheckedOut",
  Cancelled: "Cancelled",
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];

export const BookingStatusOptions = [
  { value: BookingStatus.Booked, label: "Đã đặt chỗ" },
  { value: BookingStatus.CheckedIn, label: "Đã check-in" },
  { value: BookingStatus.CheckedOut, label: "Đã check-out" },
  { value: BookingStatus.Cancelled, label: "Đã hủy" },
];

export const BookingPaymentStatus = {
  Unpaid: "Unpaid",
  Paid: "Paid",
};


