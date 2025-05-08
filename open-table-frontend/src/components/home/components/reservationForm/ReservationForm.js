import { useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
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

const MAX_PERSONS = 20;

function ReservationForm({ onSearchSubmit }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [personCount, setPersonCount] = useState(2);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  const handleLocationChange = (place) => {
    setSelectedLocation(place);
  };

  const disablePastDates = (date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const handlePersonCount = (e) => {
    const totalPerson = e.target.value;
    setPersonCount(totalPerson);
  };

  const handleReservationSubmit = () => {
    if (!selectedLocation) return null;
    const formattedSelectedDate = selectedDate.format("YYYY-MM-DD");
    const formattedSelectedTime = selectedTime.format("HH:mm:ss");
    const lat = selectedLocation?.geometry?.location?.lat();
    const lng = selectedLocation?.geometry?.location?.lng();
    const req = {
      date: formattedSelectedDate,
      time: formattedSelectedTime,
      partySize: personCount,
      latitude: lat,
      longitude: lng,
    };
    // const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/restaurants/search`;
    onSearchSubmit(req);
  };

  return (
    <Box
      paddingX={8}
      paddingY={6}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" justifyContent="center" m={3} gap={2}>
          <DatePicker
            label="Choose Booking Date"
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={disablePastDates}
          />
          <TimePicker
            label="Choose Booking Time"
            value={selectedTime}
            onChange={handleTimeChange}
          />
          <TextField
            className={styles.peoplePicker}
            select
            label="Choose total person"
            defaultValue={2}
            onChange={handlePersonCount}
            value={personCount}
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
          <PlacesAutocomplete onLocationChange={handleLocationChange} />
          <Button
            onClick={handleReservationSubmit}
            variant="contained"
            endIcon={<SendSharpIcon />}
          >
            <Typography>Let&apos;s&nbsp;Go</Typography>
          </Button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default ReservationForm;
