package com.sjsu.booktable.model.dto.restaurantSearch;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RestaurantSearchResponse {

    private int count;
    private List<RestaurantSearchDetails> restaurantSearchDetails;
}
