package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.restaurant.RestaurantException;
import com.sjsu.booktable.model.dto.restaurant.*;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchResponse;
import com.sjsu.booktable.model.entity.Photo;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.repository.RestaurantRepository;
import com.sjsu.booktable.service.booking.BookingService;
import com.sjsu.booktable.utils.ListUtils;
import com.sjsu.booktable.validator.RestaurantValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @Override
    @Transactional
    public RestaurantResponse addRestaurant(RestaurantRequest request, int managerId) {
        validator.validateAddRequest(request);
        String fullAddress = buildFullAddress(request);
        double[] coords = googleMapsService.geocode(fullAddress);
        String tempMainPhotoUrl = photoService.uploadPhotoInS3(request.getMainPhoto(), "restaurants/main/temp");
        int restaurantId = saveRestaurantDetails(request, coords, tempMainPhotoUrl, managerId);

        String finalMainPhotoUrl = moveMainPhotoToFinalPath(tempMainPhotoUrl, restaurantId);
        restaurantRepository.updateMainPhotoUrl(restaurantId, finalMainPhotoUrl);

        saveAdditionalPhotos(request, restaurantId);

        tableService.addTables(restaurantId, request.getTableConfigurations());
        restaurantHoursService.addHours(restaurantId, request.getOperatingHours());
        timeSlotService.addTimeSlots(restaurantId, request.getTimeSlots());

        return RestaurantResponse.builder()
                .id(restaurantId)
                .name(request.getBasicDetails().getName())
                .approved(false)
                .build();
    }

    @Override
    @Transactional
    public RestaurantResponse updateRestaurant(int restaurantId, RestaurantRequest request, int managerId) {
        verifyOwnership(restaurantId, managerId);
        validator.validateUpdateRequest(request);

        if (request.getBasicDetails() != null) {
            String fullAddress = buildFullAddress(request);
            double[] coords = googleMapsService.geocode(fullAddress);
            String mainPhotoUrl = request.getMainPhoto() != null ?
                    photoService.uploadPhotoInS3(request.getMainPhoto(), "restaurants/main/" + restaurantId) :
                    restaurantRepository.findById(restaurantId).getMainPhotoUrl();
            updateRestaurantDetails(restaurantId, request.getBasicDetails(), coords, mainPhotoUrl);
        }

        saveAdditionalPhotos(request, restaurantId);

        if(request.getTableConfigurations() != null) {
            tableService.replaceTables(restaurantId, request.getTableConfigurations());
        }

        if(request.getOperatingHours() != null) {
            restaurantHoursService.replaceHours(restaurantId, request.getOperatingHours());
        }

        if(request.getTimeSlots() != null) {
            timeSlotService.replaceTimeSlots(restaurantId, request.getTimeSlots());
        }

        Restaurant existingRestaurant = restaurantRepository.findById(restaurantId);
        return RestaurantResponse.builder()
                .id(restaurantId)
                .name(request.getBasicDetails()!= null ? request.getBasicDetails().getName() : existingRestaurant.getName())
                .approved(existingRestaurant.isApproved())
                .build();
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

    private String moveMainPhotoToFinalPath(String tempUrl, int restaurantId) {
        String fileName = tempUrl.substring(tempUrl.lastIndexOf("/") + 1);
        String finalPath = "restaurants/main/" + restaurantId + "/" + fileName;
        String sourcePath = "restaurants/main/temp/" + fileName;
        return photoService.movePhotoToDifferentPath(sourcePath, finalPath);
    }

    private int saveRestaurantDetails(RestaurantRequest request, double[] coords, String tempMainPhotoUrl, int managerId) {
        return restaurantRepository.addRestaurantDetails(
                request.getBasicDetails(), coords[0], coords[1], tempMainPhotoUrl, managerId);
    }

    private void saveAdditionalPhotos(RestaurantRequest request, int restaurantId) {
        if (!CollectionUtils.isEmpty(request.getAdditionalPhotos())) {
            for (MultipartFile photo : request.getAdditionalPhotos()) {
                String url = photoService.uploadPhotoInS3(photo, "restaurants/additional/" + restaurantId);
                Photo photoEntity = Photo.builder()
                        .restaurantId(restaurantId)
                        .s3URL(url)
                        .description("Additional photo")
                        .uploadedAt(new Timestamp(System.currentTimeMillis()))
                        .build();
                photoService.addPhoto(photoEntity);
            }
        }
    }

    private void verifyOwnership(int restaurantId, int managerId) {
        Restaurant existingRestaurant = restaurantRepository.findById(restaurantId);
        if (existingRestaurant == null || existingRestaurant.getManagerId() != managerId) {
            throw new RestaurantException("Unauthorized: Manager does not own this restaurant or restaurant not found", HttpStatus.FORBIDDEN);
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
