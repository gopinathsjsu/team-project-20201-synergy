package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.restaurant.RestaurantException;
import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsRequest;
import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.model.entity.Photo;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.repository.RestaurantRepository;
import com.sjsu.booktable.validator.RestaurantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

import static com.sjsu.booktable.utils.RestaurantUtil.buildFullAddress;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final TableService tableService;
    private final PhotoService photoService;
    private final TimeSlotService timeSlotService;
    private final RestaurantHoursService restaurantHoursService;
    private final GoogleMapsService googleMapsService;
    private final RestaurantValidator validator;

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

}
