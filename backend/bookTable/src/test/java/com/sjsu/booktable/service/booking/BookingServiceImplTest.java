package com.sjsu.booktable.service.booking;

import com.sjsu.booktable.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private LocalDate testDate;
    private List<LocalTime> testTimeSlots;

    @BeforeEach
    void setUp() {
        testDate = LocalDate.now();
        testTimeSlots = Arrays.asList(
                LocalTime.of(18, 0),
                LocalTime.of(19, 0),
                LocalTime.of(20, 0)
        );
    }

    @Test
    void getBookedCapacitiesForSlotsForRestaurant_EmptyTimeSlots() {
        // Arrange
        List<LocalTime> emptyTimeSlots = Collections.emptyList();

        // Act
        Map<LocalTime, Integer> result = bookingService.getBookedCapacitiesForSlotsForRestaurant(1, testDate, emptyTimeSlots);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getBookedCapacitiesForSlotsForRestaurant_NoBookings() {
        // Arrange
        when(bookingRepository.getBookedCapacityForTimeSlotsForRestaurant(anyInt(), any(), any()))
                .thenReturn(new HashMap<>());

        // Act
        Map<LocalTime, Integer> result = bookingService.getBookedCapacitiesForSlotsForRestaurant(1, testDate, testTimeSlots);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getBookedCapacitiesForSlotsForRestaurant_WithBookings() {
        // Arrange
        Map<LocalTime, Integer> expectedBookings = new HashMap<>();
        expectedBookings.put(LocalTime.of(18, 0), 4);
        expectedBookings.put(LocalTime.of(19, 0), 6);
        expectedBookings.put(LocalTime.of(20, 0), 2);

        when(bookingRepository.getBookedCapacityForTimeSlotsForRestaurant(anyInt(), any(), any()))
                .thenReturn(expectedBookings);

        // Act
        Map<LocalTime, Integer> result = bookingService.getBookedCapacitiesForSlotsForRestaurant(1, testDate, testTimeSlots);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(4, result.get(LocalTime.of(18, 0)));
        assertEquals(6, result.get(LocalTime.of(19, 0)));
        assertEquals(2, result.get(LocalTime.of(20, 0)));
    }
} 