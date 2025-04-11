package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;
import com.sjsu.booktable.repository.TimeSlotRepository;
import com.sjsu.booktable.utils.ListUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Override
    public void addTimeSlots(int restaurantId, List<TimeSlotDto> slots) {
        timeSlotRepository.insertTimeSlots(restaurantId, slots);
    }

    @Override
    @Transactional
    public void replaceTimeSlots(int restaurantId, List<TimeSlotDto> slots) {
        timeSlotRepository.deleteByRestaurantId(restaurantId);
        timeSlotRepository.insertTimeSlots(restaurantId, slots);
    }

    @Override
    public TimeSlotDto getTimeSlotsForRestaurantAndDay(int restaurantId, int dayOfWeek) {
        List<LocalTime> timeSlots = ListUtils.nullSafeList(timeSlotRepository.getTimeSlotsByRestaurantAndDay(restaurantId, dayOfWeek));
        return TimeSlotDto.builder()
                .dayOfWeek(dayOfWeek)
                .times(timeSlots)
                .build();
    }

}
