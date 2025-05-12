package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.dto.booking.BookingResponseDTO;
import com.sjsu.booktable.service.booking.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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
}
