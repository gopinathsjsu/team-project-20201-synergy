package com.sjsu.booktable.validator;

import com.sjsu.booktable.exception.restaurant.InvalidRestaurantRequestException;
import com.sjsu.booktable.exception.restaurant.PhotoUploadException;
import com.sjsu.booktable.model.dto.restaurant.HoursDto;
import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RestaurantValidatorTest {

    private RestaurantValidator validator;
    private RestaurantRequest request;

    @BeforeEach
    void setUp() {
        validator = new RestaurantValidator();
        request = new RestaurantRequest();

        // Setup valid hours for all days
        List<HoursDto> hours = new ArrayList<>();
        hours.add(createHoursDto(0, LocalTime.of(11, 0), LocalTime.of(22, 0)));
        hours.add(createHoursDto(1, LocalTime.of(11, 0), LocalTime.of(22, 0)));
        hours.add(createHoursDto(2, LocalTime.of(11, 0), LocalTime.of(22, 0)));
        hours.add(createHoursDto(3, LocalTime.of(11, 0), LocalTime.of(22, 0)));
        hours.add(createHoursDto(4, LocalTime.of(11, 0), LocalTime.of(22, 0)));
        hours.add(createHoursDto(5, LocalTime.of(11, 0), LocalTime.of(22, 0)));
        hours.add(createHoursDto(6, LocalTime.of(11, 0), LocalTime.of(22, 0)));
        request.setOperatingHours(hours);

        // Setup valid time slots for all days
        List<TimeSlotDto> slots = new ArrayList<>();
        slots.add(createTimeSlotDto(0, LocalTime.of(18, 0)));
        slots.add(createTimeSlotDto(1, LocalTime.of(18, 0)));
        slots.add(createTimeSlotDto(2, LocalTime.of(18, 0)));
        slots.add(createTimeSlotDto(3, LocalTime.of(18, 0)));
        slots.add(createTimeSlotDto(4, LocalTime.of(18, 0)));
        slots.add(createTimeSlotDto(5, LocalTime.of(18, 0)));
        slots.add(createTimeSlotDto(6, LocalTime.of(18, 0)));
        request.setTimeSlots(slots);
    }

    @Test
    void validateRestaurantRequest_Success() {
        // Act & Assert
        assertDoesNotThrow(() -> validator.validateRestaurantRequest(request));
    }

    @Test
    void validateRestaurantRequest_MissingDays() {
        // Arrange
        request.getOperatingHours().remove(0); // Remove Sunday hours

        // Act & Assert
        InvalidRestaurantRequestException exception = assertThrows(InvalidRestaurantRequestException.class,
                () -> validator.validateRestaurantRequest(request));
        assertTrue(exception.getMessage().contains("Missing days in operating hours"));
    }

    @Test
    void validateRestaurantRequest_DuplicateDays() {
        // Arrange
        request.getOperatingHours().add(createHoursDto(0, LocalTime.of(11, 0), LocalTime.of(22, 0))); // Add duplicate Sunday

        // Act & Assert
        InvalidRestaurantRequestException exception = assertThrows(InvalidRestaurantRequestException.class,
                () -> validator.validateRestaurantRequest(request));
        assertTrue(exception.getMessage().contains("Duplicate day of week in operating hours"));
    }

    @Test
    void validateRestaurantRequest_TimeSlotOutsideHours() {
        // Arrange
        List<LocalTime> times = new ArrayList<>(request.getTimeSlots().get(0).getTimes());
        times.add(LocalTime.of(10, 0)); // Add slot before opening time
        request.getTimeSlots().get(0).setTimes(times);

        // Act & Assert
        InvalidRestaurantRequestException exception = assertThrows(InvalidRestaurantRequestException.class,
                () -> validator.validateRestaurantRequest(request));
        assertTrue(exception.getMessage().contains("outside operating hours"));
    }

    @Test
    void validateImageFile_Success() {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                "test content".getBytes()
        );

        // Act & Assert
        assertDoesNotThrow(() -> validator.validateImageFile(file));
    }

    @Test
    void validateImageFile_InvalidType() {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "test content".getBytes()
        );

        // Act & Assert
        PhotoUploadException exception = assertThrows(PhotoUploadException.class,
                () -> validator.validateImageFile(file));
        assertTrue(exception.getMessage().contains("Invalid file type"));
    }

    private HoursDto createHoursDto(int dayOfWeek, LocalTime openTime, LocalTime closeTime) {
        HoursDto hoursDto = new HoursDto();
        hoursDto.setDayOfWeek(dayOfWeek);
        hoursDto.setOpenTime(openTime);
        hoursDto.setCloseTime(closeTime);
        return hoursDto;
    }

    private TimeSlotDto createTimeSlotDto(int dayOfWeek, LocalTime time) {
        List<LocalTime> times = new ArrayList<>();
        times.add(time);
        return TimeSlotDto.builder()
                .dayOfWeek(dayOfWeek)
                .times(times)
                .build();
    }
} 