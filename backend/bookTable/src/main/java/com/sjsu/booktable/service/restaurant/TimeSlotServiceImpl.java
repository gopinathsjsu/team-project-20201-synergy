package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;
import com.sjsu.booktable.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

}
