package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.restaurant.RestaurantException;
import com.sjsu.booktable.model.dto.restaurant.HoursDto;
import com.sjsu.booktable.model.entity.RestaurantHours;
import com.sjsu.booktable.repository.RestaurantHoursRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Time;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestaurantHoursServiceImplTest {

    @Mock
    private RestaurantHoursRepository restaurantHoursRepository;

    @InjectMocks
    private RestaurantHoursServiceImpl restaurantHoursService;

    private List<HoursDto> hours;
    private RestaurantHours restaurantHours;

    @BeforeEach
    void setUp() {
        // Setup HoursDto
        HoursDto hour1 = new HoursDto();
        hour1.setDayOfWeek(1);
        hour1.setOpenTime(LocalTime.of(11, 0));
        hour1.setCloseTime(LocalTime.of(22, 0));

        HoursDto hour2 = new HoursDto();
        hour2.setDayOfWeek(2);
        hour2.setOpenTime(LocalTime.of(11, 0));
        hour2.setCloseTime(LocalTime.of(22, 0));

        hours = Arrays.asList(hour1, hour2);

        // Setup RestaurantHours
        restaurantHours = new RestaurantHours();
        restaurantHours.setDayOfWeek(1);
        restaurantHours.setOpenTime(Time.valueOf(LocalTime.of(11, 0)));
        restaurantHours.setCloseTime(Time.valueOf(LocalTime.of(22, 0)));
    }

    @Test
    void addHours_Success() {
        // Arrange
        doNothing().when(restaurantHoursRepository).insertHours(anyInt(), any());

        // Act
        restaurantHoursService.addHours(1, hours);

        // Assert
        verify(restaurantHoursRepository).insertHours(1, hours);
    }

    @Test
    void replaceHours_Success() {
        // Arrange
        doNothing().when(restaurantHoursRepository).deleteByRestaurantId(anyInt());
        doNothing().when(restaurantHoursRepository).insertHours(anyInt(), any());

        // Act
        restaurantHoursService.replaceHours(1, hours);

        // Assert
        verify(restaurantHoursRepository).deleteByRestaurantId(1);
        verify(restaurantHoursRepository).insertHours(1, hours);
    }

    @Test
    void getHoursForRestaurantAndDay_Success() {
        // Arrange
        when(restaurantHoursRepository.getHoursByRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(restaurantHours);

        // Act
        HoursDto result = restaurantHoursService.getHoursForRestaurantAndDay(1, 1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getDayOfWeek());
        assertEquals(LocalTime.of(11, 0), result.getOpenTime());
        assertEquals(LocalTime.of(22, 0), result.getCloseTime());
    }

    @Test
    void getHoursForRestaurantAndDay_NotFound() {
        // Arrange
        when(restaurantHoursRepository.getHoursByRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(null);

        // Act & Assert
        RestaurantException exception = assertThrows(RestaurantException.class,
                () -> restaurantHoursService.getHoursForRestaurantAndDay(1, 1));

        assertEquals("Restaurant hours not found for the given restaurant and day", exception.getMessage());
    }
} 