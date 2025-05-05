import { useState, useEffect } from "react";

const LOCATION_ERROR_TYPE = {
  PERMISSION_DENIED: "denied",
  POSITION_UNAVAILABLE: "unavailable",
  TIMEOUT: "timeout",
  NOT_SUPPORTED: "not_supported",
  UNKNOWN: "unknown",
};

const data = [
  { id: 1, name: "Restaurant 1", description: "Description 1" },
  { id: 2, name: "Restaurant 2", description: "Description 2" },
  { id: 3, name: "Restaurant 3", description: "Description 3" },
  { id: 4, name: "Restaurant 3", description: "Description 3" },
  { id: 5, name: "Restaurant 3", description: "Description 3" },
  { id: 6, name: "Restaurant 3", description: "Description 3" },
  { id: 7, name: "Restaurant 3", description: "Description 3" },
  { id: 8, name: "Restaurant 3", description: "Description 3" },
  { id: 9, name: "Restaurant 3", description: "Description 3" },
  { id: 10, name: "Restaurant 3", description: "Description 3" },
  // Add more items as needed
];

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
        // const apiEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/restaurants/search`;
        // const requestBody = locationCoords
        //   ? JSON.stringify({
        //       lat: locationCoords.latitude,
        //       lng: locationCoords.longitude,
        //     })
        //   : null;

        // const response = await fetch(apiEndpoint, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: requestBody,
        // });

        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(
        //     errorData.message ||
        //       `Failed to fetch suggestions (HTTP status: ${response.status})`
        //   );
        // }

        // const data = await response.json();
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
