export enum UserRole {
  Admin = "Admin",
  ParkingStaff = "ParkingStaff",
  ParkingGuest = "ParkingGuest",
} 

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export const UserStatusOptions = [
  { value: UserStatus.Active, label: "Active" },
  { value: UserStatus.Inactive, label: "Inactive" },
];

export const UserRoleOptions = [
  { value: UserRole.Admin, label: "Quản trị viên" },
  { value: UserRole.ParkingStaff, label: "Nhân viên bãi xe" },
  { value: UserRole.ParkingGuest, label: "Khách gửi xe" },
];

