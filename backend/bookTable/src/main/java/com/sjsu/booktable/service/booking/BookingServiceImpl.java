package com.sjsu.booktable.service.booking;

import com.sjsu.booktable.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public Map<LocalTime, Integer> getBookedCapacitiesForSlotsForRestaurant(int restaurantId, LocalDate reservationDate, List<LocalTime> timeSlots) {
        Map<LocalTime, Integer> slotBookedMap = new HashMap<>();

        if(CollectionUtils.isEmpty(timeSlots)){
            return slotBookedMap;
        }

        return bookingRepository.getBookedCapacityForTimeSlotsForRestaurant(restaurantId, reservationDate, timeSlots);
    }
}
