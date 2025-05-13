package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.restaurant.RestaurantException;
import com.sjsu.booktable.model.dto.restaurant.HoursDto;
import com.sjsu.booktable.model.entity.RestaurantHours;
import com.sjsu.booktable.repository.RestaurantHoursRepository;
import com.sjsu.booktable.utils.ListUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @Override
    public HoursDto getHoursForRestaurantAndDay(int restaurantId, int dayOfWeek) {
        RestaurantHours hours = restaurantHoursRepository.getHoursByRestaurantAndDay(restaurantId, dayOfWeek);
        if(hours == null){
            throw new RestaurantException("Restaurant hours not found for the given restaurant and day", HttpStatus.NOT_FOUND);
        }
        HoursDto hoursDto = new HoursDto();
        hoursDto.setDayOfWeek(hours.getDayOfWeek());
        hoursDto.setOpenTime(hours.getOpenTime() == null ? null : hours.getOpenTime().toLocalTime());
        hoursDto.setCloseTime(hours.getCloseTime() == null ? null : hours.getCloseTime().toLocalTime());
        return hoursDto;
    }

    @Override
    public List<HoursDto> getHoursForRestaurant(int restaurantId) {
        List<RestaurantHours> hoursList = ListUtils.nullSafeList(restaurantHoursRepository.getHoursByRestaurantId(restaurantId));
        return hoursList.stream().map(hours -> {
            HoursDto hoursDto = new HoursDto();
            hoursDto.setDayOfWeek(hours.getDayOfWeek());
            hoursDto.setOpenTime(hours.getOpenTime() == null ? null : hours.getOpenTime().toLocalTime());
            hoursDto.setCloseTime(hours.getCloseTime() == null ? null : hours.getCloseTime().toLocalTime());
            return hoursDto;
        }).toList();
    }
}
