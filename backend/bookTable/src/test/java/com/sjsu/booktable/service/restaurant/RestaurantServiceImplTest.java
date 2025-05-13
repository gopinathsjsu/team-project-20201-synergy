package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.auth.InvalidRequestException;
import com.sjsu.booktable.exception.restaurant.RestaurantException;
import com.sjsu.booktable.model.dto.restaurant.*;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchResponse;
import com.sjsu.booktable.model.entity.Photo;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.repository.RestaurantRepository;
import com.sjsu.booktable.service.booking.BookingService;
import com.sjsu.booktable.service.review.ReviewService;
import com.sjsu.booktable.service.s3.S3Service;
import com.sjsu.booktable.validator.RestaurantValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

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
    private ReviewService reviewService;

    @Mock
    private TableService tableService;

    @Mock
    private TimeSlotService timeSlotService;

    @Mock
    private RestaurantHoursService restaurantHoursService;

    @Mock
    private BookingService bookingService;

    @Mock
    private RestaurantValidator validator;

    @Mock
    private GoogleMapsService googleMapsService;

    @Mock
    private S3Service s3Service;

    @Mock
    private PhotoService photoService;

    @InjectMocks
    private RestaurantServiceImpl restaurantService;

    private RestaurantRequest restaurantRequest;
    private RestaurantDetailsRequest details;
    private List<TableConfigurationDto> tables;
    private List<HoursDto> hours;
    private List<TimeSlotDto> timeSlots;
    private String mainPhotoUrl;
    private List<String> additionalPhotoUrls;
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
        TableConfigurationDto table1 = new TableConfigurationDto();
        table1.setSize(4);
        table1.setQuantity(2);
        TableConfigurationDto table2 = new TableConfigurationDto();
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
        mainPhotoUrl = "https://s3.amazonaws.com/bucket-name/main.jpg";
        additionalPhotoUrls = new ArrayList<>();
        additionalPhotoUrls.add("https://s3.amazonaws.com/bucket-name/additional1.jpg");
        additionalPhotoUrls.add("https://s3.amazonaws.com/bucket-name/additional2.jpg");

        // Setup RestaurantRequest
        restaurantRequest = new RestaurantRequest();
        restaurantRequest.setBasicDetails(details);
        restaurantRequest.setTableConfigurations(tables);
        restaurantRequest.setOperatingHours(hours);
        restaurantRequest.setTimeSlots(timeSlots);
        restaurantRequest.setMainPhotoUrl(mainPhotoUrl);
        restaurantRequest.setAdditionalPhotoUrls(additionalPhotoUrls);

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
        when(restaurantRepository.addRestaurantDetails(any(), anyDouble(), anyDouble(), anyString(), anyString()))
                .thenReturn(1);
        when(googleMapsService.geocode(anyString())).thenReturn(new double[]{37.3382, -121.8863});
        doNothing().when(validator).validateRestaurantRequest(restaurantRequest);
        doNothing().when(tableService).addTables(anyInt(), any());
        doNothing().when(restaurantHoursService).addHours(anyInt(), any());
        doNothing().when(timeSlotService).addTimeSlots(anyInt(), any());
        doNothing().when(photoService).addPhoto(any());

        // Act
        RestaurantResponse response = restaurantService.addRestaurant(restaurantRequest, "1");

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("Test Restaurant", response.getName());
        assertFalse(response.isApproved());

        // Verify interactions
        verify(validator).validateRestaurantRequest(restaurantRequest);
        verify(restaurantRepository).addRestaurantDetails(any(), eq(37.3382), eq(-121.8863), anyString(), eq("1"));
        verify(tableService).addTables(anyInt(), any());
        verify(restaurantHoursService).addHours(anyInt(), any());
        verify(timeSlotService).addTimeSlots(anyInt(), any());
        verify(photoService, times(2)).addPhoto(any()); // Expect 2 calls for 2 additional photos
    }

    @Test
    void updateRestaurant_Success() {
        // Arrange
        Restaurant existingRestaurant = new Restaurant();
        existingRestaurant.setId(1);
        existingRestaurant.setManagerId("1");
        existingRestaurant.setName("Old Name");
        existingRestaurant.setMainPhotoUrl("old-url");

        // Setup existing photos
        List<Photo> existingPhotos = new ArrayList<>();
        Photo existingPhoto = new Photo();
        existingPhoto.setRestaurantId(1);
        existingPhoto.setS3URL("old-photo.jpg");
        existingPhotos.add(existingPhoto);

        when(restaurantRepository.findById(1)).thenReturn(existingRestaurant);
        when(googleMapsService.geocode(anyString())).thenReturn(new double[]{37.3382, -121.8863});
        doNothing().when(validator).validateRestaurantRequest(restaurantRequest);
        doNothing().when(tableService).replaceTables(anyInt(), any());
        doNothing().when(restaurantHoursService).replaceHours(anyInt(), any());
        doNothing().when(timeSlotService).replaceTimeSlots(anyInt(), any());
        when(photoService.getPhotosByRestaurantId(anyInt())).thenReturn(existingPhotos);
        doNothing().when(photoService).deletePhotoByRestaurantIdAndS3Url(anyInt(), anyList());
        doNothing().when(photoService).addPhoto(any());
        doNothing().when(s3Service).deleteFilesBulk(any());

        // Act
        RestaurantResponse response = restaurantService.updateRestaurant(1, restaurantRequest, "1");

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("Test Restaurant", response.getName());

        // Verify interactions
        verify(validator).validateRestaurantRequest(restaurantRequest);
        verify(restaurantRepository).updateRestaurantDetails(anyInt(), any(), anyDouble(), anyDouble(), anyString());
        verify(tableService).replaceTables(anyInt(), any());
        verify(restaurantHoursService).replaceHours(anyInt(), any());
        verify(timeSlotService).replaceTimeSlots(anyInt(), any());
        verify(photoService).getPhotosByRestaurantId(anyInt());
        verify(photoService).deletePhotoByRestaurantIdAndS3Url(anyInt(), eq(Arrays.asList("old-photo.jpg")));
        verify(photoService, times(2)).addPhoto(any()); // Expect 2 calls for 2 new photos
        verify(s3Service, times(2)).deleteFilesBulk(any()); // Expect 2 calls - one for main photo, one for additional photos
    }

    @Test
    void updateRestaurant_Unauthorized() {
        // Arrange
        Restaurant existingRestaurant = new Restaurant();
        existingRestaurant.setId(1);
        existingRestaurant.setManagerId("2"); // Different manager

        when(restaurantRepository.findById(1)).thenReturn(existingRestaurant);

        // Act & Assert
        RestaurantException exception = assertThrows(RestaurantException.class,
                () -> restaurantService.updateRestaurant(1, restaurantRequest, "1"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
        assertEquals("Unauthorized: Manager does not own this restaurant", exception.getMessage());
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

        when(reviewService.getAverageRatingByRestaurant(anyInt())).thenReturn(4.0);

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

    @Test
    void fetchRestaurantsByManager_EmptyManagerId() {
        // Act & Assert
        assertThrows(InvalidRequestException.class,
                () -> restaurantService.fetchRestaurantsByManager(""));
    }

    @Test
    void fetchRestaurantsByManager_RepositoryError() {
        // Arrange
        when(restaurantRepository.findByManagerId(anyString()))
                .thenThrow(new RuntimeException("Database error"));

        // Act
        RestaurantSearchResponse response = restaurantService.fetchRestaurantsByManager("1");

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getCount());
        assertTrue(response.getRestaurantSearchDetails().isEmpty());
    }

    @Test
    void fetchRestaurantDetails_NotFound() {
        // Arrange
        when(restaurantRepository.findById(anyInt())).thenReturn(null);

        // Act & Assert
        RestaurantException exception = assertThrows(RestaurantException.class,
                () -> restaurantService.fetchRestaurantDetails(1));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
    }

    @Test
    void searchRestaurants_InvalidCoordinates() {
        // Arrange
        RestaurantSearchRequest request = new RestaurantSearchRequest();
        request.setLatitude(1000.0); // Invalid latitude
        request.setLongitude(1000.0); // Invalid longitude
        request.setDate(LocalDate.now());
        request.setTime(LocalTime.now());
        request.setPartySize(2);
        request.setSearchText("");

        when(restaurantRepository.searchRestaurants(anyDouble(), anyDouble(), anyString()))
                .thenReturn(Collections.emptyList());

        // Act
        RestaurantSearchResponse response = restaurantService.searchRestaurants(request);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getCount());
        assertTrue(response.getRestaurantSearchDetails().isEmpty());
    }

    @Test
    void searchRestaurants_EmptySearchResults() {
        // Arrange
        RestaurantSearchRequest request = new RestaurantSearchRequest();
        request.setLatitude(37.3382);
        request.setLongitude(-121.8863);
        request.setDate(LocalDate.now());
        request.setTime(LocalTime.now());
        request.setPartySize(2);
        request.setSearchText("NonExistentRestaurant");

        when(restaurantRepository.searchRestaurants(anyDouble(), anyDouble(), anyString()))
                .thenReturn(Collections.emptyList());

        // Act
        RestaurantSearchResponse response = restaurantService.searchRestaurants(request);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.getCount());
        assertTrue(response.getRestaurantSearchDetails().isEmpty());
    }

    @Test
    void searchRestaurants_RepositoryError() {
        // Arrange
        RestaurantSearchRequest request = new RestaurantSearchRequest();
        request.setLatitude(37.3382);
        request.setLongitude(-121.8863);
        request.setDate(LocalDate.now());
        request.setTime(LocalTime.now());
        request.setPartySize(2);

        when(restaurantRepository.searchRestaurants(anyDouble(), anyDouble(), anyString()))
                .thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThrows(RuntimeException.class,
                () -> restaurantService.searchRestaurants(request));
    }
} 