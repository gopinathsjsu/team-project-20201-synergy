import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import dayjs from "dayjs";
import { Router, useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "@/AuthContext/AuthContext";

export default function RestaurantCard({ restaurant, searchPayload }) {
  const {
    name,
    address,
    cuisineType,
    costRating,
    distance,
    availableTimeSlots,
    mainPhotoUrl,
    id,
  } = restaurant;

  const router = useRouter();

  const { isLoggedIn, setOpenLoginModal } = useContext(AuthContext);

  const { date, time, partySize } = searchPayload;

  const onSlotClick = (timeSlot) => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    router.push({
      pathname: "/booking",
      query: {
        date,
        time: timeSlot,
        partySize,
      },
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={mainPhotoUrl || "/images/placeholder.png"}
        alt={name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ px: 2.5, py: 2 }}>
        {/* Name */}
        <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
          {name}
        </Typography>

        {/* Address */}
        <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" noWrap>
            {address}
          </Typography>
        </Stack>

        {/* Cuisine • Price • Distance */}
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Typography variant="body2" color="text.secondary">
            {cuisineType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {"$".repeat(costRating)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {distance.toFixed(2)} mi
          </Typography>
        </Stack>

        {/* Available Slots */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {availableTimeSlots?.map((slot) => (
            <Chip
              key={slot}
              label={slot}
              size="small"
              clickable
              sx={{
                px: 1,
                bgcolor: "primary.light",
                color: "primary.white",
                fontWeight: 500,
              }}
              onClick={() => onSlotClick(slot)}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            py: 1.25,
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            },
          }}
          href={`/restaurant/${id}?bookingDate=${date || dayjs()}&bookingTime=${
            time || "20:00"
          }&partySize=${partySize || 2}`}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}
