import axios from "axios";
import { useState, useEffect } from "react";

const LOCATION_ERROR_TYPE = {
  PERMISSION_DENIED: "denied",
  POSITION_UNAVAILABLE: "unavailable",
  TIMEOUT: "timeout",
  NOT_SUPPORTED: "not_supported",
  UNKNOWN: "unknown",
};

function useNearbySuggestions(props) {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async (locationCoords = null) => {
      setIsLoading(true);
      setError(null);

      try {
        const apiEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/restaurants/nearby`;
        const requestBody = locationCoords
          ? {
              latitude: locationCoords.latitude,
              longitude: locationCoords.longitude,
            }
          : null;

        const response = await axios.post(apiEndpoint, requestBody);

        const data = response.data?.data?.restaurantSearchDetails;
        setSuggestions(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError(`Could not load suggestions: ${err.message}`);
        setIsLoading(false);
        setSuggestions(null);
      }
    };

    if (!navigator.geolocation) {
      setLocationError(LOCATION_ERROR_TYPE.NOT_SUPPORTED);
      setIsLoading(false);
      fetchSuggestions(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setLocationError(null);
        fetchSuggestions(coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLoading(false);

        let errorType = LOCATION_ERROR_TYPE.UNKNOWN;
        let errorMsg = "Failed to get your location.";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorType = LOCATION_ERROR_TYPE.PERMISSION_DENIED;
            errorMsg =
              "Location permission denied. Please enable it in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorType = LOCATION_ERROR_TYPE.POSITION_UNAVAILABLE;
            errorMsg = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorType = LOCATION_ERROR_TYPE.TIMEOUT;
            errorMsg = "The request to get user location timed out.";
            break;
          default:
            errorType = LOCATION_ERROR_TYPE.UNKNOWN;
            errorMsg = `An unknown location error occurred (code: ${err.code}).`;
        }
        setLocationError(errorType);
        setError(errorMsg);
        setUserLocation(null);
        fetchSuggestions(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    locationError,
  };
}

export { useNearbySuggestions, LOCATION_ERROR_TYPE };
