import { useState, useEffect } from "react";

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null); // 'granted', 'prompt', 'denied'
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check initial permission status
    const checkPermission = async () => {
      if (!navigator.geolocation || !navigator.permissions) {
        setError(
          "Geolocation or Permissions API not supported by this browser."
        );
        setPermissionStatus("denied"); // Or some other indicator
        return;
      }
      try {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionStatus(status.state);

        // Listen for changes in permission status
        status.onchange = () => {
          setPermissionStatus(status.state);
          // If permission was granted after being in 'prompt' or 'denied', you might want to auto-fetch location
          if (status.state === "granted" && !location && !isLoading) {
            // Optional: Automatically fetch location if permission is granted and not already fetched
            // getLocation();
          }
        };
      } catch (e) {
        setError("Could not query geolocation permission status.");
        setPermissionStatus("denied"); // Or some other indicator
      }
    };

    checkPermission();

    // Cleanup function for the event listener
    return () => {
      // Attempt to remove the onchange listener if status was successfully queried
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((status) => {
            status.onchange = null;
          })
          .catch(() => {
            /* Ignore errors during cleanup */
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setPermissionStatus("denied");
      return;
    }

    if (permissionStatus === "denied") {
      setError(
        "Location permission has been denied. Please enable it in your browser settings."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
        setPermissionStatus("granted"); // Update status if it was 'prompt'
        setIsLoading(false);
      },
      (err) => {
        setError(`Error: ${err.message}`);
        // common error codes:
        // err.code === 1: Permission denied
        // err.code === 2: Position unavailable
        // err.code === 3: Timeout
        if (err.code === 1) {
          setPermissionStatus("denied");
        }
        setLocation(null);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: options.enableHighAccuracy || true,
        timeout: options.timeout || 10000,
        maximumAge: options.maximumAge || 0,
        ...options,
      }
    );
  };

  return { location, error, isLoading, permissionStatus, getLocation };
};

export default useGeolocation;
