package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TableConfigurationDto;

import java.util.List;

public interface TableService {

    void addTables(int restaurantId, List<TableConfigurationDto> tables);

    void replaceTables(int restaurantId, List<TableConfigurationDto> tables);

    int getTotalCapacity(int restaurantId);

    List<TableConfigurationDto> getTableConfigurationsForRestaurant(int restaurantId);

}
