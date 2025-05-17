export enum BookingStatus {
  Pending = 'Pending',
  Booked = 'Booked',
  CheckedIn = 'CheckedIn',
  CheckedOut = 'CheckedOut',
  Cancelled = 'Cancelled',
}

export enum BookingPaymentStatus {
  Unpaid = 'Unpaid',
  Paid = 'Paid',
}

export const BookingStatusOptions = [
  { value: BookingStatus.Pending, label: 'Chờ xác nhận' },
  { value: BookingStatus.Booked, label: 'Đã xác nhận' },
  { value: BookingStatus.CheckedIn, label: 'Đã check-in' },
  { value: BookingStatus.CheckedOut, label: 'Đã check-out' },
  { value: BookingStatus.Cancelled, label: 'Đã hủy' },
];

export const BookingPaymentStatusOptions = [
  { value: BookingPaymentStatus.Unpaid, label: 'Chưa thanh toán' },
  { value: BookingPaymentStatus.Paid, label: 'Đã thanh toán' },
];
