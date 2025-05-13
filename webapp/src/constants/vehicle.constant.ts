export enum VehicleType {
  Car = "Car",
  Motorbike = "Motorbike",
  Bicycle = "Bicycle",
}

export enum VehicleStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export const VehicleStatusOptions = [
  { value: VehicleStatus.Active, label: "Active" },
  { value: VehicleStatus.Inactive, label: "Inactive" },
];

export const VehicleTypeOptions = [
  { value: VehicleType.Car, label: "Ô tô" },
  { value: VehicleType.Motorbike, label: "Xe máy" },
  { value: VehicleType.Bicycle, label: "Xe đạp" },
];



