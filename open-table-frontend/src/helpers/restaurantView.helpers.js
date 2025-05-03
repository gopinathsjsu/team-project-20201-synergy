import dayjs from "dayjs";

/**
 * Given a selectedTime ("HH:mm") and an array of validSlots (["08:00", "08:30", …]),
 * return up to 5 slots centered on the selected one.
 */
export function getSuggestedTimeSlots(selectedTime, validSlots, range = 2) {
  const idx = validSlots.findIndex((slot) => slot === selectedTime);
  if (idx < 0) return [];
  const start = Math.max(0, idx - range);
  const end = Math.min(validSlots.length - 1, idx + range);
  return validSlots.slice(start, end + 1);
}

/**
 * Returns the current time rounded _down_ to the nearest half hour,
 * in "HH:mm" format. E.g. 08:17 → "08:00", 08:45 → "08:30"
 */
export const currentFormattedTime = () => {
  const now = dayjs();
  const roundedMinute = now.minute() < 30 ? 0 : 30;
  return now.minute(roundedMinute).second(0).format("HH:mm");
};

/**
 * For a given `selectedDate` (a dayjs object),
 * pull that day’s slots out of your `restaurant.time_slots` and
 * compute the suggested window around `selectedTime`.
 *
 * @param {Dayjs} selectedDate
 * @param {"HH:mm"} selectedTime
 * @param {Object} restaurant
 * @returns {{ todaySlots: string[], suggestedSlots: string[] }}
 */
export const getValidAndSuggestedSlotsDaySlots = (
  selectedDate,
  selectedTime,
  restaurant
) => {
  const dayOfWeek = selectedDate?.day();
  const todaySlots =
    restaurant?.time_slots?.find((ts) => ts.day_of_week === dayOfWeek)?.times ||
    [];

  const suggestedSlots = getSuggestedTimeSlots(selectedTime, todaySlots);
  return { todaySlots, suggestedSlots };
};
