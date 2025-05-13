"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Select from "../form/Select";
import { CreateBookingDto, UpdateBookingDto, createBooking, updateBooking, deleteBooking } from "@/services/bookingService";
import { ParkingLot } from "@/services/parkingLotService";
import { ChevronDownIcon } from "@/icons";
import { getParkingSlotByParkingLotId, ParkingSlot } from "@/services/parkingSlotService";
import DatePicker from "../form/date-picker";
import { User } from "@/services/userService";
import { Vehicle } from "@/services/vehicleService";
import { getVehiclesByUser } from "@/services/vehicleService";
import toast from "react-hot-toast";
import { Booking } from "@/services/bookingService";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

interface BookingProps {
  onRefresh: () => void;
  bookings: Booking[];
  users: User[];
  vehicles: Vehicle[];
  parkingLots: ParkingLot[];
  parkingSlots: ParkingSlot[];
}

export default function BookingDataTable({ onRefresh, bookings, users, vehicles: initialVehicles, parkingLots, parkingSlots: initialParkingSlots }: BookingProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateBookingDto | UpdateBookingDto>({
    userId: 0,
    vehicleId: 0,
    parkingLotId: 0,
    slotId: 0,
    checkinTime: "",
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>(initialParkingSlots);
  const { isOpen, openModal, closeModal } = useModal();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedBooking(null);
      setFormData({
        userId: 0,
        vehicleId: 0,
        parkingLotId: 0,
        slotId: 0,
        checkinTime: "",
      });
      setVehicles(initialVehicles);
      setParkingSlots(initialParkingSlots);
    }
  }, [isOpen, initialVehicles, initialParkingSlots]);

  // Update form data and fetch related data when selected Booking changes
  useEffect(() => {
    if (selectedBooking) {
      setFormData({
        userId: selectedBooking.userId,
        vehicleId: selectedBooking.vehicleId,
        parkingLotId: selectedBooking.parkingLotId,
        slotId: selectedBooking.slotId,
        checkinTime: selectedBooking.checkinTime,
      });

      // Fetch vehicles for selected user
      const fetchUserVehicles = async () => {
        try {
          const userVehicles = await getVehiclesByUser(selectedBooking.userId);
          setVehicles(userVehicles);
        } catch (error) {
          toast.error("Không thể lấy danh sách phương tiện");
          setVehicles([]);
        }
      };

      // Fetch parking slots for selected parking lot
      const fetchParkingSlots = async () => {
        try {
          const slots = await getParkingSlotByParkingLotId(selectedBooking.parkingLotId);
          setParkingSlots(slots);
        } catch (error) {
          toast.error("Không thể lấy danh sách chỗ đỗ");
          setParkingSlots([]);
        }
      };

      fetchUserVehicles();
      fetchParkingSlots();
    }
  }, [selectedBooking]);

  const handleSelectUserChange = async (value: string) => {
    const userId = parseInt(value);
    setFormData({ ...formData, userId, vehicleId: 0 }); // Reset vehicleId when user changes

    try {
      const userVehicles = await getVehiclesByUser(userId);
      setVehicles(userVehicles);
    } catch (error) {
      toast.error("Không thể lấy danh sách phương tiện");
      setVehicles([]);
    }
  };

  const handleSelectVehicleChange = (value: string) => {
    setFormData({ ...formData, vehicleId: parseInt(value) });
  };

  const handleSelectParkingLotChange = async (value: string) => {
    const parkingLotId = parseInt(value);
    setFormData({ ...formData, parkingLotId, slotId: 0 }); // Reset slotId when parking lot changes

    try {
      const slots = await getParkingSlotByParkingLotId(parkingLotId);
      setParkingSlots(slots);
    } catch (error) {
      toast.error("Không thể lấy danh sách chỗ đỗ");
      setParkingSlots([]);
    }
  };

  const handleSelectParkingSlotChange = (value: string) => {
    setFormData({ ...formData, slotId: parseInt(value) });
  };

  const handleEdit = (Booking: Booking) => {
    setSelectedBooking(Booking);
    openModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (selectedBooking?.id) {
        await updateBooking(selectedBooking.id, formData as UpdateBookingDto);
        toast.success("Cập nhật đặt chỗ thành công");
      } else {
        await createBooking(formData as CreateBookingDto);
        toast.success("Đặt chỗ thành công");
      }
      closeModal();
      onRefresh();
    } catch {
      toast.error(selectedBooking?.id ? "Không thể cập nhật đặt chỗ" : "Không thể Đặt chỗ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (isSubmitting) return;

    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa đặt chỗ này?");
    if (!isConfirmed) return;

    try {
      setIsSubmitting(true);
      await deleteBooking(id);
      toast.success("Xóa đặt chỗ thành công");
      onRefresh();
    } catch {
      toast.error("Không thể xóa đặt chỗ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    // Initialize with some events
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
      {
        id: "3",
        title: "Workshop",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        extendedProps: { calendar: "Primary" },
      },
    ]);
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };

  const handleAddOrUpdateBooking = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
              ...event,
              title: formData.vehicleId.toString(),
              start: formData.slotId.toString(),
              end: formData.slotId.toString(),
              extendedProps: { calendar: formData.userId.toString() },
            }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: formData.vehicleId.toString(),
        start: formData.slotId.toString(),
        end: formData.slotId.toString(),
        allDay: true,
        extendedProps: { calendar: formData.userId.toString() },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
  };

  return (
    <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "",
          }}
          events={events}
          selectable={true}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Đặt chỗ +",
              click: openModal,
            },
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedBooking ? "Chỉnh sửa đặt chỗ" : "Đặt chỗ"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trải nghiệm ngay sự tiện lợi của đặt chỗ giữ xe thông minh – tiết kiệm thời gian, giảm stress!
            </p>
          </div>
          <div className="mt-8">
            <div className="mt-1">
              <div className="relative">
                <DatePicker
                  id="date-picker"
                  label="Ngày muốn đặt"
                  placeholder="Select a date"
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>
            </div>
            <div className="mb-8 mt-12">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Chọn khách gửi
              </label>
              <div className="relative">
                <Select
                  value={formData.userId?.toString() || ""}
                  options={users.map((user) => ({
                    value: user.id.toString(),
                    label: user.name,
                  }))}
                  onChange={handleSelectUserChange}
                  className="dark:bg-dark-900"
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="mb-8">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Chọn phương tiện
              </label>
              <div className="relative">
                <Select
                  value={formData.vehicleId?.toString() || ""}
                  options={vehicles.map((vehicle) => ({
                    value: vehicle.id.toString(),
                    label: vehicle.licensePlate,
                  }))}
                  onChange={handleSelectVehicleChange}
                  className="dark:bg-dark-900"
                  disabled={!formData.userId}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="mb-8">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Chọn bãi xe
              </label>
              <div className="relative">
                <Select
                  value={formData.parkingLotId?.toString() || ""}
                  options={parkingLots.map((lot) => ({
                    value: lot.id.toString(),
                    label: lot.name,
                  }))}
                  onChange={handleSelectParkingLotChange}
                  className="dark:bg-dark-900"
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="mb-8">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Chọn vị trí
              </label>
              <div className="relative">
                <Select
                  value={formData.slotId?.toString() || ""}
                  options={parkingSlots.map((slot) => ({
                    value: slot.id.toString(),
                    label: slot.name,
                  }))}
                  onChange={handleSelectParkingSlotChange}
                  className="dark:bg-dark-900"
                  disabled={!formData.parkingLotId}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              disabled={isSubmitting}
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {isSubmitting ? "Đang xử lý..." : selectedBooking ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

