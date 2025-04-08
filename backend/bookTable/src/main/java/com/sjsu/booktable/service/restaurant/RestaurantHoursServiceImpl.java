package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.HoursDto;
import com.sjsu.booktable.repository.RestaurantHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantHoursServiceImpl implements RestaurantHoursService {

    private final RestaurantHoursRepository restaurantHoursRepository;

    @Override
    public void addHours(int restaurantId, List<HoursDto> hours) {
        restaurantHoursRepository.insertHours(restaurantId, hours);
    }

    @Override
    @Transactional
    public void replaceHours(int restaurantId, List<HoursDto> hours) {
        restaurantHoursRepository.deleteByRestaurantId(restaurantId);
        restaurantHoursRepository.insertHours(restaurantId, hours);
    }
}
