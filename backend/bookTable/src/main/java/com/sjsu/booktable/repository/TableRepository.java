package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.TableRequest;

import java.util.List;

public interface TableRepository {

    void insertTables(int restaurantId, List<TableRequest> tableRequests);

    void deleteByRestaurantId(int restaurantId);
}
