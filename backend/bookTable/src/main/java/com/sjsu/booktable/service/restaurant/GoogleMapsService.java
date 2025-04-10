package com.sjsu.booktable.service.restaurant;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import com.sjsu.booktable.exception.restaurant.GeocodingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleMapsService implements GeocodingService {

    private final GeoApiContext geoApiContext;

    @Override
    public double[] geocode(String address) {
        try {
            log.info("Geocoding address: {}", address);
            GeocodingResult[] results = GeocodingApi.geocode(geoApiContext, address).await();

            if (results == null || results.length == 0) {
                log.error("No geocoding results found for address: {}", address);
                throw new IOException("No geocoding results found");
            }

            LatLng location = results[0].geometry.location;
            double latitude = location.lat;
            double longitude = location.lng;

            log.info("Geocoded {} to [lng: {}, lat: {}]", address, longitude, latitude);
            return new double[]{longitude, latitude}; // MySQL POINT uses (lng, lat)
        } catch (Exception e) {
            log.error("Failed to geocode address: {} Error: ", address, e);
            throw new GeocodingException("Failed to geocode address: " + address + " Error: ", e);
        }
    }

}
