package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.booking.BookingConflictResponseDto;
import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.dto.booking.BookingResponseDTO;
import com.sjsu.booktable.model.entity.Booking;
import com.sjsu.booktable.service.booking.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('Customer')")
    public ResponseEntity createBooking(@RequestBody @Valid BookingRequestDTO bookingRequest, @AuthenticationPrincipal Jwt jwt) {
        String customerId= jwt.getSubject();
        bookingRequest.setCustomerId(customerId);
        BookingResponseDTO bookingResponseDTO = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(BTResponse.success(bookingResponseDTO));
    }

    @DeleteMapping("/cancel/{bookingId}")
    @PreAuthorize("hasAuthority('Customer')")
    public ResponseEntity cancelBooking(@PathVariable("bookingId") int bookingId) {
        BookingResponseDTO cancelBookingResponse = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(BTResponse.success(cancelBookingResponse));
    }
    
    @GetMapping("/fetch")
    @PreAuthorize("hasAuthority('Customer')")
    public ResponseEntity fetchBookings(@AuthenticationPrincipal Jwt jwt) {
        String customerId = jwt.getSubject();
        List<BookingResponseDTO> bookingsResponse = bookingService.getBookingsByCustomerId(customerId);
        List<Booking> bookings = bookingsResponse.stream()
            .map(BookingResponseDTO::getBooking)
            .collect(Collectors.toList());
        return ResponseEntity.ok(BTResponse.success(bookings));
    }
    
    @GetMapping("/check-conflicts")
    @PreAuthorize("hasAuthority('Customer')")
    public ResponseEntity checkConflictingBookings(
            @RequestParam("bookingDate") LocalDate bookingDate,
            @RequestParam("bookingTime") LocalTime bookingTime,
            @AuthenticationPrincipal Jwt jwt) {
        
        String customerId = jwt.getSubject();
        BookingConflictResponseDto conflictingBooking = bookingService.checkConflictingBooking(customerId, bookingDate, bookingTime);
        return ResponseEntity.ok(BTResponse.success(conflictingBooking));
    }
}
