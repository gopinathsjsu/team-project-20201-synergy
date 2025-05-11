import { useState, useEffect, useCallback, useRef } from "react";

const useGeolocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 20000,
    maximumAge = 0,
    maxRetries = 2,
    retryDelay = 2000,
    useCache = true,
    cacheKey = 'userGeolocation',
    cacheMaxAgeMs = 5 * 60 * 1000,
  } = options;

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    if (useCache) {
      try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
          const { data: cachedLocation, timestamp: cachedTimestamp } = JSON.parse(cachedItem);
          if (Date.now() - cachedTimestamp < cacheMaxAgeMs) {
            console.log("Using cached location:", cachedLocation);
            setLocation(cachedLocation);
            setIsFromCache(true);
            setPermissionStatus('granted');
            setError(null);
          }
        }
      } catch (e) {
        console.error("Error reading from geolocation cache:", e);
      }
    }
  }, [useCache, cacheKey, cacheMaxAgeMs]);

  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.geolocation || !navigator.permissions) {
        setError(
          "Geolocation or Permissions API not supported by this browser."
        );
        setPermissionStatus("denied");
        return;
      }
      try {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionStatus(status.state);

        
        status.onchange = () => {
          setPermissionStatus(status.state);
          if (status.state === "granted" && !location && !isLoading) {
           
            getLocation();
          }
        };
      } catch (e) {
        setError("Could not query geolocation permission status.");
        setPermissionStatus("denied");
      }
    };

    checkPermission();


    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((status) => {
            status.onchange = null;
          })
          .catch(() => {
        
          });
      }
    };
  }, []);

  const performGeolocationRequest = useCallback((attempt) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setPermissionStatus("denied");
      setIsLoading(false);
      return;
    }
    if (permissionStatus === "denied" && attempt === 1) {
      setError("Location permission has been denied. Please enable it in your browser settings.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        console.log("Geolocation success on attempt:", attempt, newLocation);
        setLocation(newLocation);
        setError(null);
        setPermissionStatus("granted");
        setIsFromCache(false);
        setIsLoading(false);

        if (useCache) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ data: newLocation, timestamp: Date.now() }));
            console.log("Location cached successfully.");
          } catch (e) {
            console.error("Error saving location to cache:", e);
          }
        }

        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
      },
      (err) => {
        console.error(`Geolocation error on attempt ${attempt}:`, err);
        if (err.code === 1) { 
          setError("Location permission has been denied. Please enable it in your browser settings.");
          setPermissionStatus("denied");
          setIsLoading(false);
          setLocation(null);
          setIsFromCache(false);
          if(useCache) { try { localStorage.removeItem(cacheKey); } catch(e){ console.error("Error removing cache on permission denial", e);}}
        } else if (attempt < maxRetries && (err.code === 2 || err.code === 3)) { // Position Unavailable or Timeout
          console.log(`Retrying geolocation (attempt ${attempt + 1} of ${maxRetries})...`);
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(() => {
            performGeolocationRequest(attempt + 1);
          }, retryDelay);
        } else {
          let userFriendlyMessage = `Error: ${err.message}`;
          if (err.code === 2) {
            userFriendlyMessage = "Could not determine your current location. Please ensure location services are enabled on your device and try again.";
          } else if (err.code === 3) {
            userFriendlyMessage = "Attempting to get your location timed out. Please try again.";
          }
          setError(userFriendlyMessage);
          setIsLoading(false);
        }
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge, 
      }
    );
  }, [permissionStatus, enableHighAccuracy, timeout, maximumAge, maxRetries, retryDelay, useCache, cacheKey]);

  const getLocation = useCallback(() => {
    if (isLoading && !isFromCache) { 
       console.log("Geolocation fetch already in progress and not showing cache.");
       return; 
    }

    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setPermissionStatus("denied");
      return;
    }
   
    if (navigator.permissions) {
        navigator.permissions.query({ name: "geolocation" }).then(status => {
            setPermissionStatus(status.state);
            if (status.state === "denied") {
                setError("Location permission has been denied. Please enable it in your browser settings.");
            } else {
                performGeolocationRequest(1);
            }
        }).catch(e => {
            console.warn("Could not re-query permission status before fetch, proceeding with attempt:", e);
            performGeolocationRequest(1); 
        });
    } else {
        performGeolocationRequest(1);
    }
  }, [isLoading, isFromCache, permissionStatus, performGeolocationRequest]);
  
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return { location, error, isLoading, permissionStatus, getLocation, isFromCache };
};

export default useGeolocation;
