package com.sjsu.booktable.controller;

import com.sjsu.booktable.exception.booking.BookingNotFoundException;
import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.service.booking.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('Customer')")
    public ResponseEntity createBooking(@RequestBody @Valid BookingRequestDTO bookingRequest) {
        String bookingCreateResponse = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(BTResponse.success(bookingCreateResponse));
    }

    @DeleteMapping("/cancel/{bookingId}")
    @PreAuthorize("hasAuthority('Customer')")
    public ResponseEntity cancelBooking(@PathVariable("bookingId") int bookingId) {
        try {
            String cancelBookingResponse = bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(BTResponse.success(cancelBookingResponse));
        } catch (BookingNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BTResponse.failure(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BTResponse.failure(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }
}
