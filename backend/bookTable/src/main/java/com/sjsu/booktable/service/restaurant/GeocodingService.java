package com.sjsu.booktable.service.restaurant;

public interface GeocodingService {

    double[] geocode(String address);
}
