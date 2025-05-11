import axios from "axios";
import { useState, useEffect } from "react";
import useGeolocation from "./useGeolocation";

const LOCATION_ERROR_TYPE = {
  PERMISSION_DENIED: "denied",
  POSITION_UNAVAILABLE: "unavailable",
  TIMEOUT: "timeout",
  NOT_SUPPORTED: "not_supported",
  UNKNOWN: "unknown",
};

function useNearbySuggestions(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  const {
    location: locationCoords,
    error: locationError,
    isLoading,
    permissionStatus,
    getLocation,
  } = useGeolocation();

  useEffect(() => {
    if (!locationCoords && permissionStatus !== "denied") {
      getLocation();
    }
  }, [locationCoords, permissionStatus]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsFetchLoading(true);
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
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
      setIsFetchLoading(false);
    };

    if (locationCoords) {
      fetchSuggestions();
    }
  }, [locationCoords]);

  console.log(locationError);

  return {
    suggestions,
    loading: isLoading || isFetchLoading,
    locationError,
  };
}

export { useNearbySuggestions, LOCATION_ERROR_TYPE };
