package com.sjsu.booktable.utils;

import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import lombok.experimental.UtilityClass;

@UtilityClass
public class RestaurantUtil {

    public static String buildFullAddress(RestaurantRequest request) {
        return String.format("%s, %s, %s %s, %s",
                request.getBasicDetails().getAddressLine(), request.getBasicDetails().getCity(),
                request.getBasicDetails().getState(), request.getBasicDetails().getZipCode(),
                request.getBasicDetails().getCountry());
    }



}
