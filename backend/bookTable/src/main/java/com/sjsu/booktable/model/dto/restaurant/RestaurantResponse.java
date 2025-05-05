package com.sjsu.booktable.model.dto.restaurant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantResponse {

    private int id;
    private String name;
    private boolean approved;

}
