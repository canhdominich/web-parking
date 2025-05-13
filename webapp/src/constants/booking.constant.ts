export const BookingStatus = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Cancelled: "Cancelled",
};

export const BookingStatusOptions = [
  { value: BookingStatus.Pending, label: "Chờ xác nhận" },
  { value: BookingStatus.Confirmed, label: "Đã xác nhận" },
  { value: BookingStatus.Cancelled, label: "Đã hủy" },
];
