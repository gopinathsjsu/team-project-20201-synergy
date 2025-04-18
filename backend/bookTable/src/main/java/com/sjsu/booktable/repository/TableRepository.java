package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.TableConfigurationDto;
import com.sjsu.booktable.model.entity.TableEntity;

import java.util.List;

public interface TableRepository {

    void insertTables(int restaurantId, List<TableConfigurationDto> tableConfigurationDtos);

    void deleteByRestaurantId(int restaurantId);

    Integer getTotalCapacity(int restaurantId);

    List<TableEntity> getTableConfigurationsForRestaurant(int restaurantId);
}
