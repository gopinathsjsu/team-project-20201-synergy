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

function ReservationForm(props) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [restaurantList, setRestaurantList] = useState([]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  const handleLocationChange = async (e, newValue) => {
    const newRestaurantList = await fetchRestaurantList(newValue);
    setRestaurantList(newRestaurantList);
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
          {/* <Autocomplete
            freeSolo
            sx={{ width: 250 }}
            options={[]}
            onChange={
              handleLocationChange
            }
            onInputChange={
              handleLocationChange
            }
            renderInput={(params) => (
              <TextField
                label="Choose Location, Restaurant or Cuisine"
                placeholder="Location, Restaurant or Cuisine"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                {...params}
              />
            )}
          /> */}
          <PlacesAutocomplete />
          <Button variant="contained" endIcon={<SendSharpIcon />}>
            <Typography>Let&apos;s&nbsp;Go</Typography>
          </Button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default ReservationForm;
