import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Chip,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MapWithPin from "@/components/mapComponent/MapView";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TimeSelect from "@/components/timePicker/TimePicker";
import Image from "next/image";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { AuthContext } from "@/AuthContext/AuthContext";
import {
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function RestaurantPage(props) {
  const [restaurant, setRestaurantData] = useState({});

  const { isLoggedIn, setOpenLoginModal } = useContext(AuthContext);

  const router = useRouter();
  const { query } = router;
  const { restaurantId, bookingDate, bookingTime, partySize } = query;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs(bookingDate));
  const [selectedTime, setSelectedTime] = useState("");
  const [totalPerson, setTotalPerson] = useState("");

  const fetchRestaurantDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/restaurants/${restaurantId}`
      );
      const restaurantData = response?.data?.data;
      setRestaurantData(restaurantData);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setSelectedDate(dayjs(bookingDate));
    setSelectedTime(bookingTime);
    setTotalPerson(partySize);
    if (restaurantId) {
      fetchRestaurantDetails();
    }
  }, [bookingDate, bookingTime, partySize, restaurantId]);

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const disablePastDates = (date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const handleTotalPerson = (e) => {
    const value = e.target?.value;
    setTotalPerson(value);
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    router.push(
      {
        pathname: `/booking`,
        query: {
          restaurantId,
          restaurantName: restaurant?.name,
          date: formattedDate,
          time: selectedTime,
          partySize,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", margin: 20 }}>
        <CircularProgress />
      </Box>
    );

  const {
    name,
    mainPhotoUrl,
    cuisineType,
    costRating,
    description,
    contactPhone,
    addressLine,
    city,
    state,
    zipCode,
    country,
    longitude,
    latitude,
    operatingHours,
    timeSlots,
  } = restaurant;

  return (
    <Box marginX={20} marginBottom={10}>
      <Box
        component="main"
        px={{ xs: 2, md: 4 }}
        py={{ xs: 3, md: 5 }}
        sx={{ bgcolor: "grey.100", minHeight: "100vh" }}
      >
        {/* Hero Image */}
        <Paper
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
        >
          <CardMedia
            component="img"
            height="300"
            image={
              mainPhotoUrl ||
              "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg"
            }
            alt={name}
            sx={{ objectFit: "cover" }}
          />
        </Paper>

        <Box marginTop={4} display="flex" gap={4}>
          <Paper elevation={3} sx={{ p: 2, width: "60%" }}>
            <Box display="flex" gap={3} paddingY={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Choose Booking Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  shouldDisableDate={disablePastDates}
                  sx={{ width: 250 }}
                />
              </LocalizationProvider>

              <TimeSelect
                label="Booking Time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
              />

              <TextField
                sx={{ width: 250 }}
                select
                label="Choose total person"
                value={totalPerson}
                onChange={handleTotalPerson}
              >
                {Array(20)
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
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              onClick={handleBookNow}
              sx={{
                borderRadius: "32px", // pill shape
                px: 4, // horizontal padding
                py: 1.5, // vertical padding
                textTransform: "none", // preserve casing
                fontWeight: 600, // make it pop
                boxShadow: (theme) => theme.shadows[4],
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (theme) => theme.shadows[8],
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              {isLoggedIn ? `Book Now` : `Sign In to Book now`}
            </Button>
          </Paper>
          {latitude && longitude && (
            <MapWithPin lat={latitude} lng={longitude} />
          )}
        </Box>

        {/* Basic Info */}
        <Paper
          elevation={2}
          sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, marginTop: 5 }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {name}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Chip label={cuisineType} color="primary" size="small" />
            <Chip
              label={"$".repeat(costRating)}
              variant="outlined"
              size="small"
            />
          </Stack>

          <Typography variant="body1" color="text.secondary" mb={2}>
            {description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Address & Contact */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            📍 {addressLine}, {city}, {state} {zipCode}, {country}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            📞 {contactPhone}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Operating Hours */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            ⏰ Operating Hours
          </Typography>
          <Stack spacing={1} mb={2}>
            {operatingHours?.map((oh) => (
              <Typography key={oh.dayOfWeek} variant="body2">
                <strong>{WEEK_DAYS[oh.dayOfWeek]}:</strong>{" "}
                {oh.openTime.slice(0, 5)} – {oh.closeTime.slice(0, 5)}
              </Typography>
            ))}
          </Stack>

          {/* Available Time Slots */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            🕒 Available Time Slots
          </Typography>
          {timeSlots?.map((daySlot) => (
            <Accordion key={daySlot.dayOfWeek} elevation={1}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={500}>
                  {WEEK_DAYS[daySlot.dayOfWeek]}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {daySlot.times.map((t) => (
                    <Chip
                      key={t}
                      label={t.slice(0, 5)}
                      size="small"
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.dark",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}
