import { httpClient } from "@/lib/httpClient";

export const getBookings = async () => {
    const res = await httpClient.get('/bookings');
    return res.data;
};

export const getBookingById = async (id: number) => {
    const res = await httpClient.get(`/bookings/${id}`);
    return res.data;
};

export const createBooking = async (data: {
    userId: number
    vehicleId: number
    parkingLotId: number
    slotId: number
    checkinTime: string
}) => {
    const res = await httpClient.post('/bookings', data)
    return res.data
}

export const updateBooking = async (id: number, data: {
    userId?: number
    vehicleId?: number
    parkingLotId?: number
    slotId?: number
    checkinTime?: string
}) => {
    const res = await httpClient.patch(`/bookings/${id}`, data)
    return res.data
}

export const deleteBooking = async (id: number) => {
    const res = await httpClient.delete(`/bookings/${id}`)
    return res.data
}

export interface CreateBookingDto {
    userId: number;
    vehicleId: number;
    parkingLotId: number;
    slotId: number;
    checkinTime: string;
}

export interface UpdateBookingDto {
    userId?: number;
    vehicleId?: number;
    parkingLotId?: number;
    slotId?: number;
    checkinTime?: string;
}

export interface Booking {
    id: number;
    userId: number;
    vehicleId: number;
    parkingLotId: number;
    slotId: number;
    checkinTime: string;
    createdAt: Date;
    updatedAt: Date;
}
