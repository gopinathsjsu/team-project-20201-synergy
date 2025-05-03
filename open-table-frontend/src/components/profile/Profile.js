import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import _size from "lodash/size";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { getRestaurantsById } from "./profile.helper";

function Profile(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    (async function fetchAllBookings() {
      setIsLoading(true);
      try {
        const response = axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/fetch`,
          { withCredentials: true }
        );
        const bookingsData = response.data?.data;
        setBookings(bookingsData);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    })();
  }, []);

  const restaurantById = useMemo(() => {
    if (_size(bookings)) {
      return getRestaurantsById(bookings);
    }
  }, [bookings]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", margin: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!bookings?.length) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          You have no bookings yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box px={{ xs: 2, md: 4 }} py={{ xs: 3, md: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Your Bookings
      </Typography>

      <Stack spacing={3}>
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            elevation={2}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Typography variant="h6" fontWeight={600} noWrap>
                  {booking.restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(booking.date).format("MMM D, YYYY")}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                mt={1}
                flexWrap="wrap"
              >
                <Typography variant="body1">
                  {dayjs(booking.time, "HH:mm").format("h:mm A")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Party of {booking.partySize}
                </Typography>
              </Stack>
            </CardContent>

            <Divider />

            <CardActions sx={{ px: 2, py: 1 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onCancel(booking.id)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  ml: "auto",
                }}
              >
                Cancel Booking
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default Profile;
