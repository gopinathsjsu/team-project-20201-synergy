import { useEffect, useState, useRef } from "react";
import _debounce from "lodash/debounce";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { fetchRestaurantList } from "./reservationForm.helpers";
import PlacesAutocomplete from "../PlacesAutocomplete/PlacesAutocomplete";
import styles from "./reservationForm.module.scss";
import TimeSelect from "@/components/timePicker/TimePicker";

const MAX_PERSONS = 20;
const LOCATION_CACHE_KEY = "userGeolocation";
const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

function ReservationForm({ onSearchSubmit, onSearchChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState("20:00");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [personCount, setPersonCount] = useState(2);
  const [searchText, setSearchText] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const searchResultsRef = useRef(null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onSearchChange({
      date: newDate.format("YYYY-MM-DD"),
      time: selectedTime,
      partySize: personCount,
    });
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    onSearchChange({
      date: selectedDate.format("YYYY-MM-DD"),
      time: newTime,
      partySize: personCount,
    });
  };

  const handleLocationChange = (place) => {
    setSearchText("");
    setSelectedLocation(place);
  };

  // Function to create a location object similar to what Google Places would return
  const createLocationFromCoords = (latitude, longitude) => {
    return {
      geometry: {
        location: {
          lat: () => latitude,
          lng: () => longitude,
        },
      },
    };
  };

  // Get location from localStorage
  const getLocationFromStorage = () => {
    try {
      const cachedItem = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedItem) {
        const { data: cachedLocation, timestamp } = JSON.parse(cachedItem);

        // Check if cache is still valid (not expired)
        if (Date.now() - timestamp < CACHE_MAX_AGE_MS) {
          console.log(
            "Using cached location from localStorage:",
            cachedLocation
          );
          return cachedLocation;
        } else {
          console.log("Cached location expired, requesting fresh location");
        }
      }
    } catch (error) {
      console.error("Error reading location from localStorage:", error);
    }
    return null;
  };

  // Save location to localStorage
  const saveLocationToStorage = (location) => {
    try {
      localStorage.setItem(
        LOCATION_CACHE_KEY,
        JSON.stringify({
          data: location,
          timestamp: Date.now(),
        })
      );
      console.log("Location saved to localStorage successfully");
    } catch (error) {
      console.error("Error saving location to localStorage:", error);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError("");

    // First try to get location from localStorage
    const cachedLocation = getLocationFromStorage();

    if (cachedLocation) {
      // Use cached location
      const { latitude, longitude } = cachedLocation;
      const locationObj = createLocationFromCoords(latitude, longitude);
      setSelectedLocation(locationObj);
      setIsLocating(false);
      return;
    }

    // If no cached location, use geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location detected:", latitude, longitude);

          // Create a location object from the coordinates
          const locationObj = createLocationFromCoords(latitude, longitude);
          setSelectedLocation(locationObj);

          // Save location to localStorage
          saveLocationToStorage({
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });

          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLocationError(`Couldn't get your location: ${error.message}`);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  useEffect(() => {
    // Try to get the current location when component mounts
    getCurrentLocation();
  }, []);

  const disablePastDates = (date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const handlePersonCount = (e) => {
    const totalPerson = e.target.value;
    setPersonCount(totalPerson);
    onSearchChange({
      date: selectedDate.format("YYYY-MM-DD"),
      time: selectedTime,
      partySize: totalPerson,
    });
  };

  const handleSearchChange = (searchText) => {
    // Ensure searchText is always a string
    setSearchText(searchText || "");
  };

  const scrollToSearchResults = () => {
    // More robust approach to scroll to search results with multiple attempts
    console.log("Attempting to scroll to search results...");

    const attemptScroll = (attemptNumber = 1, maxAttempts = 5) => {
      // Find the search results section
      const searchResultsSection = document.getElementById(
        "search-results-section"
      );

      if (searchResultsSection) {
        console.log(
          `Found search results section on attempt ${attemptNumber}, scrolling now`
        );

        // Use both scrollIntoView and manual scroll for better compatibility
        searchResultsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Also use window.scrollTo as a fallback
        const rect = searchResultsSection.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - 50; // 50px offset from top

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });

        return true;
      } else if (attemptNumber < maxAttempts) {
        console.log(
          `Search results section not found on attempt ${attemptNumber}, trying again in 300ms`
        );
        // Try again with increased delay
        const nextDelay = 300 * attemptNumber;
        setTimeout(() => attemptScroll(attemptNumber + 1), nextDelay);
        return false;
      } else {
        console.error(
          "Failed to find search results section after multiple attempts"
        );
        return false;
      }
    };

    // Start the first attempt with a base delay
    setTimeout(() => attemptScroll(), 200);
  };

  const handleReservationSubmit = () => {
    if (!selectedLocation && !searchText) return null;
    const formattedSelectedDate = selectedDate.format("YYYY-MM-DD");
    // const formattedSelectedTime = selectedTime.format("HH:mm:ss");
    const lat = selectedLocation?.geometry?.location?.lat();
    const lng = selectedLocation?.geometry?.location?.lng();

    // Ensure searchText is a string, not null
    const safeSearchText = searchText || "";

    const req = {
      date: formattedSelectedDate,
      time: selectedTime,
      partySize: personCount,
      latitude: lat,
      longitude: lng,
      searchText: safeSearchText,
    };

    onSearchSubmit(req);

    // Delay scroll attempt to allow time for results to load and DOM to update
    scrollToSearchResults();
  };

  return (
    <Box
      paddingX={8}
      paddingY={6}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 8 },
        bgcolor: "white", // soft branded background
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          display="flex"
          justifyContent="center"
          m={3}
          gap={2}
          sx={{
            bgcolor: "background.paper", // crisp white "card"
            borderRadius: 2,
            p: 3,
          }}
        >
          {/* DatePicker with primary‐themed outlines */}
          <DatePicker
            label="Choose Booking Date"
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={disablePastDates}
            selectedDate={selectedDate}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "primary.main" },
                    "&:hover fieldset": { borderColor: "primary.dark" },
                    "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "primary.main" },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "secondary.main",
                  },
                }}
              />
            )}
          />

          {/* TimeSelect with matching outline color */}
          <TimeSelect
            label="Booking Time"
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            selectedDate={selectedDate.format("YYYY-MM-DD")}
            sx={{
              "& .MuiOutlinedInput-root fieldset": {
                borderColor: "primary.main",
              },
            }}
          />

          {/* People picker with primary outlines and label */}
          <TextField
            select
            label="Choose total person"
            defaultValue={2}
            onChange={handlePersonCount}
            value={personCount}
            sx={{
              minWidth: 160,
              "& .MuiOutlinedInput-root fieldset": {
                borderColor: "primary.main",
              },
              "& .MuiInputLabel-root": { color: "primary.main" },
            }}
          >
            {Array(MAX_PERSONS)
              .fill(0)
              .map(
                (_, index) =>
                  index !== 0 && (
                    <MenuItem key={index} value={index + 1}>
                      {`${index + 1} People`}
                    </MenuItem>
                  )
              )}
          </TextField>

          {/* PlacesAutocomplete styled like the others */}
          <PlacesAutocomplete
            onSearchChange={handleSearchChange}
            onLocationChange={handleLocationChange}
            sx={{
              "& .MuiOutlinedInput-root fieldset": {
                borderColor: "primary.main",
              },
            }}
          />

          {/* Gradient "Let's Go" button */}
          <Button
            onClick={handleReservationSubmit}
            variant="contained"
            endIcon={<SendSharpIcon />}
            disabled={isLocating}
            sx={{
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: "#fff",
              "&:hover": {
                background: (theme) =>
                  `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            Let&apos;s Go
          </Button>
        </Box>
      </LocalizationProvider>
      {locationError && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block", textAlign: "center" }}
        >
          {locationError}
        </Typography>
      )}
    </Box>
  );
}

export default ReservationForm;
