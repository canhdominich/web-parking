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
  { value: VehicleType.Car, label: "Car" },
  { value: VehicleType.Motorbike, label: "Motorbike" },
  { value: VehicleType.Bicycle, label: "Bicycle" },
];



