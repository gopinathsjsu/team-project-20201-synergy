// Expects exactly 10 digits and returns canonical string like "+16692121247"
export const formatUSPhoneNumber = (rawDigits) => {
  if (rawDigits.length !== 10) {
    return rawDigits; // or signal an error if desired
  }
  return `+1${rawDigits}`;
};

// Formats 10-digit number to a pretty display like "(669)-212-1359"
export const formatPhoneForDisplay = (rawDigits) => {
  if (rawDigits.length !== 10) {
    return rawDigits;
  }
  const area = rawDigits.slice(0, 3);
  const prefix = rawDigits.slice(3, 6);
  const line = rawDigits.slice(6);
  return `(${area})-${prefix}-${line}`;
};

// Converts a 24-hour time string ("HH:MM:SS") to a 12-hour format with AM/PM.
export const convert24To12 = (time24) => {
  if (!time24) return "";
  const [hourStr, minuteStr] = time24.split(":"); // ignore seconds
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

// Converts a 12-hour time string ("hh:mm AM/PM") to a 24-hour time string with seconds ("HH:MM:00").
export const convert12To24 = (time12) => {
  if (!time12) return "";
  // Expect format "hh:mm AM" or "hh:mm PM"
  const [time, modifier] = time12.split(" ");
  let [hour, minute] = time.split(":").map(Number);
  if (modifier === "PM" && hour !== 12) {
    hour += 12;
  }
  if (modifier === "AM" && hour === 12) {
    hour = 0;
  }
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:00`;
};

export const generateFullTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      const value = `${hh}:${mm}:00`;
      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;
      const ampm = h >= 12 ? "PM" : "AM";
      const display = `${hour12.toString().padStart(2, "0")}:${mm} ${ampm}`;
      options.push({ display, value });
    }
  }
  return options;
};

export const generateTimeSlotsBetween = (openTime, closeTime) => {
  // Helper: convert "HH:MM:SS" to total minutes.
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Helper: convert minutes back to "HH:MM:00"
  const toTimeString = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60) % 24; // wrap around midnight
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
  };

  // Convert open and close times.
  let openMins = toMinutes(openTime);
  let closeMins = toMinutes(closeTime);
  // Handle overnight (if closing time is less than or equal to opening time, add 24 hours)
  if (closeMins <= openMins) {
    closeMins += 24 * 60;
  }
  const slots = [];
  // Last valid slot is the one where slotTime + 30 <= closeMins.
  for (let t = openMins; t <= closeMins - 30; t += 30) {
    slots.push(toTimeString(t));
  }
  return slots;
};
