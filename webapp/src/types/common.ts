export interface Header {
    key: string;
    title: string;
}

export interface RowData {
    id: number;
    [key: string]: any
}

export interface BasicTableProps {
    headers: Header[];
    items: RowData[];
}

export interface User {
    image: string;
    name: string;
    role: string;
}

export interface Team {
    images: string[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface FullParkingSlot {
    id: string;
    name: string;
    parkingLotId: string;
    vehicleType: 'Motorbike' | 'Car' | string;
    status: 'Available' | 'Occupied' | string;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
  
    parkingLot: {
      id: string;
      name: string;
      location: string;
      openTime: string;
      closeTime: string;
      totalSlots: number;
      createdAt: string;
      updatedAt: string;
    };
  
    booking?: {
      id: string;
      userId: string;
      vehicleId: string;
      parkingLotId: string;
      slotId: string;
      checkinTime: string;
      checkoutTime: string | null;
      status: 'CheckedIn' | 'CheckedOut' | string;
      totalPrice: string;
      paymentStatus: 'Paid' | 'Unpaid' | string;
      createdAt: string;
      updatedAt: string;
  
      user: {
        id: string;
        name: string;
        phone: string;
        email: string;
        password: string;
        role: 'ParkingGuest' | 'Admin' | string;
        createdAt: string;
        updatedAt: string;
      };
  
      vehicle: {
        id: string;
        userId: string;
        licensePlate: string;
        model: string;
        color: string;
        vehicleType: 'Motorbike' | 'Car' | string;
        status: 'Active' | 'Inactive' | string;
        createdAt: string;
        updatedAt: string;
      };
    };
  }
  