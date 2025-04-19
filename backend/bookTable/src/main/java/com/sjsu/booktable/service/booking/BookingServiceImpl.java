package com.sjsu.booktable.service.booking;

import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.dto.booking.BookingResponseDTO;
import com.sjsu.booktable.model.entity.Booking;
import com.sjsu.booktable.model.enums.Role;
import com.sjsu.booktable.repository.BookingRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;

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
    public String createBooking(BookingRequestDTO bookingRequest) {
        String booking = bookingRepository.saveBooking(bookingRequest);
        return booking;
    }

    @Override
    public Map<LocalTime, Integer> getBookedCapacitiesForSlotsForRestaurant(int restaurantId, LocalDate reservationDate, List<LocalTime> timeSlots) {
        Map<LocalTime, Integer> slotBookedMap = new HashMap<>();

        if(CollectionUtils.isEmpty(timeSlots)){
            return slotBookedMap;
        }

        return bookingRepository.getBookedCapacityForTimeSlotsForRestaurant(restaurantId, reservationDate, timeSlots);
    }
}
