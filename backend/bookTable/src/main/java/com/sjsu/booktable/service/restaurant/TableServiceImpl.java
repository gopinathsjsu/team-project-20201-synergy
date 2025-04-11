package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TableRequest;
import com.sjsu.booktable.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableServiceImpl implements TableService {

    private final TableRepository tableRepository;

    @Override
    public void addTables(int restaurantId, List<TableRequest> tables) {
        tableRepository.insertTables(restaurantId, tables);
    }

    @Override
    @Transactional
    public void replaceTables(int restaurantId, List<TableRequest> tables) {
        tableRepository.deleteByRestaurantId(restaurantId);
        tableRepository.insertTables(restaurantId, tables);
    }

    @Override
    public int getTotalCapacity(int restaurantId) {
        Integer capacity = tableRepository.getTotalCapacity(restaurantId);
        return capacity != null ? capacity : 0;
    }
}
