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
import com.sjsu.booktable.service.s3.S3Service;
import com.sjsu.booktable.utils.ListUtils;
import com.sjsu.booktable.utils.StringUtils;
import com.sjsu.booktable.validator.RestaurantValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.sjsu.booktable.utils.RestaurantUtil.buildFullAddress;

@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final TableService tableService;
    private final PhotoService photoService;
    private final TimeSlotService timeSlotService;
    private final RestaurantHoursService restaurantHoursService;
    private final GoogleMapsService googleMapsService;
    private final BookingService bookingService;
    private final RestaurantValidator validator;

    private static final int SLOT_TOLERANCE_MINUTES = 30;
    private final S3Service s3Service;

    @Override
    @Transactional
    public RestaurantResponse addRestaurant(RestaurantRequest request, String managerId) {
        try {
            validator.validateRestaurantRequest(request);
            String fullAddress = buildFullAddress(request);
            double[] coords = googleMapsService.geocode(fullAddress);
            int restaurantId = saveRestaurantDetails(request, coords, request.getMainPhotoUrl(), managerId);

            saveAdditionalPhotos(request.getAdditionalPhotoUrls(), restaurantId);

            tableService.addTables(restaurantId, request.getTableConfigurations());
            restaurantHoursService.addHours(restaurantId, request.getOperatingHours());
            timeSlotService.addTimeSlots(restaurantId, request.getTimeSlots());

            return RestaurantResponse.builder()
                    .id(restaurantId)
                    .name(request.getBasicDetails().getName())
                    .approved(false)
                    .build();
        } catch (Exception e) {
            log.error("Exception while adding restaurant: ", e);
            throw e;
        }
    }

    @Override
    @Transactional
    public RestaurantResponse updateRestaurant(int restaurantId, RestaurantRequest request, String managerId) {
        try {
            Restaurant existingRestaurant = restaurantRepository.findById(restaurantId);
            if (existingRestaurant == null) {
                throw new RestaurantException("Restaurant not found", HttpStatus.NOT_FOUND);
            }
            verifyOwnership(existingRestaurant, managerId);
            validator.validateRestaurantRequest(request);

            String fullAddress = buildFullAddress(request);
            double[] coords = googleMapsService.geocode(fullAddress);
            updateRestaurantDetails(restaurantId, request.getBasicDetails(), coords, request.getMainPhotoUrl());

            updateAdditionalPhotos(restaurantId, request.getAdditionalPhotoUrls());

            tableService.replaceTables(restaurantId, request.getTableConfigurations());
            restaurantHoursService.replaceHours(restaurantId, request.getOperatingHours());
            timeSlotService.replaceTimeSlots(restaurantId, request.getTimeSlots());

            if(existingRestaurant.getMainPhotoUrl() != null && !existingRestaurant.getMainPhotoUrl().equals(request.getMainPhotoUrl())) {
                s3Service.deleteFilesBulk(Collections.singletonList(existingRestaurant.getMainPhotoUrl()));
            }

            return RestaurantResponse.builder()
                    .id(restaurantId)
                    .name(request.getBasicDetails().getName())
                    .approved(existingRestaurant.isApproved())
                    .build();
        } catch (Exception e) {
            log.error("Exception while updating restaurant: ", e);
            throw e;
        }
    }

    @Override
    public RestaurantSearchResponse searchRestaurants(RestaurantSearchRequest searchRequest) {
        try {
            List<RestaurantSearchDetails> nearbyRestaurants = restaurantRepository.searchRestaurants(
                    searchRequest.getLongitude(), searchRequest.getLatitude(), searchRequest.getSearchText());

            List<RestaurantSearchDetails> availableRestaurants = new ArrayList<>();

            for (RestaurantSearchDetails nearbyRestaurant : ListUtils.nullSafeList(nearbyRestaurants)) {
                int restaurantId = nearbyRestaurant.getId();
                LocalDate resDate = searchRequest.getDate();
                int dayOfWeek = resDate.getDayOfWeek().getValue() % 7;
                LocalTime resTime = searchRequest.getTime();
                int partySize = searchRequest.getPartySize();

                boolean withinHours = isWithinOperatingHours(restaurantId, resTime, dayOfWeek);
                if (!withinHours) {
                    continue;
                }

                List<LocalTime> matchingSlots = getMatchingTimeSlots(restaurantId, dayOfWeek, resTime);

                if (matchingSlots.isEmpty()) {
                    continue;
                }

                List<String> availableTimeSlots = getAvailableTimeSlots(restaurantId, resDate, matchingSlots, partySize);

                if (availableTimeSlots.isEmpty()) {
                    continue;
                }

                nearbyRestaurant.setAvailableTimeSlots(availableTimeSlots);
                availableRestaurants.add(nearbyRestaurant);
            }

            return RestaurantSearchResponse.builder()
                    .count(availableRestaurants.size())
                    .restaurantSearchDetails(availableRestaurants)
                    .build();
        } catch (Exception e) {
            log.error("Error while searching for restaurants: ", e);
            throw e;
        }
    }

    @Override
    public RestaurantSearchResponse fetchRestaurantsByManager(String managerId) {
        if(StringUtils.isBlank(managerId)) {
            throw new InvalidRequestException("Manager id cannot be null or empty");
        }
        List<RestaurantSearchDetails> restaurants = new ArrayList<>();

        try {
            restaurants = ListUtils.nullSafeList(restaurantRepository.findByManagerId(managerId));
        } catch (Exception e) {
            log.error("Error while fetching restaurants by manager: ", e);
        }

        return RestaurantSearchResponse.builder()
                .count(restaurants.size())
                .restaurantSearchDetails(restaurants)
                .build();
    }

    @Override
    public RestaurantDetailsResponse fetchRestaurantDetails(int restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant == null) {
            throw new RestaurantException("Restaurant not found", HttpStatus.NOT_FOUND);
        }

        List<TableConfigurationDto> tableConfigurations = tableService.getTableConfigurationsForRestaurant(restaurantId);
        List<Photo> photos = photoService.getPhotosByRestaurantId(restaurantId);
        List<String> additionalPhotoUrls = photos.stream().map(Photo::getS3URL).toList();
        List<HoursDto> hours = restaurantHoursService.getHoursForRestaurant(restaurantId);
        List<TimeSlotDto> timeSlots = timeSlotService.getTimeSlotsForRestaurant(restaurantId);

        return RestaurantDetailsResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .cuisineType(restaurant.getCuisineType())
                .costRating(restaurant.getCostRating())
                .description(restaurant.getDescription())
                .contactPhone(restaurant.getContactPhone())
                .addressLine(restaurant.getAddressLine())
                .city(restaurant.getCity())
                .state(restaurant.getState())
                .zipCode(restaurant.getZipCode())
                .country(restaurant.getCountry())
                .mainPhotoUrl(restaurant.getMainPhotoUrl())
                .additionalPhotoUrls(additionalPhotoUrls)
                .tableConfigurations(tableConfigurations)
                .operatingHours(hours)
                .timeSlots(timeSlots)
                .approved(restaurant.isApproved())
                .build();
    }

    private int saveRestaurantDetails(RestaurantRequest request, double[] coords, String mainPhotoUrl, String managerId) {
        return restaurantRepository.addRestaurantDetails(
                request.getBasicDetails(), coords[0], coords[1], mainPhotoUrl, managerId);
    }

    private void saveAdditionalPhotos(List<String> additionalPhotoUrls, int restaurantId) {
        if(CollectionUtils.isEmpty(additionalPhotoUrls)) {
            return;
        }

        for (String additionalPhotoUrl : additionalPhotoUrls) {
            Photo photoEntity = Photo.builder()
                    .restaurantId(restaurantId)
                    .s3URL(additionalPhotoUrl)
                    .description("Additional photo")
                    .uploadedAt(new Timestamp(System.currentTimeMillis()))
                    .build();
            photoService.addPhoto(photoEntity);
        }
    }

    private void updateAdditionalPhotos(int restaurantId, List<String> additionalPhotoUrls) {
        List<Photo> existingPhotos = photoService.getPhotosByRestaurantId(restaurantId);
        Set<String> existingPhotoUrls = existingPhotos.stream()
                .map(Photo::getS3URL)
                .collect(Collectors.toSet());

        Set<String> requestedPhotoUrls = new HashSet<>(additionalPhotoUrls);

        Set<String> toDelete = new HashSet<>(existingPhotoUrls);
        toDelete.removeAll(requestedPhotoUrls);

        Set<String> toAdd = new HashSet<>(requestedPhotoUrls);
        toAdd.removeAll(existingPhotoUrls);
        System.out.println("toDelete: " + toDelete);
        System.out.println("toAdd: " + toAdd);

        if(!toDelete.isEmpty()) {
            photoService.deletePhotoByRestaurantIdAndS3Url(restaurantId, toDelete.stream().toList());
            s3Service.deleteFilesBulk(toDelete.stream().toList());
        }

        if(!toAdd.isEmpty()) {
            for (String additionalPhotoUrl : toAdd) {
                Photo photoEntity = Photo.builder()
                        .restaurantId(restaurantId)
                        .s3URL(additionalPhotoUrl)
                        .description("Additional photo")
                        .uploadedAt(new Timestamp(System.currentTimeMillis()))
                        .build();
                photoService.addPhoto(photoEntity);
            }
        }
    }

    private void verifyOwnership(Restaurant existingRestaurant, String managerId) {
        if (!Objects.equals(existingRestaurant.getManagerId(), managerId)) {
            throw new RestaurantException("Unauthorized: Manager does not own this restaurant", HttpStatus.FORBIDDEN);
        }
    }

    private void updateRestaurantDetails(int restaurantId, RestaurantDetailsRequest basicDetails, double[] coords, String mainPhotoUrl) {
        restaurantRepository.updateRestaurantDetails(restaurantId, basicDetails, coords[0], coords[1], mainPhotoUrl);
    }

    private boolean isWithinOperatingHours(int restaurantId, LocalTime resTime, int dayOfWeek) {
        // Retrieve operating hours (HoursDto) for the given day
        HoursDto hours = restaurantHoursService.getHoursForRestaurantAndDay(restaurantId, dayOfWeek);

        if (hours == null) {
            return false;
        }

        // Check if the requested time falls within operating hours,
        // handling over-midnight cases:
        LocalTime open = hours.getOpenTime();
        LocalTime close = hours.getCloseTime();

        if (open.isBefore(close)) {
            // Normal day: 11:00 to 22:00
            return !resTime.isBefore(open) && resTime.isBefore(close);
        } else {
            // Over-midnight: e.g., 18:00 to 02:00
            return !resTime.isBefore(open) || resTime.isBefore(close) && resTime.isAfter(LocalTime.MIDNIGHT);
        }

    }

    private List<LocalTime> getMatchingTimeSlots(int restaurantId, int dayOfWeek, LocalTime resTime) {
        // Retrieve time slots for the restaurant on that day:
        TimeSlotDto slots = timeSlotService.getTimeSlotsForRestaurantAndDay(restaurantId, dayOfWeek);

        // Filter candidate slots that are within ± tolerance of the requested time.
        List<LocalTime> matchingSlots = new ArrayList<>();

        for (LocalTime slot : slots.getTimes()) {
            long diffMinutes = Math.abs(Duration.between(slot, resTime).toMinutes());
            if (diffMinutes <= SLOT_TOLERANCE_MINUTES) {
                matchingSlots.add(slot);
            }
        }

        return matchingSlots;
    }

    private List<String> getAvailableTimeSlots(int restaurantId, LocalDate resDate, List<LocalTime> matchingSlots, int partySize) {
        // Retrieve the total seating capacity
        int totalCapacity = tableService.getTotalCapacity(restaurantId);

        // Retrieve booked capacities for all candidate slots
        Map<LocalTime, Integer> slotBookedMap = bookingService.getBookedCapacitiesForSlotsForRestaurant(restaurantId, resDate, matchingSlots);

        // Evaluate each candidate time slot's availability.
        List<String> availableTimeSlots = new ArrayList<>();
        for (LocalTime slot : matchingSlots) {
            int bookedCapacity = slotBookedMap.getOrDefault(slot, 0);
            int availableCapacity = totalCapacity - bookedCapacity;
            if (availableCapacity >= partySize) {
                availableTimeSlots.add(slot.toString());
            }
        }

        return availableTimeSlots;
    }

}
