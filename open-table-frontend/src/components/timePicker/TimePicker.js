import React, { useMemo } from "react";
import { TextField, MenuItem } from "@mui/material";
import dayjs from "dayjs";

const TimeSelect = ({
  value,
  onChange,
  label = "Select Time",
  daySlots = null,
  selectedDate = null,
}) => {
  // Generate time options based on daySlots (if provided) or default range
  const timeOptions = useMemo(() => {
    // Check if the selected date is today
    const isToday =
      selectedDate &&
      dayjs(selectedDate).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

    // Current hour and minute (only relevant if today)
    const currentHour = isToday ? dayjs().hour() : 0;
    const currentMinute = isToday ? dayjs().minute() : 0;

    // Add 30 min buffer for today's bookings
    let minHour = currentHour;
    let minMinute = currentMinute + 30;

    if (minMinute >= 60) {
      minHour += 1;
      minMinute -= 60;
    }

    // If daySlots is provided, format and use those specific slots
    if (daySlots && Array.isArray(daySlots) && daySlots.length > 0) {
      return (
        daySlots
          .map((timeString) => {
            // Handle different time formats (HH:MM or HH:MM:SS)
            const timeParts = timeString.split(":");
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);

            // Convert to 12-hour format for display
            const h12 = hours % 12 === 0 ? 12 : hours % 12;
            const ampm = hours < 12 ? "AM" : "PM";
            const label = `${h12}:${minutes
              .toString()
              .padStart(2, "0")} ${ampm}`;

            // Keep original value in 24-hour format
            const value = `${String(hours).padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`;

            return { label, value, hours, minutes };
          })
          // Filter out elapsed slots if today
          .filter((slot) => {
            if (!isToday) return true;

            if (slot.hours > minHour) return true;
            if (slot.hours === minHour && slot.minutes >= minMinute)
              return true;
            return false;
          })
          // Remove hours and minutes from final result
          .map(({ label, value }) => ({ label, value }))
      );
    }

    // Default time slots from 8:00 AM to 10:00 PM in 30-minute increments
    const slots = [];
    // Start time for the time slots: default is 8AM, but for today use current time + buffer
    const startHour = isToday ? Math.max(8, minHour) : 8;
    const startMinute = isToday && startHour === minHour ? minMinute : 0;

    // Round to nearest 30-minute slot
    const roundedStartMinute = Math.ceil(startMinute / 30) * 30;
    let effectiveStart = startHour * 60 + roundedStartMinute;
    if (roundedStartMinute === 60) {
      effectiveStart = (startHour + 1) * 60;
    }

    // End time (10PM)
    const endTime = 22 * 60;

    // Generate the slots
    for (let mins = effectiveStart; mins <= endTime; mins += 30) {
      const h24 = Math.floor(mins / 60);
      const m = mins % 60;
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      const ampm = h24 < 12 ? "AM" : "PM";
      const label = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
      const value = `${String(h24).padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      slots.push({ label, value });
    }

    return slots;
  }, [daySlots, selectedDate]);

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        width: 200, // fixed width
        "& .MuiOutlinedInput-root": {
          height: 56, // fixed height
        },
        // optional: vertically center the select text
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      {timeOptions.length > 0 ? (
        timeOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No available time slots today</MenuItem>
      )}
    </TextField>
  );
};

export default TimeSelect;
