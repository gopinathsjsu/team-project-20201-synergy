package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.restaurant.RestaurantException;
import com.sjsu.booktable.model.dto.restaurant.*;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchResponse;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.repository.RestaurantRepository;
import com.sjsu.booktable.service.booking.BookingService;
import com.sjsu.booktable.service.s3.S3Service;
import com.sjsu.booktable.validator.RestaurantValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestaurantServiceImplTest {

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private TableService tableService;

    @Mock
    private TimeSlotService timeSlotService;

    @Mock
    private RestaurantHoursService restaurantHoursService;

    @Mock
    private PhotoService photoService;

    @Mock
    private BookingService bookingService;

    @Mock
    private S3Service s3Service;

    @Mock
    private RestaurantValidator validator;

    @Mock
    private GoogleMapsService googleMapsService;

    @InjectMocks
    private RestaurantServiceImpl restaurantService;

    private RestaurantRequest restaurantRequest;
    private RestaurantDetailsRequest details;
    private List<TableRequest> tables;
    private List<HoursDto> hours;
    private List<TimeSlotDto> timeSlots;
    private MultipartFile mainPhoto;
    private List<MultipartFile> additionalPhotos;
    private Restaurant restaurant;

    @BeforeEach
    void setUp() {
        // Setup RestaurantDetailsRequest
        details = new RestaurantDetailsRequest();
        details.setName("Test Restaurant");
        details.setCuisineType("Italian");
        details.setCostRating(3);
        details.setDescription("A test restaurant");
        details.setContactPhone("1234567890");
        details.setAddressLine("123 Test St");
        details.setCity("San Jose");
        details.setState("CA");
        details.setZipCode("95112");
        details.setCountry("USA");

        // Setup TableRequest
        TableRequest table1 = new TableRequest();
        table1.setSize(4);
        table1.setQuantity(2);
        TableRequest table2 = new TableRequest();
        table2.setSize(6);
        table2.setQuantity(1);
        tables = Arrays.asList(table1, table2);

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

        // Setup TimeSlotDto
        TimeSlotDto slot1 = TimeSlotDto.builder()
                .dayOfWeek(1)
                .times(Arrays.asList(LocalTime.of(18, 0)))
                .build();
        TimeSlotDto slot2 = TimeSlotDto.builder()
                .dayOfWeek(1)
                .times(Arrays.asList(LocalTime.of(19, 0)))
                .build();
        timeSlots = Arrays.asList(slot1, slot2);

        // Setup MultipartFiles
        mainPhoto = new MockMultipartFile(
                "main.jpg",
                "main.jpg",
                "image/jpeg",
                "main photo content".getBytes()
        );
        additionalPhotos = Collections.singletonList(
                new MockMultipartFile(
                        "additional.jpg",
                        "additional.jpg",
                        "image/jpeg",
                        "additional photo content".getBytes()
                )
        );

        // Setup RestaurantRequest
        restaurantRequest = new RestaurantRequest();
        restaurantRequest.setBasicDetails(details);
        restaurantRequest.setTableConfigurations(tables);
        restaurantRequest.setOperatingHours(hours);
        restaurantRequest.setTimeSlots(timeSlots);
        restaurantRequest.setMainPhoto(mainPhoto);
        restaurantRequest.setAdditionalPhotos(additionalPhotos);

        // Setup Restaurant
        restaurant = new Restaurant();
        restaurant.setId(1);
        restaurant.setName("Test Restaurant");
        restaurant.setCuisineType("Italian");
        restaurant.setCostRating(3);
        restaurant.setDescription("A test restaurant");
        restaurant.setContactPhone("1234567890");
        restaurant.setAddressLine("123 Test St");
        restaurant.setCity("San Jose");
        restaurant.setState("CA");
        restaurant.setZipCode("95112");
        restaurant.setCountry("USA");
    }

    @Test
    void addRestaurant_Success() {
        // Arrange
        when(restaurantRepository.addRestaurantDetails(any(), anyDouble(), anyDouble(), anyString(), anyInt()))
                .thenReturn(1);
        when(photoService.uploadPhotoInS3(any(), anyString())).thenReturn("temp-url");
        when(photoService.movePhotoToDifferentPath(any(), any())).thenReturn("final-url");
        when(googleMapsService.geocode(anyString())).thenReturn(new double[]{37.3382, -121.8863});

        // Act
        RestaurantResponse response = restaurantService.addRestaurant(restaurantRequest, 1);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("Test Restaurant", response.getName());
        assertFalse(response.isApproved());

        // Verify interactions
        verify(validator).validateAddRequest(restaurantRequest);
        verify(restaurantRepository).addRestaurantDetails(any(), anyDouble(), anyDouble(), anyString(), anyInt());
        verify(photoService).movePhotoToDifferentPath(any(), any());
        verify(restaurantRepository).updateMainPhotoUrl(1, "final-url");
    }

    @Test
    void updateRestaurant_Success() {
        // Arrange
        Restaurant existingRestaurant = new Restaurant();
        existingRestaurant.setId(1);
        existingRestaurant.setManagerId(1);
        existingRestaurant.setName("Old Name");
        existingRestaurant.setMainPhotoUrl("old-url");

        when(restaurantRepository.findById(1)).thenReturn(existingRestaurant);
        when(photoService.uploadPhotoInS3(any(), anyString())).thenReturn("new-url");
        when(googleMapsService.geocode(anyString())).thenReturn(new double[]{37.3382, -121.8863});

        // Act
        RestaurantResponse response = restaurantService.updateRestaurant(1, restaurantRequest, 1);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("Test Restaurant", response.getName());

        // Verify interactions
        verify(validator).validateUpdateRequest(restaurantRequest);
        verify(restaurantRepository).updateRestaurantDetails(anyInt(), any(), anyDouble(), anyDouble(), anyString());
    }

    @Test
    void updateRestaurant_Unauthorized() {
        // Arrange
        Restaurant existingRestaurant = new Restaurant();
        existingRestaurant.setId(1);
        existingRestaurant.setManagerId(2); // Different manager

        when(restaurantRepository.findById(1)).thenReturn(existingRestaurant);

        // Act & Assert
        RestaurantException exception = assertThrows(RestaurantException.class,
                () -> restaurantService.updateRestaurant(1, restaurantRequest, 1));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
        assertEquals("Unauthorized: Manager does not own this restaurant or restaurant not found", exception.getMessage());
    }

    @Test
    void searchRestaurants_Success() {
        // Arrange
        RestaurantSearchRequest searchRequest = new RestaurantSearchRequest();
        searchRequest.setLatitude(37.3382);
        searchRequest.setLongitude(-121.8863);
        searchRequest.setSearchText("Italian");
        searchRequest.setDate(LocalDate.now());
        searchRequest.setTime(LocalTime.of(19, 0));
        searchRequest.setPartySize(4);

        List<RestaurantSearchDetails> nearbyRestaurants = Collections.singletonList(
                new RestaurantSearchDetails()
        );

        when(restaurantRepository.searchRestaurants(anyDouble(), anyDouble(), anyString()))
                .thenReturn(nearbyRestaurants);
        
        HoursDto hoursDto = new HoursDto();
        hoursDto.setDayOfWeek(1);
        hoursDto.setOpenTime(LocalTime.of(11, 0));
        hoursDto.setCloseTime(LocalTime.of(22, 0));
        
        when(restaurantHoursService.getHoursForRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(hoursDto);
                
        when(timeSlotService.getTimeSlotsForRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(TimeSlotDto.builder()
                        .dayOfWeek(1)
                        .times(Arrays.asList(LocalTime.of(19, 0)))
                        .build());
        when(tableService.getTotalCapacity(anyInt())).thenReturn(100);
        when(bookingService.getBookedCapacitiesForSlotsForRestaurant(anyInt(), any(), any()))
                .thenReturn(new HashMap<>());

        // Act
        RestaurantSearchResponse response = restaurantService.searchRestaurants(searchRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getCount());
        assertFalse(response.getRestaurantSearchDetails().isEmpty());
    }

    @Test
    void searchRestaurants_NoAvailableSlots() {
        // Arrange
        RestaurantSearchRequest searchRequest = new RestaurantSearchRequest();
        searchRequest.setLatitude(37.3382);
        searchRequest.setLongitude(-121.8863);
        searchRequest.setSearchText("Italian");
        searchRequest.setDate(LocalDate.now());
        searchRequest.setTime(LocalTime.of(19, 0));
        searchRequest.setPartySize(4);

        List<RestaurantSearchDetails> nearbyRestaurants = Collections.singletonList(
                new RestaurantSearchDetails()
        );

        when(restaurantRepository.searchRestaurants(anyDouble(), anyDouble(), anyString()))
                .thenReturn(nearbyRestaurants);
                
        HoursDto hoursDto = new HoursDto();
        hoursDto.setDayOfWeek(1);
        hoursDto.setOpenTime(LocalTime.of(11, 0));
        hoursDto.setCloseTime(LocalTime.of(22, 0));
        
        when(restaurantHoursService.getHoursForRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(hoursDto);
                
        when(timeSlotService.getTimeSlotsForRestaurantAndDay(anyInt(), anyInt()))
                .thenReturn(TimeSlotDto.builder()
                        .dayOfWeek(1)
                        .times(Arrays.asList(LocalTime.of(19, 0)))
                        .build());
        when(tableService.getTotalCapacity(anyInt())).thenReturn(100);
        when(bookingService.getBookedCapacitiesForSlotsForRestaurant(anyInt(), any(), any()))
                .thenReturn(Collections.singletonMap(LocalTime.of(19, 0), 100)); // All slots booked

        // Act
        RestaurantSearchResponse response = restaurantService.searchRestaurants(searchRequest);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getCount());
        assertTrue(response.getRestaurantSearchDetails().isEmpty());
    }
} 