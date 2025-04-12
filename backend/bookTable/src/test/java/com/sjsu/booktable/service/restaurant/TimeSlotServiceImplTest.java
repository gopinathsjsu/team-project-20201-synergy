package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;
import com.sjsu.booktable.repository.TimeSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TimeSlotServiceImplTest {

    @Mock
    private TimeSlotRepository timeSlotRepository;

    @InjectMocks
    private TimeSlotServiceImpl timeSlotService;

    private List<TimeSlotDto> timeSlots;

    @BeforeEach
    void setUp() {
        timeSlots = Arrays.asList(
                TimeSlotDto.builder()
                        .dayOfWeek(1)
                        .times(Arrays.asList(
                                LocalTime.of(11, 0),
                                LocalTime.of(12, 0)
                        ))
                        .build(),
                TimeSlotDto.builder()
                        .dayOfWeek(2)
                        .times(Arrays.asList(
                                LocalTime.of(13, 0),
                                LocalTime.of(14, 0)
                        ))
                        .build()
        );
    }

    @Test
    void addTimeSlots_Success() {
        // Act
        timeSlotService.addTimeSlots(1, timeSlots);

        // Assert
        verify(timeSlotRepository).insertTimeSlots(eq(1), eq(timeSlots));
    }

    @Test
    void replaceTimeSlots_Success() {
        // Act
        timeSlotService.replaceTimeSlots(1, timeSlots);

        // Assert
        verify(timeSlotRepository).deleteByRestaurantId(1);
        verify(timeSlotRepository).insertTimeSlots(eq(1), eq(timeSlots));
    }

    @Test
    void getTimeSlotsForRestaurantAndDay_Success() {
        // Arrange
        List<LocalTime> expectedTimes = Arrays.asList(
                LocalTime.of(11, 0),
                LocalTime.of(12, 0)
        );
        when(timeSlotRepository.getTimeSlotsByRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(expectedTimes);

        // Act
        TimeSlotDto result = timeSlotService.getTimeSlotsForRestaurantAndDay(1, 1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getDayOfWeek());
        assertEquals(2, result.getTimes().size());
        assertTrue(result.getTimes().contains(LocalTime.of(11, 0)));
        assertTrue(result.getTimes().contains(LocalTime.of(12, 0)));
    }

    @Test
    void getTimeSlotsForRestaurantAndDay_EmptyList() {
        // Arrange
        when(timeSlotRepository.getTimeSlotsByRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(null);

        // Act
        TimeSlotDto result = timeSlotService.getTimeSlotsForRestaurantAndDay(1, 1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getDayOfWeek());
        assertTrue(result.getTimes().isEmpty());
    }
} 