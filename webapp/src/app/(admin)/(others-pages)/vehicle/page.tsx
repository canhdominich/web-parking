import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VehicleDataTable from "@/components/vehicle/VehicleDataTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Parking Management System",
  description:
    "This is Parking Management System",
};

interface Vihecle {
  id: string;
  user: {
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  licensePlate: string;
  status: string;
  vehicleType: string;
  createdAt: string;
  updatedAt: string;
}

// Define the table data using the interface
const items: Vihecle[] = [
  {
    "id": "2",
    "user": {
      "name": "Backer",
      "phone": "0123456789",
      "email": "john@example.com1",
      "role": "ParkingGuest",
    },
    "licensePlate": "51F-12345",
    "vehicleType": "Motorbike",
    "status": "Active",
    "createdAt": "2025-05-11T03:08:26.093Z",
    "updatedAt": "2025-05-11T03:08:26.093Z"
  }
]

const headers = [
  {
    key: "user",
    title: "Chủ sở hữu"
  },
  {
    key: "licensePlate",
    title: "Biển số xe"
  },
  {
    key: "vehicleType",
    title: "Loại xe"
  },
  {
    key: "status",
    title: "Trạng thái"
  },
]

export default function Vehicles() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Quản lý xe cá nhân" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách xe">
          <VehicleDataTable headers={headers} items={items} />
        </ComponentCard>
      </div>
    </div>
  );
}
