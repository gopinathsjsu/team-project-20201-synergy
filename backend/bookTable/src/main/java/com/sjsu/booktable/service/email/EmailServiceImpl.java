package com.sjsu.booktable.service.email;

import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.*;
import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final AmazonSimpleEmailService sesClient;
    private final TemplateEngine templateEngine;

    @Value("${aws.ses.from-email}")
    private String fromEmail;

    @Value("${booktable.app.name}")
    private String appName;

    @Value("${booktable.app.base-url}")
    private String appBaseUrl;

    @Override
    public boolean sendBookingConfirmationEmail(int bookingId, BookingRequestDTO bookingRequest) {
        try {
            String formattedDate = bookingRequest.getBookingDate().format(DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy"));
            String formattedTime = bookingRequest.getBookingTime().format(DateTimeFormatter.ofPattern("h:mm a"));

            Context context = new Context();
            context.setVariable("booking", bookingRequest);
            context.setVariable("formattedDate", formattedDate);
            context.setVariable("formattedTime", formattedTime);
            context.setVariable("appName", appName);
            context.setVariable("appBaseUrl", appBaseUrl);
            context.setVariable("bookingId", bookingId);
            context.setVariable("restaurantName", bookingRequest.getRestaurantName());

            String emailContent = templateEngine.process("booking-confirmation", context);

            // Create SES email request
            SendEmailRequest request = new SendEmailRequest()
                    .withSource(fromEmail)
                    .withDestination(new Destination().withToAddresses(bookingRequest.getEmail()))
                    .withMessage(new Message()
                            .withSubject(new Content().withCharset("UTF-8").withData("Your Reservation Confirmation - " + bookingRequest.getRestaurantName()))
                            .withBody(new Body().withHtml(new Content().withCharset("UTF-8").withData(emailContent)))
                    );

            sesClient.sendEmail(request);
            log.info("Booking confirmation email sent to: {}", bookingRequest.getEmail());
            return true;
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email", e);
            return false;
        }
    }

    @Override
    public boolean sendBookingCancellationEmail(Booking booking, String recipientEmail) {
        try {
            String formattedDate = booking.getBookingDate().toLocalDate().format(DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy"));
            String formattedTime = booking.getBookingTime().toLocalTime().format(DateTimeFormatter.ofPattern("h:mm a"));

            // Prepare the context with variables for the template
            Context context = new Context();
            context.setVariable("booking", booking);
            context.setVariable("formattedDate", formattedDate);
            context.setVariable("formattedTime", formattedTime);
            context.setVariable("appName", appName);
            context.setVariable("appBaseUrl", appBaseUrl);

            // Process the template to get the email content
            String emailContent = templateEngine.process("booking-cancellation", context);

            // Create SES email request
            SendEmailRequest request = new SendEmailRequest()
                    .withSource(fromEmail)
                    .withDestination(new Destination().withToAddresses(recipientEmail))
                    .withMessage(new Message()
                            .withSubject(new Content().withCharset("UTF-8").withData("Your Reservation Cancellation - " + booking.getRestaurantName()))
                            .withBody(new Body().withHtml(new Content().withCharset("UTF-8").withData(emailContent)))
                    );
            sesClient.sendEmail(request);
            log.info("Booking cancellation email sent to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send booking cancellation email", e);
            return false;
        }
    }

} 