package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TableRequest;

import java.util.List;

public interface TableService {

    void addTables(int restaurantId, List<TableRequest> tables);

    void replaceTables(int restaurantId, List<TableRequest> tables);
}
