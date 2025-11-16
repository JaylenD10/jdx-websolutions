"use client";
import { useState, useEffect, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  startOfDay,
  parseISO,
  getDay,
} from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendarBookingProps {
  value: {
    date: string;
    time: string;
  };
  onChange: (date: string, time: string) => void;
  consultationType?: "video" | "phone" | "in-person";
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({
  value,
  onChange,
  consultationType = "video",
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value.date ? parseISO(value.date) : null
  );
  const [selectedTime, setSelectedTime] = useState<string>(value.time || "");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  // Fetch blocked dates for the current month
  useEffect(() => {
    fetchBlockedDates();
  }, [currentMonth]);

  const fetchBlockedDates = async () => {
    try {
      // In production, this would fetch from your API
      // For now, we'll simulate some blocked dates
      const blocked: SetStateAction<string[]> = [
        // Example: Block weekends
        // You can modify this based on your business hours
      ];
      setBlockedDates(blocked);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    }
  };

  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const response = await fetch(`/api/consultation?date=${date}`);
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.slots);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      // Fallback slots for demo
      setAvailableSlots([
        { time: "09:00 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "11:00 AM", available: false },
        { time: "02:00 PM", available: true },
        { time: "03:00 PM", available: true },
        { time: "04:00 PM", available: false },
        { time: "05:00 PM", available: true },
      ]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
    const formattedDate = format(date, "yyyy-MM-dd");
    onChange(formattedDate, "");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      onChange(formattedDate, time);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the week for the month
  const firstDayOfWeek = getDay(monthStart);
  const leadingDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (firstDayOfWeek - i));
    return date;
  });

  // Get trailing days to complete the grid
  const totalCells = leadingDays.length + monthDays.length;
  const trailingDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const trailingDays = Array.from({ length: trailingDaysCount }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const allDays = [...leadingDays, ...monthDays, ...trailingDays];

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) return true;

    // Disable weekends (optional - remove if you work weekends)
    const dayOfWeek = getDay(date);
    if (dayOfWeek === 0 || dayOfWeek === 6) return true;

    // Check if date is in blocked dates
    const dateStr = format(date, "yyyy-MM-dd");
    if (blockedDates.includes(dateStr)) return true;

    return false;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Select Date
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Previous month"
              >
                <FaChevronLeft />
              </button>
              <span className="font-semibold min-w-[140px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Next month"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {allDays.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isDisabled = isDateDisabled(date);
              const isTodayDate = isToday(date);

              return (
                <motion.button
                  key={index}
                  whileHover={!isDisabled ? { scale: 1.05 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  onClick={() => !isDisabled && handleDateSelect(date)}
                  disabled={isDisabled}
                  className={`
                    relative p-3 rounded-lg transition-all
                    ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                    ${
                      isSelected
                        ? "bg-blue-600 text-white font-semibold"
                        : isTodayDate
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "hover:bg-gray-100"
                    }
                    ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  {format(date, "d")}
                  {isTodayDate && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded-sm" />
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-50 rounded-sm" />
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-sm" />
              <span className="text-gray-600">Unavailable</span>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold flex items-center mb-6">
            <FaClock className="mr-2 text-blue-600" />
            Select Time
            {selectedDate && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                for {format(selectedDate, "MMM d, yyyy")}
              </span>
            )}
          </h3>

          {!selectedDate ? (
            <div className="text-center py-12 text-gray-500">
              <FaCalendarAlt className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>Please select a date first</p>
            </div>
          ) : loadingSlots ? (
            <div className="text-center py-12">
              <FaSpinner className="text-4xl mx-auto mb-4 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading available times...</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No available time slots for this date</p>
              <p className="text-sm mt-2">Please select another date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {availableSlots.map((slot, index) => (
                  <motion.button
                    key={slot.time}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() =>
                      slot.available && handleTimeSelect(slot.time)
                    }
                    disabled={!slot.available}
                    className={`
                      p-3 rounded-lg border-2 transition-all font-medium
                      ${
                        selectedTime === slot.time
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : slot.available
                          ? "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                          : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    {slot.time}
                    {!slot.available && (
                      <span className="block text-xs mt-1">Booked</span>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Duration info */}
          {selectedDate && availableSlots.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Duration:</strong>{" "}
                {consultationType === "video" ? "60" : "30"} minutes
              </p>
              <p className="text-sm text-blue-800 mt-1">
                <strong>Type:</strong>{" "}
                {consultationType === "video"
                  ? "📹 Video Call"
                  : consultationType === "phone"
                  ? "📞 Phone Call"
                  : "🤝 In-Person Meeting"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected DateTime Summary */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-semibold">
                Selected Appointment:
              </p>
              <p className="text-lg text-green-900">
                {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
              </p>
            </div>
            <div className="text-green-600">
              <FaCalendarAlt className="text-2xl" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CalendarBooking;
