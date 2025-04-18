package com.sjsu.booktable.validator;

import com.sjsu.booktable.exception.restaurant.InvalidRestaurantRequestException;
import com.sjsu.booktable.exception.restaurant.PhotoUploadException;
import com.sjsu.booktable.model.dto.restaurant.HoursDto;
import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class RestaurantValidator {

    private static final Set<Integer> ALL_DAYS = IntStream.rangeClosed(0, 6).boxed().collect(Collectors.toSet());

    public void validateRestaurantRequest(RestaurantRequest request) {
        Map<Integer, HoursDto> hoursMap = buildHoursMap(request.getOperatingHours());
        Map<Integer, TimeSlotDto> slotsMap = buildSlotsMap(request.getTimeSlots());
        checkAllDaysPresent(hoursMap, "operating hours");
        checkAllDaysPresent(slotsMap, "time slots");
        validateTimeSlotsWithinHours(hoursMap, slotsMap);
    }

    public void validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !Set.of("image/jpeg", "image/jpg", "image/png").contains(contentType)) {
            throw new PhotoUploadException("Invalid file type. Only JPG, JPEG, or PNG allowed.", null);
        }
    }

    private Map<Integer, HoursDto> buildHoursMap(List<HoursDto> hours) {
        Map<Integer, HoursDto> map = new HashMap<>();
        for (HoursDto hour : hours) {
            if (map.put(hour.getDayOfWeek(), hour) != null) {
                throw new InvalidRestaurantRequestException("Duplicate day of week in operating hours: " + hour.getDayOfWeek());
            }
        }
        return map;
    }

    private Map<Integer, TimeSlotDto> buildSlotsMap(List<TimeSlotDto> slots) {
        Map<Integer, TimeSlotDto> map = new HashMap<>();
        for (TimeSlotDto slot : slots) {
            if (map.put(slot.getDayOfWeek(), slot) != null) {
                throw new InvalidRestaurantRequestException("Duplicate day of week in time slots: " + slot.getDayOfWeek());
            }
        }
        return map;
    }

    private void checkAllDaysPresent(Map<Integer, ?> map, String fieldName) {
        if (!map.keySet().containsAll(ALL_DAYS)) {
            Set<Integer> missingDays = ALL_DAYS.stream()
                    .filter(day -> !map.containsKey(day))
                    .collect(Collectors.toSet());
            throw new InvalidRestaurantRequestException("Missing days in " + fieldName + ": " + missingDays);
        }
    }

    private void validateTimeSlotsWithinHours(Map<Integer, HoursDto> hoursMap, Map<Integer, TimeSlotDto> slotsMap) {
        for (Map.Entry<Integer, TimeSlotDto> entry : slotsMap.entrySet()) {
            int day = entry.getKey();
            TimeSlotDto slot = entry.getValue();
            HoursDto hour = hoursMap.get(day);
            if (slot.getTimes().isEmpty()) continue; // Closed day

            LocalTime openTime = hour.getOpenTime();
            LocalTime closeTime = hour.getCloseTime();
            boolean isOvernight = closeTime.isBefore(openTime);

            for (LocalTime time : slot.getTimes()) {
                if (isOvernight) {
                    int prevDay = (day - 1 + 7) % 7; // Previous day
                    HoursDto prevHour = hoursMap.get(prevDay);

                    // Check if time belongs to previous day's overnight hours
                    if (time.isBefore(closeTime) || time.equals(closeTime)) {
                        if (prevHour == null || !prevHour.getCloseTime().isBefore(prevHour.getOpenTime())) {
                            throw new InvalidRestaurantRequestException("Slot time " + time + " outside operating hours for day " + day + " (no valid previous day overlap)");
                        }
                        if (time.isAfter(prevHour.getCloseTime()) && !time.equals(prevHour.getCloseTime())) {
                            throw new InvalidRestaurantRequestException("Slot time " + time + " outside operating hours for day " + day + " (previous day: " + prevDay + ")");
                        }
                        continue; // Valid overnight slot from previous day
                    }

                    // Check current day's hours (from openTime to midnight)
                    if (time.isBefore(openTime) || time.equals(LocalTime.MIDNIGHT)) {
                        throw new InvalidRestaurantRequestException("Slot time " + time + " outside operating hours for day " + day);
                    }
                } else {
                    // Non-overnight: time must be between openTime and closeTime (inclusive)
                    if (time.isBefore(openTime) || time.isAfter(closeTime)) {
                        throw new InvalidRestaurantRequestException("Slot time " + time + " outside operating hours for day " + day);
                    }
                }
            }
        }
    }
    
}