import { useEffect, useState } from "react";
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

function ReservationForm({ onSearchSubmit, onSearchChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState("20:00");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [personCount, setPersonCount] = useState(2);
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
    setSearchText("");
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
    setSearchText(searchText);
  };

  const handleReservationSubmit = () => {
    if (!selectedLocation) return null;
    const formattedSelectedDate = selectedDate.format("YYYY-MM-DD");
    // const formattedSelectedTime = selectedTime.format("HH:mm:ss");
    const lat = selectedLocation?.geometry?.location?.lat();
    const lng = selectedLocation?.geometry?.location?.lng();
    const req = {
      date: formattedSelectedDate,
      time: selectedTime,
      partySize: personCount,
      latitude: lat,
      longitude: lng,
      searchText,
    };
    // const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/restaurants/search`;
    onSearchSubmit(req);
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
        bgcolor: "beige", // soft branded background
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          display="flex"
          justifyContent="center"
          m={3}
          gap={2}
          sx={{
            bgcolor: "background.paper", // crisp white “card”
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
              minWidth: 120,
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

          {/* Gradient “Let’s Go” button */}
          <Button
            onClick={handleReservationSubmit}
            variant="contained"
            endIcon={<SendSharpIcon />}
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
            Let’s Go
          </Button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default ReservationForm;
