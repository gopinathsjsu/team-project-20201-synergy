import axios from "axios";
import { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
  Chip,
  Paper,
  Grid,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function ReservationsManager(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/fetch`,
        { withCredentials: true }
      );
      const bookingsData = response.data?.data;
      setBookings(bookingsData);
    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message: `Error fetching bookings: ${err.message}`,
        severity: "error",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCancelBooking = async (bookingId) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/cancel/${bookingId}`,
        { withCredentials: true }
      );

      // Refresh bookings after cancellation
      await fetchBookings();

      setSnackbar({
        open: true,
        message: "Booking cancelled successfully",
        severity: "success",
      });
    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message: `Error cancelling booking: ${err.message}`,
        severity: "error",
      });
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircleIcon fontSize="small" />;
      case "cancelled":
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!bookings?.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <RestaurantIcon
            sx={{ fontSize: 60, color: "primary.light", opacity: 0.7 }}
          />
        </Box>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          You have no bookings yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          When you make a reservation, it will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking.id}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderLeft: "6px solid",
                  borderColor: `${getStatusColor(booking.status)}.main`,
                }}
              >
                <CardContent sx={{ py: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={7}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <RestaurantIcon color="primary" />
                          <Typography variant="h5" fontWeight={600}>
                            {booking.restaurantName}
                          </Typography>
                        </Box>

                        <Box display="flex" flexWrap="wrap" gap={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="body1">
                              {dayjs(booking.bookingDate).format(
                                "MMM D, YYYY"
                              )}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body1">
                              {dayjs(booking.bookingTime, "HH:mm:ss").format(
                                "h:mm A"
                              )}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <PeopleIcon fontSize="small" color="action" />
                            <Typography variant="body1">
                              {booking.partySize}{" "}
                              {booking.partySize === 1 ? "person" : "people"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems={{ xs: "flex-start", sm: "flex-end" }}
                        height="100%"
                        justifyContent="space-between"
                      >
                        <Chip
                          icon={getStatusIcon(booking.status)}
                          label={
                            booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)
                          }
                          color={getStatusColor(booking.status)}
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />

                        <Box mt={{ xs: 2, sm: 0 }}>
                          {booking.email && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1, fontStyle: "italic" }}
                            >
                              Confirmation sent to: {booking.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                <Divider />

                <CardActions
                  sx={{ px: 3, py: 2, justifyContent: "flex-end" }}
                >
                  {booking.status !== "cancelled" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelBooking(booking.id)}
                      startIcon={<CancelIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 2,
                      }}
                    >
                      Cancel Reservation
                    </Button>
                  )}
                  {booking.status === "cancelled" && (
                    <Typography
                      variant="body2"
                      color="error.main"
                      sx={{ fontWeight: 500 }}
                    >
                      This reservation has been cancelled
                    </Typography>
                  )}
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ReservationsManager;
